import axios from "axios";

const SOIL_API = "https://rest.isric.org/soilgrids/v2.0/properties/query";

/**
 * Get soil information for a location.
 *
 * SoilGrids:
 * - sand
 * - silt
 * - clay
 *
 * Depth: 0-5 cm
 */
export const getSoilData = async (latitude, longitude) => {
  try {
    const response = await axios.get(SOIL_API, {
      params: {
        lon: longitude,
        lat: latitude,
        property: ["sand", "silt", "clay"],
        depth: "0-5cm",
        value: "mean",
      },
      timeout: 20000,
    });

    const layers = response.data?.properties?.layers || [];

    if (!Array.isArray(layers) || layers.length === 0) {
      throw new Error("Soil data unavailable");
    }

    let sand = 0;
    let silt = 0;
    let clay = 0;

    // --------------------------------------
    // Extract SoilGrids values
    // --------------------------------------

    layers.forEach((layer) => {
      const name = layer.name?.toLowerCase();

      const value = layer.depths?.[0]?.values?.mean;

      if (typeof value !== "number") {
        return;
      }

      if (name === "sand") {
        sand = value;
      }

      if (name === "silt") {
        silt = value;
      }

      if (name === "clay") {
        clay = value;
      }
    });

    // --------------------------------------
    // Calculate total soil composition
    // --------------------------------------

    const total = sand + silt + clay;

    if (total <= 0) {
      throw new Error("Invalid soil composition data");
    }

    const sandRatio = sand / total;
    const siltRatio = silt / total;
    const clayRatio = clay / total;

    // --------------------------------------
    // Determine dominant soil type
    // --------------------------------------

    let soilType = "sand";

    if (siltRatio >= sandRatio && siltRatio >= clayRatio) {
      soilType = "silt";
    } else if (clayRatio >= sandRatio && clayRatio >= siltRatio) {
      /*
       * The ML model does not have a clay category.
       * Therefore clay-dominant soil is mapped to silt
       * as the closest available model category.
       */
      soilType = "silt";
    }

    // --------------------------------------
    // Soil type features for ML model
    // --------------------------------------

    const soilTypeGravel = 0;

    const soilTypeSand = soilType === "sand" ? 1 : 0;

    const soilTypeSilt = soilType === "silt" ? 1 : 0;

    // --------------------------------------
    // Soil Saturation
    // --------------------------------------
    /*
     * SoilGrids composition data does NOT directly
     * provide real-time soil saturation.
     *
     * The ML model requires Soil_Saturation
     * in the 0-1 range.
     *
     * 0.54 is used as a safe fallback around the
     * training dataset's average value.
     *
     * This should NOT be considered a live sensor
     * measurement.
     */

    const soilSaturation = 0.54;

    // --------------------------------------
    // Response
    // --------------------------------------

    return {
      soilSaturation,

      soilType,

      soilTypeGravel,

      soilTypeSand,

      soilTypeSilt,

      soilComposition: {
        sand: Number(sand.toFixed(2)),
        silt: Number(silt.toFixed(2)),
        clay: Number(clay.toFixed(2)),
      },

      source: "ISRIC SoilGrids",
    };
  } catch (error) {
    console.error("Soil Service Error:", error.response?.data || error.message);

    /*
     * Safe fallback.
     * This prevents soil API failure from
     * stopping the complete risk prediction.
     */

    return {
      soilSaturation: 0.54,

      soilType: "unknown",

      soilTypeGravel: 0,

      soilTypeSand: 0,

      soilTypeSilt: 0,

      soilComposition: {
        sand: 0,
        silt: 0,
        clay: 0,
      },

      source: "ISRIC SoilGrids_UNAVAILABLE",

      error: "Soil data temporarily unavailable",
    };
  }
};
