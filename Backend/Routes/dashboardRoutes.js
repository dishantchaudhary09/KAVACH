import express from "express";

import { protect } from "../MiddleWare/authMiddleware.js";
import roleMiddleware from "../MiddleWare/roleMiddleware.js";
import {
  getDashboardStats,
  getWeatherData,
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/", protect, getDashboardStats);
router.get("/weather", protect, getWeatherData);

// Citizen Dashboard
router.get("/citizen", protect, roleMiddleware("citizen"), async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Citizen dashboard data",
    user: req.user,
  });
});

// Admin Dashboard
router.get(
  "/admin",
  protect,
  roleMiddleware("admin", "administrator", "superadmin"),
  async (req, res) => {
    res.status(200).json({
      success: true,
      message: "Admin dashboard data",
      user: req.user,
    });
  },
);

export default router;
