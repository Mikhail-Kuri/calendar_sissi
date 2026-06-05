import dotenv from "dotenv";
import crypto from "crypto";
dotenv.config({ path: "../.env" });

console.log("✅ RESEND:", process.env.RESEND_API_KEY);

import express from "express";
import cors from "cors";
import { google } from "googleapis";

import { sendConfirmationEmail } from "../src/services/mail/sendConfirmationEmail.js";
import { sendVerificationEmail } from "../src/services/mail/sendVerificationEmail.js";
import { saveCode, getCode, deleteCode } from "../src/services/mail/verificationStore.js";


const app = express();

const locks = new Map();

function acquireLock(eventId) {
  if (locks.get(eventId)) return false;
  locks.set(eventId, true);
  return true;
}

function releaseLock(eventId) {
  locks.delete(eventId);
}

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

const allowedOrigins = [
  "http://localhost:3000",
  "https://glorious-doodle-66jjjvvg7v7h5v9g-3000.app.github.dev",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

/*app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));*/

/*app.use(cors({
  origin: true,
  credentials: true,
}));*/

app.options("*", cors());

app.use(express.json());

if (
  !process.env.GOOGLE_PRIVATE_KEY ||
  !process.env.GOOGLE_CLIENT_EMAIL ||
  !process.env.GOOGLE_CALENDAR_ID ||
  !process.env.RESEND_API_KEY
) {
  console.error(
    "❌ Veuillez définir GOOGLE_PRIVATE_KEY, GOOGLE_CLIENT_EMAIL et GOOGLE_CALENDAR_ID dans le .env",
  );
  process.exit(1);
}

const auth = new google.auth.JWT(
  process.env.GOOGLE_CLIENT_EMAIL,
  null,
  process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  ["https://www.googleapis.com/auth/calendar"],
);

const calendar = google.calendar({ version: "v3", auth });

app.get("/appointments", async (req, res) => {
  try {
    const { from, to } = req.query;

    const response = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      maxResults: 2500,
      singleEvents: true,
      orderBy: "startTime",

      // 🔥 FILTRE GOOGLE CALENDAR
      timeMin: from ? new Date(from).toISOString() : undefined,
      timeMax: to ? new Date(to).toISOString() : undefined,
    });

    const events = response.data.items
      .filter((e) => e.transparency === "transparent")
      .map((e) => ({
        id: e.id,
        title: e.summary || "Sans titre",

        start: new Date(e.start.dateTime || e.start.date),
        end: new Date(e.end.dateTime || e.end.date),

        description: e.description || "",
        status: e.status || "tentative",
        visibility: e.visibility || "default",
        transparency: e.transparency,
      }));

    res.status(200).json(events);
  } catch (err) {
    console.error("Erreur récupération rendez-vous :", err);
    res.status(500).json({
      success: false,
      message: "Erreur lors du chargement des rendez-vous.",
    });
  }
});

// ======================================================
// 🔐 ÉTAPE 1 — Valider le slot + envoyer le code
// ======================================================
app.post("/appointments/request", async (req, res) => {
  const { title, description, start, end, email, phone, breakMinute, eventId } = req.body;

  if (!eventId || !start || !end || !email) {
    return res.status(400).json({
      success: false,
      message: "eventId, start, end et email sont obligatoires.",
    });
  }

  const resStart = new Date(start);
  const resEnd = new Date(end);

  try {
    // 1️⃣ GET ORIGINAL SLOT
    const original = await calendar.events.get({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      eventId,
    });

    const originalStart = new Date(original.data.start.dateTime);
    const originalEnd = new Date(original.data.end.dateTime);

    if (resStart < originalStart || resEnd > originalEnd) {
      return res.status(400).json({
        success: false,
        message: "La réservation est hors du slot disponible.",
      });
    }

    // 2️⃣ RE-CHECK GOOGLE CALENDAR
    const freshEvent = await calendar.events.get({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      eventId,
    });

    if (!freshEvent.data || freshEvent.data.status === "cancelled") {
      return res.status(409).json({
        success: false,
        message: "Ce créneau n'est plus disponible.",
      });
    }

    // 3️⃣ OVERLAP CHECK
    const existingEvents = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      timeMin: resStart.toISOString(),
      timeMax: resEnd.toISOString(),
      singleEvents: true,
    });

    const hasConflict = existingEvents.data.items.some((ev) => {
      const evStart = new Date(ev.start.dateTime || ev.start.date);
      const evEnd = new Date(ev.end.dateTime || ev.end.date);
      return resStart < evEnd && resEnd > evStart && ev.transparency !== "transparent";
    });

    if (hasConflict) {
      return res.status(409).json({
        success: false,
        message: "Quelqu'un a déjà réservé ce créneau.",
      });
    }

    // ✅ Slot valide → générer et envoyer le code
    const token = crypto.randomUUID();
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    saveCode(token, { code, eventId, title, description, start, end, email, phone, breakMinute });

    await sendVerificationEmail({ email, code });

    return res.status(200).json({
      success: true,
      token,
      message: "Code envoyé à votre adresse email.",
    });

  } catch (error) {
    console.error("Erreur /appointments/request:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la validation du créneau.",
    });
  }
});

// ======================================================
// ✅ ÉTAPE 2 — Vérifier le code + créer le rendez-vous
// ======================================================
app.post("/appointments/confirm", async (req, res) => {
  const { token, code } = req.body;

  if (!token || !code) {
    return res.status(400).json({
      success: false,
      message: "Token et code sont obligatoires.",
    });
  }

  // 🔐 Vérifier le code
  const pending = getCode(token);

  if (!pending) {
    return res.status(410).json({
      success: false,
      message: "Code expiré ou invalide.",
    });
  }

  if (pending.code !== code) {
    return res.status(401).json({
      success: false,
      message: "Code incorrect.",
    });
  }

  if (Date.now() > pending.expiresAt) {
    deleteCode(token);
    return res.status(410).json({
      success: false,
      message: "Code expiré.",
    });
  }

  // ✅ Code valide → usage unique, on supprime immédiatement
  deleteCode(token);

  // Reconstruire les variables depuis le store
  const { eventId, title, description, start, end, email, phone, breakMinute } = pending;

  if (!acquireLock(eventId)) {
    return res.status(409).json({
      success: false,
      message: "Ce créneau est déjà en cours de réservation.",
    });
  }

  try {
    const resStart = new Date(start);
    const resEnd = new Date(end);
    const breakMs = parseInt(breakMinute || 0) * 60 * 1000;
    const bookedEndWithBreak = new Date(resEnd.getTime() + breakMs);

    // 1️⃣ GET ORIGINAL SLOT
    const original = await calendar.events.get({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      eventId,
    });

    const originalStart = new Date(original.data.start.dateTime);
    const originalEnd = new Date(original.data.end.dateTime);

    if (resStart < originalStart || resEnd > originalEnd) {
      return res.status(400).json({
        success: false,
        message: "La réservation est hors du slot disponible.",
      });
    }

    // 2️⃣ RE-CHECK GOOGLE CALENDAR
    const freshEvent = await calendar.events.get({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      eventId,
    });

    if (!freshEvent.data || freshEvent.data.status === "cancelled") {
      return res.status(409).json({
        success: false,
        message: "Ce créneau n'est plus disponible.",
      });
    }

    // 3️⃣ OVERLAP CHECK
    const existingEvents = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      timeMin: resStart.toISOString(),
      timeMax: resEnd.toISOString(),
      singleEvents: true,
    });

    const hasConflict = existingEvents.data.items.some((ev) => {
      const evStart = new Date(ev.start.dateTime || ev.start.date);
      const evEnd = new Date(ev.end.dateTime || ev.end.date);
      return resStart < evEnd && resEnd > evStart && ev.transparency !== "transparent";
    });

    if (hasConflict) {
      return res.status(409).json({
        success: false,
        message: "Quelqu'un a déjà réservé ce créneau.",
      });
    }

    // 4️⃣ SPLIT LOGIC
    const eventsToCreate = [];

    if (resStart > originalStart) {
      eventsToCreate.push({
        summary: "AVAILABLE",
        start: { dateTime: originalStart.toISOString() },
        end: { dateTime: resStart.toISOString() },
        transparency: "transparent",
        colorId: 2,
      });
    }

    eventsToCreate.push({
      summary: title || "BOOKED",
      description: description || "",
      start: { dateTime: resStart.toISOString() },
      end: { dateTime: bookedEndWithBreak.toISOString() },
      transparency: "opaque",
      colorId: 5,
      extendedProperties: {
        private: {
          type: "BOOKED",
          email,
          phone,
          breakMinute: breakMinute || 0,
        },
      },
    });

    if (bookedEndWithBreak < originalEnd) {
      eventsToCreate.push({
        summary: "AVAILABLE",
        start: { dateTime: bookedEndWithBreak.toISOString() },
        end: { dateTime: originalEnd.toISOString() },
        transparency: "transparent",
        colorId: 2,
      });
    }

    // 5️⃣ CREATE EVENTS
    const createdEvents = [];

    for (const ev of eventsToCreate) {
      const created = await calendar.events.insert({
        calendarId: process.env.GOOGLE_CALENDAR_ID,
        requestBody: ev,
      });
      createdEvents.push(created.data);
    }

    // 6️⃣ DELETE ORIGINAL SLOT
    await calendar.events.delete({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      eventId,
    });

    // 🔥 EMAIL DE CONFIRMATION
    // sendConfirmationEmail({
    //   email,
    //   start: resStart,
    //   end: resEnd,
    // }).catch((err) => console.error("Email failed:", err));

    return res.status(200).json({
      success: true,
      message: "Réservation créée avec succès.",
      created: createdEvents.map((e) => e.id),
    });

  } catch (error) {
    console.error("Erreur /appointments/confirm:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la création du rendez-vous.",
    });
  } finally {
    releaseLock(eventId);
  }
});

app.put("/appointments/:id", async (req, res) => {
  try {
    const eventId = req.params.id;
    const { newStart } = req.body;

    if (!newStart) {
      return res.status(400).json({
        success: false,
        message: "La nouvelle date de début est obligatoire.",
      });
    }

    const newEnd = new Date(
      new Date(newStart).getTime() + 4 * 60 * 60 * 1000,
    ).toISOString();

    const response = await calendar.events.patch({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      eventId: eventId,
      requestBody: {
        start: { dateTime: newStart, timeZone: "America/Toronto" },
        end: { dateTime: newEnd, timeZone: "America/Toronto" },
      },
    });

    res.status(200).json({ success: true, updated: response.data });
  } catch (err) {
    console.error("Erreur modification événement:", err);
    res.status(500).json({ success: false, message: "Erreur modification." });
  }
});

// Démarrage du serveur
const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Serveur en ligne sur http://localhost:${PORT}`);
});
