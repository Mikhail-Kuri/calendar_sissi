import express from "express";
import cors from "cors";
import appointmentRoutes from "./routes/appointments.routes.js";
import { appointmentLimiter } from "./middleware/rateLimiter.js";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://glorious-doodle-66jjjvvg7v7h5v9g-3000.app.github.dev",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.options("*", cors());

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.use(express.json());
app.use("/appointments", appointmentLimiter, appointmentRoutes);

export default app;
