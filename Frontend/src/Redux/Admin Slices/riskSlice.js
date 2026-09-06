import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ==========================================
// API URL
// ==========================================

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// ==========================================
// GET AUTH TOKEN
// ==========================================

const getAuthToken = () => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

// ==========================================
// GET ALL RISK ZONES
// ==========================================

export const fetchAdminRiskZones = createAsyncThunk(
  "adminRisk/fetchAdminRiskZones",

  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();

      if (!token) {
        return rejectWithValue(
          "Authentication token not found. Please login again.",
        );
      }

      const response = await axios.get(`${API_URL}/risk`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("✅ Admin Risk Zones:", response.data);

      return (
        response.data?.riskZones ||
        response.data?.data?.riskZones ||
        response.data?.zones ||
        []
      );
    } catch (error) {
      console.error(
        "❌ Fetch Admin Risk Zones Error:",
        error.response?.data || error.message,
      );

      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch risk zones",
      );
    }
  },
);

// ==========================================
// GET SINGLE RISK ZONE
// ==========================================

export const fetchAdminRiskZoneById = createAsyncThunk(
  "adminRisk/fetchAdminRiskZoneById",

  async (riskZoneId, { rejectWithValue }) => {
    try {
      const token = getAuthToken();

      if (!token) {
        return rejectWithValue(
          "Authentication token not found. Please login again.",
        );
      }

      if (!riskZoneId) {
        return rejectWithValue("Risk zone ID is required.");
      }

      const response = await axios.get(`${API_URL}/risk/${riskZoneId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response.data.riskZone;
    } catch (error) {
      console.error(
        "❌ Fetch Risk Zone Details Error:",
        error.response?.data || error.message,
      );

      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch risk zone",
      );
    }
  },
);

// ==========================================
// CREATE ML RISK PREDICTION
// ==========================================

export const createAdminRiskPrediction = createAsyncThunk(
  "adminRisk/createAdminRiskPrediction",

  async (riskData, { rejectWithValue }) => {
    try {
      const token = getAuthToken();

      if (!token) {
        return rejectWithValue(
          "Authentication token not found. Please login again.",
        );
      }

      if (!riskData) {
        return rejectWithValue("Risk prediction data is required.");
      }

      const response = await axios.post(`${API_URL}/risk/predict`, riskData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("✅ Admin Risk Prediction:", response.data);

      return response.data;
    } catch (error) {
      console.error(
        "❌ Risk Prediction Error:",
        error.response?.data || error.message,
      );

      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Risk prediction failed",
      );
    }
  },
);

// ==========================================
// INITIAL STATE
// ==========================================

const initialState = {
  // Risk Zones
  riskZones: [],
  selectedRiskZone: null,

  // ML Prediction
  prediction: null,
  environmentalData: null,

  // Loading
  loading: false,
  detailsLoading: false,
  predictionLoading: false,

  // Errors
  error: null,
  detailsError: null,
  predictionError: null,

  // Success
  successMessage: null,
};

// ==========================================
// SLICE
// ==========================================

const adminRiskSlice = createSlice({
  name: "adminRisk",

  initialState,

  reducers: {
    // ========================================
    // CLEAR GENERAL ERROR
    // ========================================

    clearAdminRiskError: (state) => {
      state.error = null;
      state.detailsError = null;
      state.predictionError = null;
    },

    // ========================================
    // CLEAR SELECTED RISK ZONE
    // ========================================

    clearSelectedAdminRiskZone: (state) => {
      state.selectedRiskZone = null;
      state.detailsError = null;
    },

    // ========================================
    // CLEAR ML PREDICTION
    // ========================================

    clearAdminRiskPrediction: (state) => {
      state.prediction = null;
      state.environmentalData = null;
      state.predictionError = null;
      state.successMessage = null;
    },

    // ========================================
    // CLEAR SUCCESS MESSAGE
    // ========================================

    clearAdminRiskSuccess: (state) => {
      state.successMessage = null;
    },
  },

  extraReducers: (builder) => {
    // ==========================================
    // FETCH ALL RISK ZONES
    // ==========================================

    builder

      .addCase(fetchAdminRiskZones.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchAdminRiskZones.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.riskZones = Array.isArray(action.payload) ? action.payload : [];
      })

      .addCase(fetchAdminRiskZones.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload || "Failed to fetch risk zones";
      });

    // ==========================================
    // FETCH SINGLE RISK ZONE
    // ==========================================

    builder

      .addCase(fetchAdminRiskZoneById.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
      })

      .addCase(fetchAdminRiskZoneById.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.detailsError = null;

        state.selectedRiskZone = action.payload || null;
      })

      .addCase(fetchAdminRiskZoneById.rejected, (state, action) => {
        state.detailsLoading = false;

        state.detailsError = action.payload || "Failed to fetch risk zone";
      });

    // ==========================================
    // CREATE ML RISK PREDICTION
    // ==========================================

    builder

      .addCase(createAdminRiskPrediction.pending, (state) => {
        state.predictionLoading = true;

        state.predictionError = null;
        state.successMessage = null;
      })

      .addCase(createAdminRiskPrediction.fulfilled, (state, action) => {
        state.predictionLoading = false;
        state.predictionError = null;

        const predictionData = action.payload?.data;

        // ML prediction
        state.prediction = predictionData?.prediction || null;

        // Environmental data
        state.environmentalData = predictionData?.environmentalData || null;

        // Success message
        state.successMessage =
          action.payload?.message || "Risk prediction created successfully";

        // ======================================
        // ADD NEW RISK ZONE TO MAP
        // ======================================

        if (predictionData?.riskZone) {
          const newRiskZone = predictionData.riskZone;

          const existingIndex = state.riskZones.findIndex(
            (zone) => zone._id === newRiskZone._id,
          );

          if (existingIndex !== -1) {
            state.riskZones[existingIndex] = newRiskZone;
          } else {
            state.riskZones.unshift(newRiskZone);
          }
        }
      })

      .addCase(createAdminRiskPrediction.rejected, (state, action) => {
        state.predictionLoading = false;

        state.predictionError = action.payload || "Risk prediction failed";

        state.successMessage = null;
      });
  },
});

// ==========================================
// ACTIONS
// ==========================================

export const {
  clearAdminRiskError,
  clearSelectedAdminRiskZone,
  clearAdminRiskPrediction,
  clearAdminRiskSuccess,
} = adminRiskSlice.actions;

// ==========================================
// SELECTORS
// ==========================================

export const selectAdminRiskZones = (state) => state.adminRisk?.riskZones || [];

export const selectSelectedAdminRiskZone = (state) =>
  state.adminRisk?.selectedRiskZone || null;

export const selectAdminRiskPrediction = (state) =>
  state.adminRisk?.prediction || null;

export const selectAdminEnvironmentalData = (state) =>
  state.adminRisk?.environmentalData || null;

export const selectAdminRiskLoading = (state) =>
  state.adminRisk?.loading || false;

export const selectAdminRiskDetailsLoading = (state) =>
  state.adminRisk?.detailsLoading || false;

export const selectAdminRiskPredictionLoading = (state) =>
  state.adminRisk?.predictionLoading || false;

export const selectAdminRiskError = (state) => state.adminRisk?.error || null;

export const selectAdminRiskDetailsError = (state) =>
  state.adminRisk?.detailsError || null;

export const selectAdminRiskPredictionError = (state) =>
  state.adminRisk?.predictionError || null;

export const selectAdminRiskSuccessMessage = (state) =>
  state.adminRisk?.successMessage || null;

// ==========================================
// REDUCER
// ==========================================

export default adminRiskSlice.reducer;
