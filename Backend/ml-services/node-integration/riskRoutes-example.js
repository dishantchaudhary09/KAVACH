import express from "express";
import authMiddleware from "../MiddleWare/authMiddleware.js";
import { predictRiskController } from "../controllers/riskController.js";

const router = express.Router();

router.post("/predict", authMiddleware, predictRiskController);

export default router;
