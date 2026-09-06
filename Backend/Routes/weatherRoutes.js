import express from "express";

import getWeather from "../Services/weatherService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { latitude, longitude, location } = req.query;

    const lat = Number(latitude ?? 25.5);
    const lon = Number(longitude ?? 93.5);

    const weather = await getWeather(lat, lon, location || "Current region");

    res.status(200).json({
      success: true,
      weather,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Unable to fetch weather data",
    });
  }
});

export default router;
