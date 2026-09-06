import axios from "axios";

const getWeather = async (latitude, longitude, locationName = "") => {
  try {
    const apiKey = process.env.WEATHER_API_KEY;

    const lat = Number(latitude);
    const lon = Number(longitude);

    const validLatitude = Number.isFinite(lat) ? lat : 25.5;
    const validLongitude = Number.isFinite(lon) ? lon : 93.5;

    // Fallback if API key is missing
    if (!apiKey) {
      console.warn(
        "⚠️ WEATHER_API_KEY not found. Using fallback weather data.",
      );

      return {
        temperature: 24,
        humidity: 68,
        rainfall: 12,
        windSpeed: 18,
        condition: "Cloudy",
        location: locationName || "NER Region",
        source: "fallback",
        latitude: validLatitude,
        longitude: validLongitude,
      };
    }

    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          lat: validLatitude,
          lon: validLongitude,
          appid: apiKey,
          units: "metric",
        },
        timeout: 10000,
      },
    );

    const data = response.data;

    const currentLocation = data.name || locationName || "NER Region";

    return {
      temperature: data.main?.temp ?? 0,

      humidity: data.main?.humidity ?? 0,

      rainfall: data.rain?.["1h"] ?? 0,

      windSpeed:
        data.wind?.speed !== undefined
          ? Number((data.wind.speed * 3.6).toFixed(1))
          : 0,

      condition: data.weather?.[0]?.main || "Unknown",

      description: data.weather?.[0]?.description || "",

      location: currentLocation,

      source: "openweather",

      latitude: validLatitude,

      longitude: validLongitude,
    };
  } catch (error) {
    console.error(
      "❌ Weather API Error:",
      error.response?.data || error.message,
    );

    // API failure → fallback
    return {
      temperature: 24,
      humidity: 68,
      rainfall: 12,
      windSpeed: 18,
      condition: "Cloudy",

      location: locationName || "NER Region",

      source: "fallback",

      latitude: Number.isFinite(Number(latitude)) ? Number(latitude) : 25.5,

      longitude: Number.isFinite(Number(longitude)) ? Number(longitude) : 93.5,
    };
  }
};

export default getWeather;
