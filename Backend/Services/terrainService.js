import axios from "axios";

const ELEVATION_API = "https://api.open-meteo.com/v1/elevation";

/**
 * Calculate slope angle between two elevation points.
 */
const calculateSlope = (elevation1, elevation2, distanceMeters) => {
  if (!Number.isFinite(distanceMeters) || distanceMeters <= 0) {
    return 0;
  }

  const elevationDifference = Math.abs(elevation2 - elevation1);

  const slopeRadians = Math.atan(elevationDifference / distanceMeters);

  const slopeDegrees = slopeRadians * (180 / Math.PI);

  return Number(slopeDegrees.toFixed(2));
};

/**
 * Get terrain information for a location.
 */
export const getTerrainData = async (latitude, longitude) => {
  try {
    const offset = 0.001;

    const points = [
      {
        name: "center",
        latitude,
        longitude,
      },
      {
        name: "north",
        latitude: latitude + offset,
        longitude,
      },
      {
        name: "east",
        latitude,
        longitude: longitude + offset,
      },
    ];

    // Open-Meteo Elevation API supports multiple coordinates
    // in a single request.
    const response = await axios.get(ELEVATION_API, {
      params: {
        latitude: points.map((point) => point.latitude).join(","),
        longitude: points.map((point) => point.longitude).join(","),
      },
      timeout: 15000,
    });

    const elevations = response.data?.elevation;

    if (!Array.isArray(elevations) || elevations.length < 3) {
      throw new Error("Elevation data unavailable");
    }

    const centerElevation = Number(elevations[0]);
    const northElevation = Number(elevations[1]);
    const eastElevation = Number(elevations[2]);

    if (
      !Number.isFinite(centerElevation) ||
      !Number.isFinite(northElevation) ||
      !Number.isFinite(eastElevation)
    ) {
      throw new Error("Invalid elevation data received");
    }

    /*
      Approximately 111 km per degree latitude.
    */
    const latDistance = 111000 * offset;

    /*
      Longitude distance depends on latitude.
    */
    const lonDistance = 111000 * Math.cos((latitude * Math.PI) / 180) * offset;

    const northSlope = calculateSlope(
      centerElevation,
      northElevation,
      latDistance,
    );

    const eastSlope = calculateSlope(
      centerElevation,
      eastElevation,
      lonDistance,
    );

    /*
      Use the steeper direction as representative slope.
    */
    const slopeAngle = Math.min(Math.max(northSlope, eastSlope), 60);

    return {
      elevation: Number(centerElevation.toFixed(2)),
      slopeAngle: Number(slopeAngle.toFixed(2)),
      source: "Open-Meteo Elevation",
    };
  } catch (error) {
    console.error(
      "Terrain Service Error:",
      error.response?.data || error.message,
    );

    /*
      Fallback so terrain API failure
      does not stop the complete risk prediction.
    */
    return {
      elevation: null,
      slopeAngle: 0,
      source: "Open-Meteo Elevation_UNAVAILABLE",
      error: "Terrain data temporarily unavailable",
    };
  }
};
