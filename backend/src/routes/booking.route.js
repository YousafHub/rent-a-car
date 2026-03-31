import express from "express";
import { createBooking, deleteBooking, getBookingById, getBookings, updateBooking } from "../controllers/booking.controller.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", verifyToken, createBooking);
router.get("/", verifyToken, getBookings);
router.get("/:id", verifyToken, getBookingById);
router.delete("/:id", verifyToken, deleteBooking);
router.put("/:id", verifyToken, updateBooking);

export default router;