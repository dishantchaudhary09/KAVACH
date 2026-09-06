import axios from "axios";

/**
 * Get vegetation information for a location.
 *
 * Returns:
 * - ndvi: Normalized Difference Vegetation Index
 * - vegetationCover: value between 0 and 1
 */
export const getVegetationData = async (latitude, longitude) => {
  try {
    // TODO:
    // Replace this section with the actual satellite/NDVI API
    // once the API is configured in the project.

    const ndvi = 0.5;

    // Convert NDVI (-1 to 1) into vegetation cover (0 to 1)
    const vegetationCover = Math.max(0, Math.min(1, (ndvi + 1) / 2));

    return {
      ndvi,
      vegetationCover,
      source: "NDVI",
    };
  } catch (error) {
    console.error("Vegetation service error:", error.message);

    throw new Error("Unable to fetch vegetation data");
  }
};
