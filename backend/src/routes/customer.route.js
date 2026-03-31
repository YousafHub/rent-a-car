import express from "express";
import { createCustomer, getCustomers, updateCustomer, deleteCustomer, getCustomerById, searchCustomers } from "../controllers/customer.controller.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", verifyToken, createCustomer);
router.get("/", verifyToken, getCustomers);
router.get("/search", verifyToken, searchCustomers);  // Add search route
router.get("/:id", verifyToken, getCustomerById);
router.put("/:id", verifyToken, updateCustomer);
router.delete("/:id", verifyToken, deleteCustomer);

export default router;