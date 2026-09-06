import RiskZone from "../models/riskZone.js";
import monitoringAreas from "../Data/monitoringAreas.js";
import predictRisk from "../Services/mlService.js";
import sendAlert from "../Services/alertService.js";

import { getTerrainData } from "../Services/terrainService.js";
import { getEarthquakeData } from "../Services/earthquackServices.js";
import { getSoilData } from "../Services/soilService.js";
import { getVegetationData } from "../Services/vegetationService.js";
import { getWaterData } from "../Services/waterServices.js";

const withFallback = async (label, service, fallback) => {
  try {
    const data = await service();

    if (!data || typeof data !== "object") {
      throw new Error("invalid response");
    }

    return data;
  } catch (error) {
    console.error(`${label} unavailable, using fallback:`, error.message);
    return fallback;
  }
};

const fallbackEnvironmentalData = {
  terrain: { slopeAngle: 25 },
  earthquake: { earthquakeActivity: 0 },
  soil: {
    soilSaturation: 0.54,
    soilTypeGravel: 0,
    soilTypeSand: 0,
    soilTypeSilt: 1,
  },
  vegetation: { vegetationCover: 0.6 },
  water: { proximityToWater: 0.5 },
};

// ======================================
// CREATE / PREDICT RISK
// ======================================

export const predictAndCreateRisk = async (req, res) => {
  try {
    const {
      latitude,
      longitude,
      rainfall,
      temperature,
      humidity,
      windSpeed,
      locationName,
      state,
    } = req.body;

    // Validate basic location/weather data
    if (
      latitude === undefined ||
      longitude === undefined ||
      rainfall === undefined ||
      temperature === undefined ||
      humidity === undefined ||
      windSpeed === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All risk prediction data is required",
      });
    }

    // ======================================
    // GET ADDITIONAL RISK DATA
    // ======================================

    const [terrainData, earthquakeData, soilData, vegetationData, waterData] =
      await Promise.all([
        withFallback(
          "Terrain service",
          () => getTerrainData(latitude, longitude),
          fallbackEnvironmentalData.terrain,
        ),
        withFallback(
          "Earthquake service",
          () => getEarthquakeData(latitude, longitude),
          fallbackEnvironmentalData.earthquake,
        ),
        withFallback(
          "Soil service",
          () => getSoilData(latitude, longitude),
          fallbackEnvironmentalData.soil,
        ),
        withFallback(
          "Vegetation service",
          () => getVegetationData(latitude, longitude),
          fallbackEnvironmentalData.vegetation,
        ),
        withFallback(
          "Water service",
          () => getWaterData(latitude, longitude),
          fallbackEnvironmentalData.water,
        ),
      ]);

    // ======================================
    // SEND COMPLETE DATA TO ML SERVICE
    // ======================================

    let prediction;

    try {
      prediction = await predictRisk({
        latitude,
        longitude,
        rainfall,
        temperature,
        humidity,
        windSpeed,
        slopeAngle: terrainData.slopeAngle ?? 25,
        soilSaturation: soilData.soilSaturation ?? 0.54,
        soilTypeGravel: soilData.soilTypeGravel ?? 0,
        soilTypeSand: soilData.soilTypeSand ?? 0,
        soilTypeSilt: soilData.soilTypeSilt ?? 1,
        vegetationCover: vegetationData.vegetationCover ?? 0.6,
        earthquakeActivity: earthquakeData.earthquakeActivity ?? 0,
        proximityToWater: waterData.proximityToWater ?? 0.5,
      });
    } catch (error) {
      console.error(
        "ML prediction unavailable, using fallback:",
        error.message,
      );
      prediction = {
        riskLevel: "MEDIUM",
        riskScore: 50,
        reason: "Risk estimated using fallback environmental data.",
      };
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
      prediction?.reason || "Risk estimated using fallback environmental data.";

    // ======================================
    // SAVE RISK ZONE IN MONGODB
    // ======================================

    const riskZone = await RiskZone.create({
      location: {
        latitude,
        longitude,
      },

      locationName: locationName?.trim() || "Manual Location",

      state: state?.trim() || "",

      riskLevel,

      riskScore,

      reason,
    });

    // ======================================
    // SEND ALERT IF RISK IS HIGH
    // ======================================

    if (riskLevel === "HIGH") {
      await sendAlert({
        riskLevel,
        riskScore,

        location: {
          latitude,
          longitude,
        },

        reason,
      });
    }

    // ======================================
    // RESPONSE
    // ======================================

    res.status(201).json({
      success: true,
      message: "Risk prediction created successfully",

      data: {
        riskZone,
        prediction,

        environmentalData: {
          terrain: terrainData,
          earthquake: earthquakeData,
          soil: soilData,
          vegetation: vegetationData,
          water: waterData,
        },
      },
    });
  } catch (error) {
    console.error("Risk Controller Error:", error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// GET ALL RISK ZONES
// ======================================

export const getRiskZones = async (req, res) => {
  try {
    const storedRiskZones = await RiskZone.find().sort({ createdAt: -1 });

    const riskZones = await Promise.all(
      storedRiskZones.map(async (riskZone) => {
        const area = monitoringAreas.find(
          (monitoringArea) =>
            monitoringArea.latitude === riskZone.location?.latitude &&
            monitoringArea.longitude === riskZone.location?.longitude,
        );

        if (area && (!riskZone.locationName || !riskZone.state)) {
          return RiskZone.findByIdAndUpdate(
            riskZone._id,
            {
              locationName: riskZone.locationName || area.name,
              state: riskZone.state || area.state,
            },
            { new: true, runValidators: true },
          );
        }

        return riskZone;
      }),
    );

    res.status(200).json({
      success: true,
      count: riskZones.length,
      riskZones,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// GET SINGLE RISK ZONE
// ======================================

export const getRiskZoneById = async (req, res) => {
  try {
    const riskZone = await RiskZone.findById(req.params.id);

    if (!riskZone) {
      return res.status(404).json({
        success: false,
        message: "Risk zone not found",
      });
    }

    res.status(200).json({
      success: true,
      riskZone,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
