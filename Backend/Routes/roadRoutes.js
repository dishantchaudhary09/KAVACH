import express from "express";

import {
  createRoadStatus,
  getRoadStatuses,
  getRoadStatusById,
  updateRoadStatus,
  deleteRoadStatus,
} from "../controllers/roadController.js";

import {protect} from "../MiddleWare/authMiddleware.js";

const router = express.Router();


// CREATE ROAD STATUS


router.post("/", protect, createRoadStatus);


// GET ALL ROAD STATUSES


router.get("/", protect, getRoadStatuses);


// GET SINGLE ROAD STATUS


router.get("/:id", protect, getRoadStatusById);

// UPDATE ROAD STATUS


router.patch("/:id", protect, updateRoadStatus);

// DELETE ROAD STATUS


router.delete("/:id", protect, deleteRoadStatus);

export default router;
