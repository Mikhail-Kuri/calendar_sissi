import crypto from "crypto";

import {
  listAvailableSlots,
  patchEvent,
} from "../services/calendar.service.js";

import { validateSlot, createBooking } from "../services/booking.service.js";
import { sendVerificationEmail } from "../services/mail/sendVerificationEmail.js";

import {
  saveCode,
  getCode,
  deleteCode,
} from "../services/mail/verificationStore.js";

import { acquireLock, releaseLock } from "../middleware/lock.js";

export async function getAppointments(req, res) {
  try {
    const events = await listAvailableSlots(req.query);
    res.status(200).json(events);
  } catch (err) {
    console.error("Erreur GET /appointments:", err);
    res.status(500).json({
      success: false,
      message: "Erreur lors du chargement des rendez-vous.",
    });
  }
}

export async function requestAppointment(req, res) {
  const { title, description, start, end, email, phone, breakMinute, eventId } =
    req.body;

  if (!eventId || !start || !end || !email) {
    return res.status(400).json({
      success: false,
      message: "eventId, start, end et email sont obligatoires.",
    });
  }

  try {
    await validateSlot({
      eventId,
      resStart: new Date(start),
      resEnd: new Date(end),
    });

    const token = crypto.randomUUID();
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    saveCode(token, {
      code,
      eventId,
      title,
      description,
      start,
      end,
      email,
      phone,
      breakMinute,
    });
    await sendVerificationEmail({ email, code });

    return res.status(200).json({
      success: true,
      token,
      message: "Code envoyé à votre adresse email.",
    });
  } catch (err) {
    if (err.status)
      return res
        .status(err.status)
        .json({ success: false, message: err.message });
    console.error("Erreur /appointments/request:", err);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la validation du créneau.",
    });
  }
}

export async function confirmAppointment(req, res) {
  const { token, code } = req.body;

  if (!token || !code) {
    return res
      .status(400)
      .json({ success: false, message: "Token et code sont obligatoires." });
  }

  const pending = getCode(token);

  if (!pending)
    return res
      .status(410)
      .json({ success: false, message: "Code expiré ou invalide." });
  if (pending.code !== code)
    return res.status(401).json({ success: false, message: "Code incorrect." });
  if (Date.now() > pending.expiresAt) {
    deleteCode(token);
    return res.status(410).json({ success: false, message: "Code expiré." });
  }

  deleteCode(token);

  const { eventId, title, description, start, end, email, phone, breakMinute } =
    pending;

  if (!acquireLock(eventId)) {
    return res.status(409).json({
      success: false,
      message: "Ce créneau est déjà en cours de réservation.",
    });
  }

  try {
    const created = await createBooking({
      eventId,
      title,
      description,
      resStart: new Date(start),
      resEnd: new Date(end),
      email,
      phone,
      breakMinute,
    });

    return res.status(200).json({
      success: true,
      message: "Réservation créée avec succès.",
      created,
    });
  } catch (err) {
    if (err.status)
      return res
        .status(err.status)
        .json({ success: false, message: err.message });
    console.error("Erreur /appointments/confirm:", err);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la création du rendez-vous.",
    });
  } finally {
    releaseLock(eventId);
  }
}

export async function updateAppointment(req, res) {
  try {
    const { newStart } = req.body;
    if (!newStart)
      return res.status(400).json({
        success: false,
        message: "La nouvelle date de début est obligatoire.",
      });

    const newEnd = new Date(
      new Date(newStart).getTime() + 4 * 60 * 60 * 1000,
    ).toISOString();

    const updated = await patchEvent(req.params.id, {
      start: { dateTime: newStart, timeZone: "America/Toronto" },
      end: { dateTime: newEnd, timeZone: "America/Toronto" },
    });

    res.status(200).json({ success: true, updated });
  } catch (err) {
    console.error("Erreur PUT /:id:", err);
    res.status(500).json({ success: false, message: "Erreur modification." });
  }
}
