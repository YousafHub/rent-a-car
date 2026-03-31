import express from "express";
import { getDashboardStats } from "../controllers/dashboard.controller.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", verifyToken, getDashboardStats);

export default router;