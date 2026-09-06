import axios from "axios";

const USGS_URL = "https://earthquake.usgs.gov/fdsnws/event/1/query";

export const getEarthquakeData = async (latitude, longitude) => {
  try {
    const response = await axios.get(USGS_URL, {
      params: {
        format: "geojson",
        latitude,
        longitude,
        maxradiuskm: 100,
        starttime: getStartDate(),
        endtime: new Date().toISOString(),
        orderby: "magnitude",
        limit: 20,
      },
      timeout: 30000,
    });

    const earthquakes = response.data?.features || [];

    if (earthquakes.length === 0) {
      return {
        earthquakeActivity: 0,
        nearbyEarthquakes: 0,
        strongestMagnitude: 0,
        source: "USGS",
      };
    }

    const magnitudes = earthquakes
      .map((earthquake) => earthquake.properties?.mag)
      .filter((magnitude) => typeof magnitude === "number");

    const strongestMagnitude =
      magnitudes.length > 0 ? Math.max(...magnitudes) : 0;

    const earthquakeActivity = Math.max(0, Math.min(6.5, strongestMagnitude));

    return {
      earthquakeActivity: Number(earthquakeActivity.toFixed(2)),
      nearbyEarthquakes: earthquakes.length,
      strongestMagnitude: Number(strongestMagnitude.toFixed(2)),
      source: "USGS",
    };
  } catch (error) {
    console.error("Earthquake Service Error:", error.message);

    // Do not stop complete risk prediction
    return {
      earthquakeActivity: 0,
      nearbyEarthquakes: 0,
      strongestMagnitude: 0,
      source: "USGS_UNAVAILABLE",
    };
  }
};

const getStartDate = () => {
  const date = new Date();

  date.setDate(date.getDate() - 30);

  return date.toISOString();
};
