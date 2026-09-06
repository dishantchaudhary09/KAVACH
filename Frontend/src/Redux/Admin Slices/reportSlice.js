import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// ===============================
// GET AUTH TOKEN
// ===============================
const getToken = () => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

// ===============================
// GET ALL REPORTS
// ===============================
export const fetchAdminReports = createAsyncThunk(
  "adminReports/fetchAdminReports",
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();

      if (!token) {
        return rejectWithValue(
          "Authentication token not found. Please login again.",
        );
      }

      const response = await axios.get(`${API_URL}/reports`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.reports || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch reports",
      );
    }
  },
);

// ===============================
// GET SINGLE REPORT
// ===============================
export const fetchAdminReportById = createAsyncThunk(
  "adminReports/fetchAdminReportById",
  async (reportId, { rejectWithValue }) => {
    try {
      const token = getToken();

      if (!token) {
        return rejectWithValue(
          "Authentication token not found. Please login again.",
        );
      }

      const response = await axios.get(`${API_URL}/reports/${reportId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.report;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch report",
      );
    }
  },
);

// ===============================
// UPDATE REPORT STATUS
// ===============================
export const updateAdminReportStatus = createAsyncThunk(
  "adminReports/updateAdminReportStatus",
  async ({ reportId, status }, { rejectWithValue }) => {
    try {
      const token = getToken();

      if (!token) {
        return rejectWithValue(
          "Authentication token not found. Please login again.",
        );
      }

      const response = await axios.patch(
        `${API_URL}/reports/${reportId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data.report;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update report status",
      );
    }
  },
);

// ===============================
// DELETE REPORT
// ===============================
export const deleteAdminReport = createAsyncThunk(
  "adminReports/deleteAdminReport",
  async (reportId, { rejectWithValue }) => {
    try {
      const token = getToken();

      if (!token) {
        return rejectWithValue(
          "Authentication token not found. Please login again.",
        );
      }

      await axios.delete(`${API_URL}/reports/${reportId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return reportId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete report",
      );
    }
  },
);

// ===============================
// INITIAL STATE
// ===============================
const initialState = {
  reports: [],
  selectedReport: null,

  loading: false,
  detailsLoading: false,
  updating: false,
  deleting: false,

  error: null,
  detailsError: null,
  updateError: null,
  deleteError: null,
};

// ===============================
// SLICE
// ===============================
const adminReportSlice = createSlice({
  name: "adminReports",

  initialState,

  reducers: {
    clearAdminReportError: (state) => {
      state.error = null;
      state.detailsError = null;
      state.updateError = null;
      state.deleteError = null;
    },

    clearSelectedReport: (state) => {
      state.selectedReport = null;
    },
  },

  extraReducers: (builder) => {
    // ==========================================
    // FETCH ALL REPORTS
    // ==========================================

    builder
      .addCase(fetchAdminReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchAdminReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
      })

      .addCase(fetchAdminReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ==========================================
    // FETCH SINGLE REPORT
    // ==========================================

    builder
      .addCase(fetchAdminReportById.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
      })

      .addCase(fetchAdminReportById.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.selectedReport = action.payload;
      })

      .addCase(fetchAdminReportById.rejected, (state, action) => {
        state.detailsLoading = false;
        state.detailsError = action.payload;
      });

    // ==========================================
    // UPDATE REPORT STATUS
    // ==========================================

    builder
      .addCase(updateAdminReportStatus.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })

      .addCase(updateAdminReportStatus.fulfilled, (state, action) => {
        state.updating = false;

        const updatedReport = action.payload;

        const index = state.reports.findIndex(
          (report) => report._id === updatedReport._id,
        );

        if (index !== -1) {
          // Preserve existing populated user data
          state.reports[index] = {
            ...state.reports[index],
            ...updatedReport,
          };
        }

        if (state.selectedReport?._id === updatedReport._id) {
          state.selectedReport = {
            ...state.selectedReport,
            ...updatedReport,
          };
        }
      })

      .addCase(updateAdminReportStatus.rejected, (state, action) => {
        state.updating = false;
        state.updateError = action.payload;
      });

    // ==========================================
    // DELETE REPORT
    // ==========================================

    builder
      .addCase(deleteAdminReport.pending, (state) => {
        state.deleting = true;
        state.deleteError = null;
      })

      .addCase(deleteAdminReport.fulfilled, (state, action) => {
        state.deleting = false;

        state.reports = state.reports.filter(
          (report) => report._id !== action.payload,
        );

        if (state.selectedReport?._id === action.payload) {
          state.selectedReport = null;
        }
      })

      .addCase(deleteAdminReport.rejected, (state, action) => {
        state.deleting = false;
        state.deleteError = action.payload;
      });
  },
});

// ===============================
// ACTIONS
// ===============================
export const { clearAdminReportError, clearSelectedReport } =
  adminReportSlice.actions;

// ===============================
// REDUCER
// ===============================
export default adminReportSlice.reducer;
