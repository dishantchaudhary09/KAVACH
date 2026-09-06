import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_URL =
  (import.meta.env.VITE_API_URL || "http://localhost:3000/api") + "/alerts";

/* =========================================================
   GET ALL ALERTS
========================================================= */

export const fetchAlerts = createAsyncThunk(
  "alerts/fetchAlerts",
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
        return rejectWithValue(data.message || "Failed to fetch alerts");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Unable to connect to server");
    }
  },
);

/* =========================================================
   GET SINGLE ALERT
========================================================= */

export const fetchAlertById = createAsyncThunk(
  "alerts/fetchAlertById",
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
        return rejectWithValue(data.message || "Failed to fetch alert");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Unable to connect to server");
    }
  },
);

/* =========================================================
   CREATE ALERT
========================================================= */

export const createAlert = createAsyncThunk(
  "alerts/createAlert",
  async (alertData, { rejectWithValue }) => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(alertData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to create alert");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Unable to connect to server");
    }
  },
);

/* =========================================================
   UPDATE ALERT
========================================================= */

export const updateAlert = createAsyncThunk(
  "alerts/updateAlert",
  async ({ id, alertData }, { rejectWithValue }) => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(alertData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to update alert");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Unable to connect to server");
    }
  },
);

/* =========================================================
   DELETE ALERT
========================================================= */

export const deleteAlert = createAsyncThunk(
  "alerts/deleteAlert",
  async (id, { rejectWithValue }) => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to delete alert");
      }

      return { id, data };
    } catch (error) {
      return rejectWithValue(error.message || "Unable to connect to server");
    }
  },
);

/* =========================================================
   INITIAL STATE
========================================================= */

const initialState = {
  alerts: [],
  selectedAlert: null,

  loading: false,
  error: null,

  selectedLoading: false,
  selectedError: null,

  createLoading: false,
  createError: null,

  updateLoading: false,
  updateError: null,

  deleteLoading: false,
  deleteError: null,
};

/* =========================================================
   ALERT SLICE
========================================================= */

const alertSlice = createSlice({
  name: "alerts",

  initialState,

  reducers: {
    clearAlertError: (state) => {
      state.error = null;
    },

    clearSelectedAlert: (state) => {
      state.selectedAlert = null;
      state.selectedError = null;
    },

    clearCreateError: (state) => {
      state.createError = null;
    },

    clearUpdateError: (state) => {
      state.updateError = null;
    },

    clearDeleteError: (state) => {
      state.deleteError = null;
    },

    clearAlerts: (state) => {
      state.alerts = [];
      state.selectedAlert = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    /* =====================================================
       FETCH ALL ALERTS
    ===================================================== */

    builder
      .addCase(fetchAlerts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.loading = false;

        /*
         * Backend kabhi directly array bhej sakta hai
         * aur kabhi { alerts: [] }.
         */

        state.alerts = Array.isArray(action.payload)
          ? action.payload
          : action.payload.alerts || [];
      })

      .addCase(fetchAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch alerts";
      });

    /* =====================================================
       FETCH SINGLE ALERT
    ===================================================== */

    builder
      .addCase(fetchAlertById.pending, (state) => {
        state.selectedLoading = true;
        state.selectedError = null;
      })

      .addCase(fetchAlertById.fulfilled, (state, action) => {
        state.selectedLoading = false;

        state.selectedAlert = action.payload.alert || action.payload;
      })

      .addCase(fetchAlertById.rejected, (state, action) => {
        state.selectedLoading = false;

        state.selectedError = action.payload || "Failed to fetch alert";
      });

    /* =====================================================
       CREATE ALERT
    ===================================================== */

    builder
      .addCase(createAlert.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })

      .addCase(createAlert.fulfilled, (state, action) => {
        state.createLoading = false;

        const newAlert = action.payload.alert || action.payload;

        if (newAlert) {
          state.alerts.unshift(newAlert);
        }
      })

      .addCase(createAlert.rejected, (state, action) => {
        state.createLoading = false;

        state.createError = action.payload || "Failed to create alert";
      });

    /* =====================================================
       UPDATE ALERT
    ===================================================== */

    builder
      .addCase(updateAlert.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })

      .addCase(updateAlert.fulfilled, (state, action) => {
        state.updateLoading = false;

        const updatedAlert = action.payload.alert || action.payload;

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

      .addCase(updateAlert.rejected, (state, action) => {
        state.updateLoading = false;

        state.updateError = action.payload || "Failed to update alert";
      });

    /* =====================================================
       DELETE ALERT
    ===================================================== */

    builder
      .addCase(deleteAlert.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })

      .addCase(deleteAlert.fulfilled, (state, action) => {
        state.deleteLoading = false;

        const deletedId = action.payload.id;

        state.alerts = state.alerts.filter((alert) => alert._id !== deletedId);

        if (state.selectedAlert?._id === deletedId) {
          state.selectedAlert = null;
        }
      })

      .addCase(deleteAlert.rejected, (state, action) => {
        state.deleteLoading = false;

        state.deleteError = action.payload || "Failed to delete alert";
      });
  },
});

/* =========================================================
   ACTIONS
========================================================= */

export const {
  clearAlertError,
  clearSelectedAlert,
  clearCreateError,
  clearUpdateError,
  clearDeleteError,
  clearAlerts,
} = alertSlice.actions;

/* =========================================================
   REDUCER
========================================================= */

export default alertSlice.reducer;
