import Report from "../models/report.js";
import RiskZone from "../models/riskZone.js";
import RoadStatus from "../models/roadStatus.js";

import getWeather from "../Services/weatherService.js";


// GET DASHBOARD STATISTICS


export const getDashboardStats = async (req, res) => {
  try {
    const totalReports = await Report.countDocuments();

    const pendingReports = await Report.countDocuments({
      status: "pending",
    });

    const verifiedReports = await Report.countDocuments({
      status: "verified",
    });

    const resolvedReports = await Report.countDocuments({
      status: "resolved",
    });

    const highRiskZones = await RiskZone.countDocuments({
      riskLevel: "HIGH",
    });

    const blockedRoads = await RoadStatus.countDocuments({
      status: "blocked",
    });

    res.status(200).json({
      success: true,
      data: {
        totalReports,
        pendingReports,
        verifiedReports,
        resolvedReports,
        highRiskZones,
        blockedRoads,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// GET WEATHER DATA


export const getWeatherData = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required",
      });
    }

    const weather = await getWeather(latitude, longitude);

    res.status(200).json({
      success: true,
      data: weather,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
