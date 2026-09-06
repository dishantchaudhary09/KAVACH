import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_BACKEND_API_URL ||
  "http://localhost:3000/api";

/*
========================================
GET ALL ROAD STATUS
========================================
*/

export const fetchRoadStatuses = createAsyncThunk(
  "road/fetchRoadStatuses",
  async (_, { rejectWithValue }) => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const response = await fetch(`${API_URL}/road-status`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to fetch road statuses");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Unable to connect to server");
    }
  },
);

/*
========================================
GET SINGLE ROAD STATUS
========================================
*/

export const fetchRoadStatusById = createAsyncThunk(
  "road/fetchRoadStatusById",
  async (id, { rejectWithValue }) => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const response = await fetch(`${API_URL}/road-status/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to fetch road status");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Unable to connect to server");
    }
  },
);

/*
========================================
CREATE ROAD STATUS
========================================
*/

export const createRoadStatus = createAsyncThunk(
  "road/createRoadStatus",
  async (roadData, { rejectWithValue }) => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const response = await fetch(`${API_URL}/road-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(roadData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to create road status");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Unable to connect to server");
    }
  },
);

/*
========================================
UPDATE ROAD STATUS
========================================
*/

export const updateRoadStatus = createAsyncThunk(
  "road/updateRoadStatus",
  async ({ id, roadData }, { rejectWithValue }) => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const response = await fetch(`${API_URL}/road-status/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(roadData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to update road status");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Unable to connect to server");
    }
  },
);

/*
========================================
DELETE ROAD STATUS
========================================
*/

export const deleteRoadStatus = createAsyncThunk(
  "road/deleteRoadStatus",
  async (id, { rejectWithValue }) => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const response = await fetch(`${API_URL}/road-status/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to delete road status");
      }

      return { id, ...data };
    } catch (error) {
      return rejectWithValue(error.message || "Unable to connect to server");
    }
  },
);

/*
========================================
INITIAL STATE
========================================
*/

const initialState = {
  roadStatuses: [],
  selectedRoad: null,

  loading: false,
  selectedLoading: false,
  actionLoading: false,

  error: null,
};

/*
========================================
SLICE
========================================
*/

const roadSlice = createSlice({
  name: "road",

  initialState,

  reducers: {
    clearRoadError: (state) => {
      state.error = null;
    },

    clearSelectedRoad: (state) => {
      state.selectedRoad = null;
    },

    resetRoadState: () => initialState,
  },

  extraReducers: (builder) => {
    builder

      /*
      ========================================
      FETCH ALL
      ========================================
      */

      .addCase(fetchRoadStatuses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchRoadStatuses.fulfilled, (state, action) => {
        state.loading = false;

        /*
         * Backend directly array bhej sakta hai
         * ya { roadStatuses: [] } bhej sakta hai.
         */

        state.roadStatuses = Array.isArray(action.payload)
          ? action.payload
          : action.payload.roadStatuses || [];
      })

      .addCase(fetchRoadStatuses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch road statuses";
      })

      /*
      ========================================
      FETCH SINGLE
      ========================================
      */

      .addCase(fetchRoadStatusById.pending, (state) => {
        state.selectedLoading = true;
        state.error = null;
      })

      .addCase(fetchRoadStatusById.fulfilled, (state, action) => {
        state.selectedLoading = false;

        state.selectedRoad = action.payload.roadStatus || action.payload;
      })

      .addCase(fetchRoadStatusById.rejected, (state, action) => {
        state.selectedLoading = false;
        state.error = action.payload || "Failed to fetch road status";
      })

      /*
      ========================================
      CREATE
      ========================================
      */

      .addCase(createRoadStatus.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })

      .addCase(createRoadStatus.fulfilled, (state, action) => {
        state.actionLoading = false;

        const newRoad = action.payload.roadStatus || action.payload;

        if (newRoad) {
          state.roadStatuses.unshift(newRoad);
        }
      })

      .addCase(createRoadStatus.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload || "Failed to create road status";
      })

      /*
      ========================================
      UPDATE
      ========================================
      */

      .addCase(updateRoadStatus.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })

      .addCase(updateRoadStatus.fulfilled, (state, action) => {
        state.actionLoading = false;

        const updatedRoad = action.payload.roadStatus || action.payload;

        if (!updatedRoad?._id) {
          return;
        }

        const index = state.roadStatuses.findIndex(
          (road) => road._id === updatedRoad._id,
        );

        if (index !== -1) {
          state.roadStatuses[index] = updatedRoad;
        }

        if (state.selectedRoad?._id === updatedRoad._id) {
          state.selectedRoad = updatedRoad;
        }
      })

      .addCase(updateRoadStatus.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload || "Failed to update road status";
      })

      /*
      ========================================
      DELETE
      ========================================
      */

      .addCase(deleteRoadStatus.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })

      .addCase(deleteRoadStatus.fulfilled, (state, action) => {
        state.actionLoading = false;

        state.roadStatuses = state.roadStatuses.filter(
          (road) => road._id !== action.payload.id,
        );

        if (state.selectedRoad?._id === action.payload.id) {
          state.selectedRoad = null;
        }
      })

      .addCase(deleteRoadStatus.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload || "Failed to delete road status";
      });
  },
});

export const { clearRoadError, clearSelectedRoad, resetRoadState } =
  roadSlice.actions;

export default roadSlice.reducer;
