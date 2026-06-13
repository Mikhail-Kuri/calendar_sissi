const locks = new Map();

export function acquireLock(eventId) {
  if (locks.get(eventId)) return false;
  locks.set(eventId, true);
  return true;
}

export function releaseLock(eventId) {
  locks.delete(eventId);
}