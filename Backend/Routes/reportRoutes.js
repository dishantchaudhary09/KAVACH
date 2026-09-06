import express from "express";

import {
  createReport,
  getReports,
  getMyReports,
  getReportById,
  updateReportStatus,
  deleteReport,
} from "../controllers/reportController.js";

import { protect } from "../MiddleWare/authMiddleware.js";

import upload from "../MiddleWare/uploadMiddleware.js";

const router = express.Router();

// CREATE REPORT
router.post("/", protect, upload.single("image"), createReport);

// MY REPORTS
router.get("/my-reports", protect, getMyReports);

// ALL REPORTS
router.get("/", protect, getReports);

// SINGLE REPORT
router.get("/:id", protect, getReportById);

// UPDATE STATUS
router.patch("/:id/status", protect, updateReportStatus);

// DELETE
router.delete("/:id", protect, deleteReport);

export default router;
