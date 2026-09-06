import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_URL =
  (import.meta.env.VITE_API_URL || "http://localhost:3000/api") + "/risk";

// ==========================================
// GET ALL RISK ZONES
// ==========================================

export const fetchRiskZones = createAsyncThunk(
  "risk/fetchRiskZones",
  async (_, { rejectWithValue }) => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to fetch risk zones");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Server error");
    }
  },
);

// ==========================================
// PREDICT RISK
// ==========================================

export const predictRisk = createAsyncThunk(
  "risk/predictRisk",
  async (riskData, { rejectWithValue }) => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",

        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify(riskData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Risk prediction failed");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Server error");
    }
  },
);

// ==========================================
// GET SINGLE RISK ZONE
// ==========================================

export const fetchRiskZoneById = createAsyncThunk(
  "risk/fetchRiskZoneById",
  async (id, { rejectWithValue }) => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const response = await fetch(`${API_URL}/${id}`, {
        method: "GET",

        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to fetch risk zone");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Server error");
    }
  },
);

// ==========================================
// INITIAL STATE
// ==========================================

const initialState = {
  riskZones: [],
  selectedRiskZone: null,

  // Latest prediction
  prediction: null,

  // Environmental data used for prediction
  environmentalData: null,

  loading: false,
  predictionLoading: false,
  detailsLoading: false,

  error: null,
  predictionError: null,
  detailsError: null,

  successMessage: null,
};

// ==========================================
// SLICE
// ==========================================

const riskSlice = createSlice({
  name: "risk",

  initialState,

  reducers: {
    clearRiskError: (state) => {
      state.error = null;
      state.predictionError = null;
      state.detailsError = null;
    },

    clearPrediction: (state) => {
      state.prediction = null;
      state.environmentalData = null;
      state.predictionError = null;
      state.successMessage = null;
    },

    clearSelectedRiskZone: (state) => {
      state.selectedRiskZone = null;
    },
  },

  extraReducers: (builder) => {
    // ======================================
    // FETCH ALL RISK ZONES
    // ======================================

    builder
      .addCase(fetchRiskZones.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchRiskZones.fulfilled, (state, action) => {
        state.loading = false;

        state.riskZones = action.payload.riskZones || [];
      })

      .addCase(fetchRiskZones.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload || "Failed to fetch risk zones";
      });

    // ======================================
    // PREDICT RISK
    // ======================================

    builder
      .addCase(predictRisk.pending, (state) => {
        state.predictionLoading = true;
        state.predictionError = null;
        state.successMessage = null;
      })

      .addCase(predictRisk.fulfilled, (state, action) => {
        state.predictionLoading = false;

        const predictionData = action.payload.data;

        // Save prediction result
        state.prediction = predictionData?.prediction || null;

        // Save environmental data
        state.environmentalData = predictionData?.environmentalData || null;

        state.successMessage =
          action.payload.message || "Risk prediction created successfully";

        // Add newly created risk zone
        if (predictionData?.riskZone) {
          state.riskZones.unshift(predictionData.riskZone);
        }
      })

      .addCase(predictRisk.rejected, (state, action) => {
        state.predictionLoading = false;

        state.predictionError = action.payload || "Risk prediction failed";
      });

    // ======================================
    // FETCH SINGLE RISK ZONE
    // ======================================

    builder
      .addCase(fetchRiskZoneById.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
      })

      .addCase(fetchRiskZoneById.fulfilled, (state, action) => {
        state.detailsLoading = false;

        state.selectedRiskZone = action.payload.riskZone || null;
      })

      .addCase(fetchRiskZoneById.rejected, (state, action) => {
        state.detailsLoading = false;

        state.detailsError = action.payload || "Failed to fetch risk zone";
      });
  },
});

// ==========================================
// ACTIONS
// ==========================================

export const { clearRiskError, clearPrediction, clearSelectedRiskZone } =
  riskSlice.actions;

// ==========================================
// SELECTORS
// ==========================================

export const selectRiskZones = (state) => state.risk.riskZones;

export const selectSelectedRiskZone = (state) => state.risk.selectedRiskZone;

export const selectRiskPrediction = (state) => state.risk.prediction;

export const selectEnvironmentalData = (state) => state.risk.environmentalData;

export default riskSlice.reducer;
