// src/services/verificationStore.js

const store = new Map();

export function saveCode(token, data, ttlMs = 10 * 60 * 1000) {
  const expiresAt = Date.now() + ttlMs;
  store.set(token, { ...data, expiresAt });
  setTimeout(() => store.delete(token), ttlMs);
}

export function getCode(token) {
  return store.get(token) || null;
}

export function deleteCode(token) {
  store.delete(token);
}