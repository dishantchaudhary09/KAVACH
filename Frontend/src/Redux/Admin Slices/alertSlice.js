import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ===============================
// API URL
// ===============================
const API_URL = import.meta.env.VITE_API_URL;

// ===============================
// GET AUTH TOKEN
// ===============================
const getAuthToken = () => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

// ===============================
// GET ALL ADMIN ALERTS
// ===============================
export const fetchAdminAlerts = createAsyncThunk(
  "adminAlerts/fetchAdminAlerts",
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();

      if (!token) {
        return rejectWithValue("Authentication required. Please login again.");
      }

      const response = await axios.get(`${API_URL}/alerts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.alerts || [];
    } catch (error) {
      console.error(
        "FETCH ADMIN ALERTS ERROR:",
        error.response?.data || error.message,
      );

      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch alerts",
      );
    }
  },
);

// ===============================
// GET SINGLE ADMIN ALERT
// ===============================
export const fetchAdminAlertById = createAsyncThunk(
  "adminAlerts/fetchAdminAlertById",
  async (alertId, { rejectWithValue }) => {
    try {
      const token = getAuthToken();

      if (!token) {
        return rejectWithValue("Authentication required. Please login again.");
      }

      const response = await axios.get(`${API_URL}/alerts/${alertId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.alert;
    } catch (error) {
      console.error(
        "FETCH ADMIN ALERT ERROR:",
        error.response?.data || error.message,
      );

      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch alert",
      );
    }
  },
);

// ===============================
// CREATE ADMIN ALERT
// ===============================
export const createAdminAlert = createAsyncThunk(
  "adminAlerts/createAdminAlert",
  async (alertData, { rejectWithValue }) => {
    try {
      const token = getAuthToken();

      if (!token) {
        return rejectWithValue("Authentication required. Please login again.");
      }

      console.log("Creating admin alert...");
      console.log("Token available:", Boolean(token));
      console.log("Alert data:", alertData);

      const response = await axios.post(`${API_URL}/alerts`, alertData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("CREATE ALERT RESPONSE:", response.data);

      return response.data.alert;
    } catch (error) {
      console.error(
        "CREATE ADMIN ALERT ERROR:",
        error.response?.data || error.message,
      );

      return rejectWithValue(
        error.response?.data?.message || "Failed to create alert",
      );
    }
  },
);

// ===============================
// UPDATE ADMIN ALERT
// ===============================
export const updateAdminAlert = createAsyncThunk(
  "adminAlerts/updateAdminAlert",
  async ({ alertId, alertData }, { rejectWithValue }) => {
    try {
      const token = getAuthToken();

      if (!token) {
        return rejectWithValue("Authentication required. Please login again.");
      }

      const response = await axios.patch(
        `${API_URL}/alerts/${alertId}`,
        alertData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      return response.data.alert;
    } catch (error) {
      console.error(
        "UPDATE ADMIN ALERT ERROR:",
        error.response?.data || error.message,
      );

      return rejectWithValue(
        error.response?.data?.message || "Failed to update alert",
      );
    }
  },
);

// ===============================
// DELETE ADMIN ALERT
// ===============================
export const deleteAdminAlert = createAsyncThunk(
  "adminAlerts/deleteAdminAlert",
  async (alertId, { rejectWithValue }) => {
    try {
      const token = getAuthToken();

      if (!token) {
        return rejectWithValue("Authentication required. Please login again.");
      }

      await axios.delete(`${API_URL}/alerts/${alertId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return alertId;
    } catch (error) {
      console.error(
        "DELETE ADMIN ALERT ERROR:",
        error.response?.data || error.message,
      );

      return rejectWithValue(
        error.response?.data?.message || "Failed to delete alert",
      );
    }
  },
);

// ===============================
// INITIAL STATE
// ===============================
const initialState = {
  alerts: [],
  selectedAlert: null,

  loading: false,
  detailsLoading: false,
  creating: false,
  updating: false,
  deleting: false,

  error: null,
  detailsError: null,
  createError: null,
  updateError: null,
  deleteError: null,
};

// ===============================
// SLICE
// ===============================
const adminAlertSlice = createSlice({
  name: "adminAlerts",

  initialState,

  reducers: {
    // ===============================
    // CLEAR ERRORS
    // ===============================
    clearAdminAlertError: (state) => {
      state.error = null;
      state.detailsError = null;
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
    },

    // ===============================
    // CLEAR SELECTED ALERT
    // ===============================
    clearSelectedAlert: (state) => {
      state.selectedAlert = null;
    },
  },

  extraReducers: (builder) => {
    // ==================================================
    // FETCH ALL ALERTS
    // ==================================================

    builder
      .addCase(fetchAdminAlerts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchAdminAlerts.fulfilled, (state, action) => {
        state.loading = false;

        state.alerts = Array.isArray(action.payload) ? action.payload : [];
      })

      .addCase(fetchAdminAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch alerts";
      });

    // ==================================================
    // FETCH SINGLE ALERT
    // ==================================================

    builder
      .addCase(fetchAdminAlertById.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
      })

      .addCase(fetchAdminAlertById.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.selectedAlert = action.payload;
      })

      .addCase(fetchAdminAlertById.rejected, (state, action) => {
        state.detailsLoading = false;

        state.detailsError = action.payload || "Failed to fetch alert";
      });

    // ==================================================
    // CREATE ALERT
    // ==================================================

    builder
      .addCase(createAdminAlert.pending, (state) => {
        state.creating = true;
        state.createError = null;
      })

      .addCase(createAdminAlert.fulfilled, (state, action) => {
        state.creating = false;

        if (action.payload) {
          state.alerts.unshift(action.payload);
        }
      })

      .addCase(createAdminAlert.rejected, (state, action) => {
        state.creating = false;

        state.createError = action.payload || "Failed to create alert";
      });

    // ==================================================
    // UPDATE ALERT
    // ==================================================

    builder
      .addCase(updateAdminAlert.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })

      .addCase(updateAdminAlert.fulfilled, (state, action) => {
        state.updating = false;

        const updatedAlert = action.payload;

        if (!updatedAlert?._id) {
          return;
        }

        const index = state.alerts.findIndex(
          (alert) => alert._id === updatedAlert._id,
        );

        if (index !== -1) {
          state.alerts[index] = updatedAlert;
        }

        if (state.selectedAlert?._id === updatedAlert._id) {
          state.selectedAlert = updatedAlert;
        }
      })

      .addCase(updateAdminAlert.rejected, (state, action) => {
        state.updating = false;

        state.updateError = action.payload || "Failed to update alert";
      });

    // ==================================================
    // DELETE ALERT
    // ==================================================

    builder
      .addCase(deleteAdminAlert.pending, (state) => {
        state.deleting = true;
        state.deleteError = null;
      })

      .addCase(deleteAdminAlert.fulfilled, (state, action) => {
        state.deleting = false;

        state.alerts = state.alerts.filter(
          (alert) => alert._id !== action.payload,
        );

        if (state.selectedAlert?._id === action.payload) {
          state.selectedAlert = null;
        }
      })

      .addCase(deleteAdminAlert.rejected, (state, action) => {
        state.deleting = false;

        state.deleteError = action.payload || "Failed to delete alert";
      });
  },
});

// ===============================
// ACTIONS
// ===============================
export const { clearAdminAlertError, clearSelectedAlert } =
  adminAlertSlice.actions;

// ===============================
// REDUCER
// ===============================
export default adminAlertSlice.reducer;
