import express from "express";

import {
  addAdministrator,
  getAdministrators,
  deleteAdministrator,
} from "../controllers/adminController.js";

import { protect } from "../MiddleWare/authMiddleware.js";
import { superAdminOnly } from "../MiddleWare/superAdminMiddleware.js";

const router = express.Router();

// Get administrators
router.get("/administrators", protect, superAdminOnly, getAdministrators);

// Add administrator
router.post("/administrators", protect, superAdminOnly, addAdministrator);

// Delete administrator
router.delete(
  "/administrators/:id",
  protect,
  superAdminOnly,
  deleteAdministrator,
);

export default router;
