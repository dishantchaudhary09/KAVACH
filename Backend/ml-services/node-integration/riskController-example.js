// Example: add this logic inside your existing riskController.js.
// Keep your existing authentication/validation logic.

import predictRisk from "../services/mlService.js";

export const predictRiskController = async (req, res) => {
  try {
    const result = await predictRisk(req.body);

    return res.status(200).json(result);
  } catch (error) {
    console.error("ML prediction error:", error.response?.data || error.message);

    return res.status(502).json({
      success: false,
      message: "ML prediction service unavailable",
    });
  }
};
