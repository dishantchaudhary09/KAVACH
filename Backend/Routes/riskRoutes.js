import express from "express";

import {
  predictAndCreateRisk,
  getRiskZones,
  getRiskZoneById,
} from "../controllers/riskController.js";

import{ protect } from "../MiddleWare/authMiddleware.js";

const router = express.Router();


// PREDICT RISK


router.post("/predict", protect, predictAndCreateRisk);


// GET ALL RISK ZONES


router.get("/", protect, getRiskZones);


// GET SINGLE RISK ZONE


router.get("/:id", protect, getRiskZoneById);

export default router;
