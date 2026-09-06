import axios from "axios";

const ML_SERVICE_URL = process.env.ML_SERVICE_URL;

const predictRisk = async ({
  latitude,
  longitude,
  rainfall,
  temperature,
  humidity,
  windSpeed,

  // Terrain
  slopeAngle,

  // Soil
  soilSaturation,
  soilTypeGravel,
  soilTypeSand,
  soilTypeSilt,

  // Vegetation
  vegetationCover,

  // Earthquake
  earthquakeActivity,

  // Water
  proximityToWater,
}) => {
  try {
    const response = await axios.post(
      `${ML_SERVICE_URL}/predict/landslide`,
      {
        latitude,
        longitude,

        rainfall,
        temperature,
        humidity,
        windSpeed,

        slope_angle: slopeAngle,
        soil_saturation: soilSaturation,
        vegetation_cover: vegetationCover,
        earthquake_activity: earthquakeActivity,
        proximity_to_water: proximityToWater,

        soil_type_gravel: soilTypeGravel,
        soil_type_sand: soilTypeSand,
        soil_type_silt: soilTypeSilt,
      },
      {
        timeout: 10000,
      },
    );

    return response.data;
  } catch (error) {
    console.error("ML Service Error:", error.response?.data || error.message);

    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "ML prediction service unavailable",
    );
  }
};

export default predictRisk;
