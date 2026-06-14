import rateLimit from "express-rate-limit";

export const appointmentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10, 
  message: {
    error: "Trop de requêtes. Réessayez plus tard.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});