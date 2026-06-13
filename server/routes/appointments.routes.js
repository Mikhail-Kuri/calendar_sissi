import { Router } from "express";
import {
  getAppointments,
  requestAppointment,
  confirmAppointment,
  updateAppointment,
} from "../controllers/appointments.controller.js";

const router = Router();

router.get("/", getAppointments);
router.post("/request", requestAppointment);
router.post("/confirm", confirmAppointment);
router.put("/:id", updateAppointment);

export default router;