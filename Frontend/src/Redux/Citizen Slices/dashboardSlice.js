import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_BACKEND_API_URL ||
  "http://localhost:3000/api";

/* =========================================================
   FETCH DASHBOARD DATA
========================================================= */

export const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchDashboardData",

  async (_, { rejectWithValue, getState }) => {
    try {
      const token =
        getState().auth?.token ||
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

      if (!token) {
        return rejectWithValue("Authentication required");
      }

      const response = await fetch(`${API_URL}/dashboard`, {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data.message || "Failed to fetch dashboard data",
        );
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Unable to connect to server");
    }
  },
);

/* =========================================================
   INITIAL STATE
========================================================= */

const initialState = {
  dashboard: null,

  loading: false,

  error: null,

  lastUpdated: null,
};

/* =========================================================
   DASHBOARD SLICE
========================================================= */

const dashboardSlice = createSlice({
  name: "dashboard",

  initialState,

  reducers: {
    /* =========================================
       CLEAR ERROR
    ========================================= */

    clearDashboardError: (state) => {
      state.error = null;
    },

    /* =========================================
       CLEAR DASHBOARD
    ========================================= */

    clearDashboard: (state) => {
      state.dashboard = null;
      state.error = null;
      state.lastUpdated = null;
    },

    /* =========================================
       RESET DASHBOARD
    ========================================= */

    resetDashboard: () => initialState,
  },

  extraReducers: (builder) => {
    /* =========================================
       FETCH DASHBOARD - PENDING
    ========================================= */

    builder.addCase(fetchDashboardData.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    /* =========================================
       FETCH DASHBOARD - SUCCESS
    ========================================= */

    builder.addCase(fetchDashboardData.fulfilled, (state, action) => {
      state.loading = false;

      /*
          Backend response agar:

          {
            dashboard: {...}
          }

          hai to dashboard use hoga.

          Agar backend direct object bhej raha hai,
          to complete response use hoga.
        */

      state.dashboard = action.payload?.dashboard || action.payload;

      state.lastUpdated = new Date().toISOString();
    });

    /* =========================================
       FETCH DASHBOARD - ERROR
    ========================================= */

    builder.addCase(fetchDashboardData.rejected, (state, action) => {
      state.loading = false;

      state.error = action.payload || "Failed to fetch dashboard data";
    });
  },
});

/* =========================================================
   ACTIONS
========================================================= */

export const { clearDashboardError, clearDashboard, resetDashboard } =
  dashboardSlice.actions;

export const fetchDashboard = fetchDashboardData;

/* =========================================================
   REDUCER
========================================================= */

export default dashboardSlice.reducer;
