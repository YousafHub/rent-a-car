import express from "express";
import { createVehicle, getVehicles, updateVehicle, deleteVehicle, getVehicleById, searchVehicles } from "../controllers/vehicle.controller.js";
import { verifyToken } from "../middlewares/auth.js";
const router = express.Router();

router.post("/", verifyToken, createVehicle);
router.get("/", verifyToken, getVehicles);
router.get("/search", verifyToken, searchVehicles);  
router.get("/:id", verifyToken, getVehicleById);
router.put("/:id", verifyToken, updateVehicle);
router.delete("/:id", verifyToken, deleteVehicle);

export default router;