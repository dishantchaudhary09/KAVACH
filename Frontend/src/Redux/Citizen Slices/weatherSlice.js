import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_BACKEND_API_URL ||
  "http://localhost:3000/api";

// Fetch weather data
export const fetchWeather = createAsyncThunk(
  "weather/fetchWeather",

  async ({ latitude = 25.5, longitude = 93.5 } = {}, { rejectWithValue }) => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      console.log("🌦️ Fetching weather for:", {
        latitude,
        longitude,
      });

      const url =
        `${API_URL}/weather` +
        `?latitude=${encodeURIComponent(latitude)}` +
        `&longitude=${encodeURIComponent(longitude)}`;

      console.log("🌦️ Weather URL:", url);

      const response = await fetch(url, {
        method: "GET",

        headers: {
          "Content-Type": "application/json",

          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
        },
      });

      const data = await response.json();

      console.log("🌦️ Backend weather response:", data);

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to fetch weather data");
      }

      // Backend response:
      // { success: true, weather: {...} }

      return data.weather || data;
    } catch (error) {
      console.error("❌ Weather fetch error:", error);

      return rejectWithValue(
        error.message || "Unable to connect to weather service",
      );
    }
  },
);

const initialState = {
  weather: null,
  loading: false,
  error: null,
  lastUpdated: null,
};

const weatherSlice = createSlice({
  name: "weather",

  initialState,

  reducers: {
    clearWeatherError: (state) => {
      state.error = null;
    },

    clearWeather: (state) => {
      state.weather = null;
      state.error = null;
      state.lastUpdated = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.loading = false;

        state.weather = action.payload;

        state.lastUpdated = new Date().toISOString();

        state.error = null;

        console.log("✅ Weather stored in Redux:", action.payload);
      })

      .addCase(fetchWeather.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload || "Failed to fetch weather data";

        console.error("❌ Weather Redux error:", action.payload);
      });
  },
});

export const { clearWeatherError, clearWeather } = weatherSlice.actions;

export default weatherSlice.reducer;
