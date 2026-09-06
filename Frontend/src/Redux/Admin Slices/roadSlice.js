
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// ==========================================
// API URL
// ==========================================

const API_URL =
  (import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_BACKEND_API_URL ||
    "http://localhost:3000/api") + "/roads";

// ==========================================
// AUTH TOKEN HELPER
// ==========================================

const getAuthToken = () => {
  return (
    localStorage.getItem("token") ||
    sessionStorage.getItem("token")
  );
};

// ==========================================
// AUTH HEADERS
// ==========================================

const getAuthHeaders = () => {
  const token = getAuthToken();

  return {
    "Content-Type": "application/json",

    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
};

// ==========================================
// GET ALL ROAD STATUS
// ==========================================

export const fetchAdminRoads = createAsyncThunk(
  "adminRoad/fetchAdminRoads",

  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();

      if (!token) {
        return rejectWithValue(
          "Authentication required. Please login again."
        );
      }

      const response = await fetch(API_URL, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      console.log("🛣️ Admin roads response:", data);

      if (!response.ok) {
        return rejectWithValue(
          data.message || "Failed to fetch road data"
        );
      }

      return data;
    } catch (error) {
      console.error(
        "❌ Fetch roads error:",
        error
      );

      return rejectWithValue(
        error.message || "Server error"
      );
    }
  }
);

// ==========================================
// GET SINGLE ROAD
// ==========================================

export const fetchAdminRoadById = createAsyncThunk(
  "adminRoad/fetchAdminRoadById",

  async (roadId, { rejectWithValue }) => {
    try {
      if (!roadId) {
        return rejectWithValue(
          "Road ID is required"
        );
      }

      const token = getAuthToken();

      if (!token) {
        return rejectWithValue(
          "Authentication required. Please login again."
        );
      }

      const response = await fetch(
        `${API_URL}/${roadId}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json();

      console.log(
        "🛣️ Single road response:",
        data
      );

      if (!response.ok) {
        return rejectWithValue(
          data.message || "Failed to fetch road"
        );
      }

      return data;
    } catch (error) {
      console.error(
        "❌ Fetch road details error:",
        error
      );

      return rejectWithValue(
        error.message || "Server error"
      );
    }
  }
);

// ==========================================
// CREATE ROAD STATUS
// ==========================================

export const createAdminRoad = createAsyncThunk(
  "adminRoad/createAdminRoad",

  async (roadData, { rejectWithValue }) => {
    try {
      const token = getAuthToken();

      if (!token) {
        return rejectWithValue(
          "Authentication required. Please login again."
        );
      }

      if (!roadData) {
        return rejectWithValue(
          "Road data is required"
        );
      }

      const response = await fetch(API_URL, {
        method: "POST",

        headers: getAuthHeaders(),

        body: JSON.stringify(roadData),
      });

      const data = await response.json();

      console.log(
        "🛣️ Create road response:",
        data
      );

      if (!response.ok) {
        return rejectWithValue(
          data.message ||
            "Failed to create road status"
        );
      }

      return data;
    } catch (error) {
      console.error(
        "❌ Create road error:",
        error
      );

      return rejectWithValue(
        error.message || "Server error"
      );
    }
  }
);

// ==========================================
// UPDATE ROAD STATUS
// ==========================================

export const updateAdminRoad = createAsyncThunk(
  "adminRoad/updateAdminRoad",

  async (
    { roadId, roadData },
    { rejectWithValue }
  ) => {
    try {
      if (!roadId) {
        return rejectWithValue(
          "Road ID is required"
        );
      }

      const token = getAuthToken();

      if (!token) {
        return rejectWithValue(
          "Authentication required. Please login again."
        );
      }

      const response = await fetch(
        `${API_URL}/${roadId}`,
        {
          method: "PATCH",

          headers: getAuthHeaders(),

          body: JSON.stringify(
            roadData || {}
          ),
        }
      );

      const data = await response.json();

      console.log(
        "🛣️ Update road response:",
        data
      );

      if (!response.ok) {
        return rejectWithValue(
          data.message ||
            "Failed to update road"
        );
      }

      return data;
    } catch (error) {
      console.error(
        "❌ Update road error:",
        error
      );

      return rejectWithValue(
        error.message || "Server error"
      );
    }
  }
);

// ==========================================
// DELETE ROAD
// ==========================================

export const deleteAdminRoad = createAsyncThunk(
  "adminRoad/deleteAdminRoad",

  async (roadId, { rejectWithValue }) => {
    try {
      if (!roadId) {
        return rejectWithValue(
          "Road ID is required"
        );
      }

      const token = getAuthToken();

      if (!token) {
        return rejectWithValue(
          "Authentication required. Please login again."
        );
      }

      const response = await fetch(
        `${API_URL}/${roadId}`,
        {
          method: "DELETE",

          headers: {
            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },
        }
      );

      const data = await response.json();

      console.log(
        "🛣️ Delete road response:",
        data
      );

      if (!response.ok) {
        return rejectWithValue(
          data.message ||
            "Failed to delete road"
        );
      }

      return roadId;
    } catch (error) {
      console.error(
        "❌ Delete road error:",
        error
      );

      return rejectWithValue(
        error.message || "Server error"
      );
    }
  }
);

// ==========================================
// INITIAL STATE
// ==========================================

const initialState = {
  roads: [],
  selectedRoad: null,

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

  successMessage: null,
};

// ==========================================
// SLICE
// ==========================================

const adminRoadSlice = createSlice({
  name: "adminRoad",

  initialState,

  reducers: {
    clearAdminRoadError: (state) => {
      state.error = null;
      state.detailsError = null;
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
    },

    clearSelectedAdminRoad: (state) => {
      state.selectedRoad = null;
    },

    clearAdminRoadSuccess: (state) => {
      state.successMessage = null;
    },
  },

  extraReducers: (builder) => {
    // ======================================
    // FETCH ALL ROADS
    // ======================================

    builder
      .addCase(
        fetchAdminRoads.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchAdminRoads.fulfilled,
        (state, action) => {
          state.loading = false;

          const payload =
            action.payload || {};

          state.roads = Array.isArray(
            payload.roads
          )
            ? payload.roads
            : Array.isArray(
                  payload.roadStatuses
                )
              ? payload.roadStatuses
              : Array.isArray(payload.data)
                ? payload.data
                : [];
        }
      )

      .addCase(
        fetchAdminRoads.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to fetch road data";
        }
      );

    // ======================================
    // FETCH SINGLE ROAD
    // ======================================

    builder
      .addCase(
        fetchAdminRoadById.pending,
        (state) => {
          state.detailsLoading = true;
          state.detailsError = null;
        }
      )

      .addCase(
        fetchAdminRoadById.fulfilled,
        (state, action) => {
          state.detailsLoading = false;

          const payload =
            action.payload || {};

          state.selectedRoad =
            payload.road ||
            payload.roadStatus ||
            payload.data ||
            null;
        }
      )

      .addCase(
        fetchAdminRoadById.rejected,
        (state, action) => {
          state.detailsLoading = false;

          state.detailsError =
            action.payload ||
            "Failed to fetch road";
        }
      );

    // ======================================
    // CREATE ROAD
    // ======================================

    builder
      .addCase(
        createAdminRoad.pending,
        (state) => {
          state.creating = true;
          state.createError = null;
          state.successMessage = null;
        }
      )

      .addCase(
        createAdminRoad.fulfilled,
        (state, action) => {
          state.creating = false;

          const payload =
            action.payload || {};

          const road =
            payload.road ||
            payload.roadStatus ||
            payload.data;

          if (road) {
            state.roads.unshift(road);
          }

          state.successMessage =
            payload.message ||
            "Road status created successfully";
        }
      )

      .addCase(
        createAdminRoad.rejected,
        (state, action) => {
          state.creating = false;

          state.createError =
            action.payload ||
            "Failed to create road status";
        }
      );

    // ======================================
    // UPDATE ROAD
    // ======================================

    builder
      .addCase(
        updateAdminRoad.pending,
        (state) => {
          state.updating = true;
          state.updateError = null;
          state.successMessage = null;
        }
      )

      .addCase(
        updateAdminRoad.fulfilled,
        (state, action) => {
          state.updating = false;

          const payload =
            action.payload || {};

          const updatedRoad =
            payload.road ||
            payload.roadStatus ||
            payload.data;

          if (updatedRoad) {
            const index =
              state.roads.findIndex(
                (road) =>
                  road._id ===
                  updatedRoad._id
              );

            if (index !== -1) {
              state.roads[index] = {
                ...state.roads[index],
                ...updatedRoad,
              };
            }

            if (
              state.selectedRoad?._id ===
              updatedRoad._id
            ) {
              state.selectedRoad = {
                ...state.selectedRoad,
                ...updatedRoad,
              };
            }
          }

          state.successMessage =
            payload.message ||
            "Road status updated successfully";
        }
      )

      .addCase(
        updateAdminRoad.rejected,
        (state, action) => {
          state.updating = false;

          state.updateError =
            action.payload ||
            "Failed to update road";
        }
      );

    // ======================================
    // DELETE ROAD
    // ======================================

    builder
      .addCase(
        deleteAdminRoad.pending,
        (state) => {
          state.deleting = true;
          state.deleteError = null;
          state.successMessage = null;
        }
      )

      .addCase(
        deleteAdminRoad.fulfilled,
        (state, action) => {
          state.deleting = false;

          state.roads =
            state.roads.filter(
              (road) =>
                road._id !== action.payload
            );

          if (
            state.selectedRoad?._id ===
            action.payload
          ) {
            state.selectedRoad = null;
          }

          state.successMessage =
            "Road status deleted successfully";
        }
      )

      .addCase(
        deleteAdminRoad.rejected,
        (state, action) => {
          state.deleting = false;

          state.deleteError =
            action.payload ||
            "Failed to delete road";
        }
      );
  },
});

// ==========================================
// ACTIONS
// ==========================================

export const {
  clearAdminRoadError,
  clearSelectedAdminRoad,
  clearAdminRoadSuccess,
} = adminRoadSlice.actions;

// ==========================================
// SELECTORS
// ==========================================

export const selectAdminRoads = (state) =>
  state.adminRoad?.roads || [];

export const selectSelectedAdminRoad = (
  state
) =>
  state.adminRoad?.selectedRoad || null;

export default adminRoadSlice.reducer;

