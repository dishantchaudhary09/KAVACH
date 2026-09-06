
import express from "express";

import {
  registerUser,
  loginUser,
  getProfile,
} from "../controllers/authController.js";

import { protect } from "../MiddleWare/authMiddleware.js";

const router = express.Router();

// ================= AUTH ROUTES =================

// Register citizen
router.post("/register", registerUser);

// Login user/admin
router.post("/login", loginUser);

// Get current logged-in user
router.get("/profile", protect, getProfile);

export default router;

