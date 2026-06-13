import { google } from "googleapis";

/**
 * 1. Load + normalize env vars
 */
const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

const requiredEnvVars = {
  GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL,
  GOOGLE_CALENDAR_ID: process.env.GOOGLE_CALENDAR_ID,
  GOOGLE_PRIVATE_KEY: privateKey,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
};

/**
 * 2. Validate env vars
 */
for (const [key, value] of Object.entries(requiredEnvVars)) {
  if (!value) {
    console.error(`❌ Variable manquante : ${key}`);
    process.exit(1);
  }
}

/**
 * 3. Create JWT auth
 */
const auth = new google.auth.JWT(
  requiredEnvVars.GOOGLE_CLIENT_EMAIL,
  null,
  requiredEnvVars.GOOGLE_PRIVATE_KEY,
  ["https://www.googleapis.com/auth/calendar"],
);

/**
 * 4. Export Google Calendar client
 */
export const calendar = google.calendar({
  version: "v3",
  auth,
});

export const CALENDAR_ID = requiredEnvVars.GOOGLE_CALENDAR_ID;
