import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { google } from 'googleapis';

dotenv.config();
const app = express();

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

const allowedOrigins = [
  "http://localhost:3000",
  "https://glorious-doodle-66jjjvvg7v7h5v9g-3000.app.github.dev"
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

/*app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));*/


/*app.use(cors({
  origin: true,
  credentials: true,
}));*/

app.options('*', cors());

app.use(express.json());

if (!process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_CALENDAR_ID) {
  console.error("❌ Veuillez définir GOOGLE_PRIVATE_KEY, GOOGLE_CLIENT_EMAIL et GOOGLE_CALENDAR_ID dans le .env");
  process.exit(1);
}

const auth = new google.auth.JWT(
  process.env.GOOGLE_CLIENT_EMAIL,
  null,
  process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  ["https://www.googleapis.com/auth/calendar"]
);

const calendar = google.calendar({ version: 'v3', auth });

app.get('/appointments', async (req, res) => {
  try {
    const { from, to } = req.query;

    const response = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      maxResults: 2500,
      singleEvents: true,
      orderBy: 'startTime',

      // 🔥 FILTRE GOOGLE CALENDAR
      timeMin: from ? new Date(from).toISOString() : undefined,
      timeMax: to ? new Date(to).toISOString() : undefined,
    });

    const events = response.data.items
        .filter(e => e.transparency === "transparent")
        .map(e => ({
            id: e.id,
            title: e.summary || "Sans titre",

            start: new Date(e.start.dateTime || e.start.date),
            end: new Date(e.end.dateTime || e.end.date),

            description: e.description || '',
            status: e.status || 'tentative',
            visibility: e.visibility || 'default',
            transparency: e.transparency
        }));

    res.status(200).json(events);

  } catch (err) {
    console.error("Erreur récupération rendez-vous :", err);
    res.status(500).json({
      success: false,
      message: "Erreur lors du chargement des rendez-vous."
    });
  }
});


app.post('/appointments', async (req, res) => {
  try {
    const { eventId, title, description, start, end, email, phone } = req.body;

    if (!eventId || !start || !end) {
      return res.status(400).json({
        success: false,
        message: "eventId, start et end sont obligatoires."
      });
    }

    const original = await calendar.events.get({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      eventId
    });

    const originalStart = new Date(original.data.start.dateTime);
    const originalEnd = new Date(original.data.end.dateTime);

    const resStart = new Date(start);
    const resEnd = new Date(end);

    if (resStart < originalStart || resEnd > originalEnd) {
      return res.status(400).json({
        success: false,
        message: "La réservation est hors du slot disponible."
      });
    }

    const eventsToCreate = [];

    if (resStart > originalStart) {
      eventsToCreate.push({
        summary: "AVAILABLE",
        start: { dateTime: originalStart.toISOString() },
        end: { dateTime: resStart.toISOString() },
        transparency: "transparent",
        colorId: 2
      });
    }

    eventsToCreate.push({
      summary: title || "BOOKED",
      description: description || "",
      start: { dateTime: resStart.toISOString() },
      end: { dateTime: resEnd.toISOString() },
      transparency: "opaque",
      colorId: 5,
      extendedProperties: {
        private: {
          type: "BOOKED",
          email,
          phone
        }
      }
    });

    if (resEnd < originalEnd) {
      eventsToCreate.push({
        summary: "AVAILABLE",
        start: { dateTime: resEnd.toISOString() },
        end: { dateTime: originalEnd.toISOString() },
        transparency: "transparent",
        colorId: 2
      });
    }

    const createdEvents = [];

    for (const ev of eventsToCreate) {
      const created = await calendar.events.insert({
        calendarId: process.env.GOOGLE_CALENDAR_ID,
        requestBody: ev
      });

      createdEvents.push(created.data);
    }

    await calendar.events.delete({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      eventId
    });

    return res.status(200).json({
      success: true,
      message: "Reservation créée avec split",
      created: createdEvents.map(e => e.id)
    });

  } catch (error) {
    console.error("Erreur split appointment:", error);

    return res.status(500).json({
      success: false,
      message: "Erreur lors du split de réservation."
    });
  }
});

app.put('/appointments/:id', async (req, res) => {
  try {
    const eventId = req.params.id;
    const { newStart } = req.body;

    if (!newStart) {
      return res.status(400).json({ success: false, message: "La nouvelle date de début est obligatoire." });
    }

    const newEnd = new Date(new Date(newStart).getTime() + 4 * 60 * 60 * 1000).toISOString();

    const response = await calendar.events.patch({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      eventId: eventId,
      requestBody: {
        start: { dateTime: newStart, timeZone: 'America/Toronto' },
        end: { dateTime: newEnd, timeZone: 'America/Toronto' }
      }
    });

    res.status(200).json({ success: true, updated: response.data });
  } catch (err) {
    console.error("Erreur modification événement:", err);
    res.status(500).json({ success: false, message: "Erreur modification." });
  }
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Serveur en ligne sur http://localhost:${PORT}`);
});
