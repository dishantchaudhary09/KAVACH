import axios from "axios";

// ======================================
// OVERPASS API SERVERS
// ======================================

const OVERPASS_SERVERS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
];

// ======================================
// GET WATER DATA
// ======================================

export const getWaterData = async (latitude, longitude) => {
  const radius = 5000; // 5 km

  const query = `
    [out:json][timeout:20];
    (
      way["natural"="water"](around:${radius},${latitude},${longitude});
      relation["natural"="water"](around:${radius},${latitude},${longitude});
      way["waterway"](around:${radius},${latitude},${longitude});
    );
    out center;
  `;

  let lastError = null;

  // Try each Overpass server
  for (const server of OVERPASS_SERVERS) {
    try {
      console.log(`Fetching water data from: ${server}`);

      const response = await axios.post(server, query, {
        headers: {
          "Content-Type": "text/plain",
        },
        timeout: 25000,
      });

      const elements = response.data?.elements || [];

      // ======================================
      // NO WATER SOURCE FOUND
      // ======================================

      if (elements.length === 0) {
        return {
          distanceToWater: null,
          proximityToWater: 0,
          nearbyWaterSources: 0,
          source: "OpenStreetMap",
        };
      }

      // ======================================
      // FIND NEAREST WATER SOURCE
      // ======================================

      let nearestDistance = Infinity;

      for (const element of elements) {
        const waterLatitude = element.lat ?? element.center?.lat;

        const waterLongitude = element.lon ?? element.center?.lon;

        if (waterLatitude === undefined || waterLongitude === undefined) {
          continue;
        }

        const distance = calculateDistance(
          latitude,
          longitude,
          waterLatitude,
          waterLongitude,
        );

        if (distance < nearestDistance) {
          nearestDistance = distance;
        }
      }

      // ======================================
      // COORDINATES NOT AVAILABLE
      // ======================================

      if (!Number.isFinite(nearestDistance)) {
        return {
          distanceToWater: null,
          proximityToWater: 0,
          nearbyWaterSources: elements.length,
          source: "OpenStreetMap",
        };
      }

      // ======================================
      // PROXIMITY SCORE
      // ======================================
      /*
       * Training data expects:
       *
       * Proximity_to_Water ≈ 0 to 2
       *
       * 0 meter  -> 2
       * 5 km+    -> 0
       */

      const proximityToWater = Math.max(
        0,
        Math.min(2, 2 * (1 - nearestDistance / 5000)),
      );

      // ======================================
      // SUCCESS RESPONSE
      // ======================================

      return {
        distanceToWater: Number(nearestDistance.toFixed(2)),

        proximityToWater: Number(proximityToWater.toFixed(4)),

        nearbyWaterSources: elements.length,

        source: "OpenStreetMap",
      };
    } catch (error) {
      lastError = error;

      console.error(`Water API failed: ${server}`, error.message);
    }
  }

  // ======================================
  // ALL SERVERS FAILED
  // ======================================

  console.error("All water APIs failed:", lastError?.message);

  /*
   * Do not stop complete risk prediction
   * when water API is unavailable.
   */

  return {
    distanceToWater: null,
    proximityToWater: 0,
    nearbyWaterSources: 0,
    source: "OpenStreetMap_UNAVAILABLE",
  };
};

// ======================================
// HAVERSINE DISTANCE
// ======================================

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const earthRadius = 6371000;

  const toRadians = (degree) => {
    return (degree * Math.PI) / 180;
  };

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
};
