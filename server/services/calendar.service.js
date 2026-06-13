import { calendar, CALENDAR_ID } from "../config/googleAuth.js";

export async function getEvent(eventId) {
  const res = await calendar.events.get({ calendarId: CALENDAR_ID, eventId });
  return res.data;
}

export async function listEventsBetween(timeMin, timeMax) {
  const res = await calendar.events.list({
    calendarId: CALENDAR_ID,
    timeMin: timeMin.toISOString(),
    timeMax: timeMax.toISOString(),
    singleEvents: true,
  });
  return res.data.items;
}

export async function listAvailableSlots({ from, to } = {}) {
  const res = await calendar.events.list({
    calendarId: CALENDAR_ID,
    maxResults: 2500,
    singleEvents: true,
    orderBy: "startTime",
    timeMin: from ? new Date(from).toISOString() : undefined,
    timeMax: to ? new Date(to).toISOString() : undefined,
  });
  return res.data.items
    .filter((e) => e.transparency === "transparent")
    .map((e) => ({
      id: e.id,
      title: e.summary || "Sans titre",
      start: new Date(e.start.dateTime || e.start.date),
      end: new Date(e.end.dateTime || e.end.date),
      description: e.description || "",
      status: e.status,
      transparency: e.transparency,
    }));
}

export async function createEvent(eventBody) {
  const res = await calendar.events.insert({
    calendarId: CALENDAR_ID,
    requestBody: eventBody,
  });
  return res.data;
}

export async function deleteEvent(eventId) {
  await calendar.events.delete({ calendarId: CALENDAR_ID, eventId });
}

export async function patchEvent(eventId, requestBody) {
  const res = await calendar.events.patch({
    calendarId: CALENDAR_ID,
    eventId,
    requestBody,
  });
  return res.data;
}