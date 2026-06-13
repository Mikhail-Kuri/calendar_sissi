import {
  getEvent,
  listEventsBetween,
  createEvent,
  deleteEvent,
} from "./calendar.service.js";

export async function validateSlot({ eventId, resStart, resEnd }) {
  const original = await getEvent(eventId);
  const originalStart = new Date(original.start.dateTime);
  const originalEnd = new Date(original.end.dateTime);

  if (resStart < originalStart || resEnd > originalEnd) {
    throw { status: 400, message: "La réservation est hors du slot disponible." };
  }

  if (!original || original.status === "cancelled") {
    throw { status: 409, message: "Ce créneau n'est plus disponible." };
  }

  const existing = await listEventsBetween(resStart, resEnd);
  const hasConflict = existing.some((ev) => {
    const evStart = new Date(ev.start.dateTime || ev.start.date);
    const evEnd = new Date(ev.end.dateTime || ev.end.date);
    return resStart < evEnd && resEnd > evStart && ev.transparency !== "transparent";
  });

  if (hasConflict) {
    throw { status: 409, message: "Quelqu'un a déjà réservé ce créneau." };
  }

  return { originalStart, originalEnd };
}

export async function createBooking({
  eventId, title, description,
  resStart, resEnd, email, phone, breakMinute,
}) {
  const breakMs = parseInt(breakMinute || 0) * 60 * 1000;
  const bookedEndWithBreak = new Date(resEnd.getTime() + breakMs);

  const { originalStart, originalEnd } = await validateSlot({ eventId, resStart, resEnd });

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
      private: { type: "BOOKED", email, phone, breakMinute: breakMinute || 0 },
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

  const created = [];
  for (const ev of eventsToCreate) {
    created.push(await createEvent(ev));
  }

  await deleteEvent(eventId);
  return created.map((e) => e.id);
}