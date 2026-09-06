import express from "express";

import {
  createAlert,
  getAlerts,
  getActiveAlerts,
  getAlertById,
  updateAlert,
  deleteAlert,
} from "../controllers/alertController.js";

import { protect } from "../MiddleWare/authMiddleware.js";
import { adminOnly } from "../MiddleWare/adminMiddleware.js";

const router = express.Router();

/*
=========================================================
  ALERTS - CITIZEN + ADMIN
=========================================================
*/

// All logged-in users can view alerts
router.get("/", protect, getAlerts);

// All logged-in users can view active alerts
router.get("/active", protect, getActiveAlerts);

// All logged-in users can view a single alert
router.get("/:id", protect, getAlertById);

/*
=========================================================
  ALERT MANAGEMENT - ADMIN ONLY
=========================================================
*/

// Admin + SuperAdmin can create alerts
router.post("/", protect, adminOnly, createAlert);

// Admin + SuperAdmin can update alerts
router.patch("/:id", protect, adminOnly, updateAlert);

// Admin + SuperAdmin can delete alerts
router.delete("/:id", protect, adminOnly, deleteAlert);

export default router;
