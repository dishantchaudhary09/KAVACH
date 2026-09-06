import monitoringAreas from "../Data/monitoringAreas.js";

import RiskZone from "../models/riskZone.js";

import getWeather from "./weatherService.js";
import predictRisk from "./mlService.js";

import { getTerrainData } from "./terrainService.js";
import { getEarthquakeData } from "./earthquackServices.js";
import { getSoilData } from "./soilService.js";
import { getVegetationData } from "./vegetationService.js";
import { getWaterData } from "./waterServices.js";

const fallbackEnvironmentalData = {
  terrain: { slopeAngle: 25, source: "fallback" },
  earthquake: { earthquakeActivity: 0, source: "fallback" },
  soil: {
    soilSaturation: 0.54,
    soilTypeGravel: 0,
    soilTypeSand: 0,
    soilTypeSilt: 1,
    source: "fallback",
  },
  vegetation: { vegetationCover: 0.6, source: "fallback" },
  water: { proximityToWater: 0.5, source: "fallback" },
};

const getServiceData = async (label, service, fallback) => {
  try {
    const data = await service();

    if (!data || typeof data !== "object") {
      throw new Error("invalid response");
    }

    return data;
  } catch (error) {
    console.error(`${label} unavailable, using fallback:`, error.message);
    return { ...fallback, error: `${label} fallback used` };
  }
};

const getFallbackPrediction = () => ({
  riskLevel: "MEDIUM",
  riskScore: 50,
  reason: "Risk estimated using fallback environmental data.",
});

const isValidMonitoringArea = (area) => {
  return (
    area &&
    typeof area.name === "string" &&
    area.name.trim().length > 0 &&
    Number.isFinite(Number(area.latitude)) &&
    Number.isFinite(Number(area.longitude)) &&
    Number(area.latitude) >= -90 &&
    Number(area.latitude) <= 90 &&
    Number(area.longitude) >= -180 &&
    Number(area.longitude) <= 180
  );
};

export const runAutomaticRiskMonitoring = async () => {
  console.log("=================================");
  console.log("🚀 Automatic Risk Monitoring Started");
  console.log("=================================");

  for (const area of monitoringAreas) {
    if (!isValidMonitoringArea(area)) {
      console.error(
        "❌ Invalid monitoring area skipped. Required: name, latitude, longitude.",
        area,
      );
      continue;
    }

    try {
      console.log(`\n📍 Monitoring: ${area.name}, ${area.state}`);

      const latitude = Number(area.latitude);
      const longitude = Number(area.longitude);
      const name = area.name.trim();
      const state = typeof area.state === "string" ? area.state.trim() : "";

      // -----------------------------
      // 1. WEATHER
      // -----------------------------
      const weather = await getServiceData(
        "Weather service",
        () => getWeather(latitude, longitude, name),
        {
          temperature: 24,
          humidity: 68,
          rainfall: 12,
          windSpeed: 18,
          source: "fallback",
        },
      );

      console.log("🌦 Weather:", {
        rainfall: weather.rainfall,
        temperature: weather.temperature,
        humidity: weather.humidity,
        windSpeed: weather.windSpeed,
      });

      // -----------------------------
      // 2. ENVIRONMENTAL DATA
      // -----------------------------
      const [terrainData, earthquakeData, soilData, vegetationData, waterData] =
        await Promise.all([
          getServiceData(
            "Terrain service",
            () => getTerrainData(latitude, longitude),
            fallbackEnvironmentalData.terrain,
          ),
          getServiceData(
            "Earthquake service",
            () => getEarthquakeData(latitude, longitude),
            fallbackEnvironmentalData.earthquake,
          ),
          getServiceData(
            "Soil service",
            () => getSoilData(latitude, longitude),
            fallbackEnvironmentalData.soil,
          ),
          getServiceData(
            "Vegetation service",
            () => getVegetationData(latitude, longitude),
            fallbackEnvironmentalData.vegetation,
          ),
          getServiceData(
            "Water service",
            () => getWaterData(latitude, longitude),
            fallbackEnvironmentalData.water,
          ),
        ]);

      // -----------------------------
      // 3. ML PREDICTION
      // -----------------------------
      let prediction;

      try {
        prediction = await predictRisk({
          latitude,
          longitude,
          rainfall: Number(weather.rainfall ?? 12),
          temperature: Number(weather.temperature ?? 24),
          humidity: Number(weather.humidity ?? 68),
          windSpeed: Number(weather.windSpeed ?? 18),
          slopeAngle: Number(terrainData.slopeAngle ?? 25),
          soilSaturation: Number(soilData.soilSaturation ?? 0.54),
          vegetationCover: Number(vegetationData.vegetationCover ?? 0.6),
          earthquakeActivity: Number(earthquakeData.earthquakeActivity ?? 0),
          proximityToWater: Number(waterData.proximityToWater ?? 0.5),
          soilTypeGravel: Number(soilData.soilTypeGravel ?? 0),
          soilTypeSand: Number(soilData.soilTypeSand ?? 0),
          soilTypeSilt: Number(soilData.soilTypeSilt ?? 1),
        });
      } catch (error) {
        console.error(`${name} ML prediction failed:`, error.message);
        prediction = getFallbackPrediction();
      }

      const riskLevel = ["LOW", "MEDIUM", "HIGH"].includes(
        String(prediction?.riskLevel).toUpperCase(),
      )
        ? String(prediction.riskLevel).toUpperCase()
        : "MEDIUM";
      const riskScore = Math.min(
        100,
        Math.max(0, Number(prediction?.riskScore) || 50),
      );
      const reason =
        prediction?.reason ||
        "Risk estimated using fallback environmental data.";

      console.log(`🤖 ${name}: ${riskLevel} (${riskScore})`);

      // -----------------------------
      // 4. UPDATE / CREATE RISK ZONE
      // -----------------------------
      await RiskZone.findOneAndUpdate(
        {
          "location.latitude": latitude,
          "location.longitude": longitude,
        },
        {
          location: {
            latitude,
            longitude,
          },

          locationName: name,

          state,

          riskLevel,
          riskScore,
          reason,

          lastUpdated: new Date(),
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
        },
      );

      console.log(`✅ ${name} risk saved successfully`);
    } catch (error) {
      console.error(`❌ ${area.name} monitoring failed:`, error.message);
    }
  }

  console.log("\n=================================");
  console.log("🏁 Automatic Risk Monitoring Completed");
  console.log("=================================");
};

export default runAutomaticRiskMonitoring;
