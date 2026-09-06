
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import connectDB from "./config/db.js";
import { startRiskScheduler } from "./Services/riskScheduler.js";

import authRoutes from "./Routes/authRoutes.js";
import reportRoutes from "./Routes/reportRoutes.js";
import riskRoutes from "./Routes/riskRoutes.js";
import roadRoutes from "./Routes/roadRoutes.js";
import dashboardRoutes from "./Routes/dashboardRoutes.js";
import chatRoutes from "./Routes/chatRoutes.js";
import adminRoutes from "./Routes/adminRoutes.js";
import weatherRoutes from "./Routes/weatherRoutes.js";
import alertRoutes from "./Routes/alertRoutes.js";

import errorMiddleware from "./MiddleWare/errorMiddleware.js";

// =====================================
// LOAD ENVIRONMENT VARIABLES
// =====================================
dotenv.config();

// =====================================
// CREATE EXPRESS APP
// =====================================
const app = express();

// =====================================
// MIDDLEWARE
// =====================================

app.use(cors());

app.use(express.json());

app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

// =====================================
// TEST ROUTE
// =====================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Landslide Risk Monitoring API is running",
  });
});

// =====================================
// API ROUTES
// =====================================

app.use("/api/auth", authRoutes);

app.use("/api/reports", reportRoutes);

app.use("/api/risk", riskRoutes);

app.use("/api/roads", roadRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/weather", weatherRoutes);

app.use("/api/alerts", alertRoutes);

app.use("/api/chat", chatRoutes);

app.use("/api/admin", adminRoutes);

// =====================================
// ERROR MIDDLEWARE
// =====================================

app.use(errorMiddleware);

// =====================================
// SERVER
// =====================================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    startRiskScheduler();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);

    process.exit(1);
  }
};

startServer();

