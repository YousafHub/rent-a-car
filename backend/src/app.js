import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/user.route.js";
import vehicleRoutes from "./routes/vehicle.route.js";
import customerRoutes from "./routes/customer.route.js";
import bookingRoutes from "./routes/booking.route.js";
import dashboardRoutes from "./routes/dashboard.route.js";

dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN, 
    credentials: true,
    exposedHeaders: ['Set-Cookie'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/auth", authRoutes);
app.use("/vehicles", vehicleRoutes);
app.use("/customers", customerRoutes);
app.use("/bookings", bookingRoutes);
app.use("/dashboard", dashboardRoutes);

// Test route
app.get("/test", (req, res) => {
    res.json({ message: "Server is working!" });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => console.log("MongoDB connection error:", err));