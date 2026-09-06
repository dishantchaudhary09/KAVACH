import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../Api/api";

// ==========================================
// GET ADMIN DASHBOARD DATA
// ==========================================

export const fetchAdminDashboard = createAsyncThunk(
  "adminDashboard/fetchAdminDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/dashboard");

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch admin dashboard data",
      );
    }
  },
);

// ==========================================
// INITIAL STATE
// ==========================================

const initialState = {
  stats: {
    totalUsers: 0,
    totalReports: 0,
    pendingReports: 0,
    resolvedReports: 0,
    highRiskZones: 0,
    activeAlerts: 0,
  },

  riskOverview: {
    high: 0,
    medium: 0,
    low: 0,
  },

  recentReports: [],

  recentAlerts: [],

  weather: {
    temperature: 0,
    humidity: 0,
    rainfall: 0,
    windSpeed: 0,
    condition: "",
  },

  loading: false,

  error: null,
};

// ==========================================
// SLICE
// ==========================================

const adminDashboardSlice = createSlice({
  name: "adminDashboard",

  initialState,

  reducers: {
    clearAdminDashboardError: (state) => {
      state.error = null;
    },

    clearAdminDashboard: (state) => {
      state.stats = initialState.stats;
      state.riskOverview = initialState.riskOverview;
      state.recentReports = [];
      state.recentAlerts = [];
      state.weather = initialState.weather;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ======================================
      // FETCH ADMIN DASHBOARD - PENDING
      // ======================================

      .addCase(fetchAdminDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // ======================================
      // FETCH ADMIN DASHBOARD - SUCCESS
      // ======================================

      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.loading = false;

        const data = action.payload?.data || action.payload;

        state.stats = data?.stats || state.stats;

        state.riskOverview = data?.riskOverview || state.riskOverview;

        state.recentReports = data?.recentReports || [];

        state.recentAlerts = data?.recentAlerts || [];

        state.weather = data?.weather || state.weather;
      })

      // ======================================
      // FETCH ADMIN DASHBOARD - ERROR
      // ======================================

      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload || "Failed to fetch admin dashboard data";
      });
  },
});

// ==========================================
// EXPORT ACTIONS
// ==========================================

export const { clearAdminDashboardError, clearAdminDashboard } =
  adminDashboardSlice.actions;

// ==========================================
// EXPORT REDUCER
// ==========================================

export default adminDashboardSlice.reducer;
