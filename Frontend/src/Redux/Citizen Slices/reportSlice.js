import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_URL =
  (import.meta.env.VITE_API_URL || "http://localhost:3000/api") + "/reports";

/* =========================================================
   GET ALL REPORTS
   Admin ke liye useful
========================================================= */

export const fetchReports = createAsyncThunk(
  "reports/fetchReports",

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
        return rejectWithValue(data.message || "Failed to fetch reports");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Unable to connect to server");
    }
  },
);

/* =========================================================
   GET MY REPORTS
========================================================= */

export const fetchMyReports = createAsyncThunk(
  "reports/fetchMyReports",

  async (_, { rejectWithValue }) => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const response = await fetch(`${API_URL}/my-reports`, {
        method: "GET",

        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to fetch your reports");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Unable to connect to server");
    }
  },
);

/* =========================================================
   GET SINGLE REPORT
========================================================= */

export const fetchReportById = createAsyncThunk(
  "reports/fetchReportById",

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
        return rejectWithValue(data.message || "Failed to fetch report");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Unable to connect to server");
    }
  },
);

/* =========================================================
   CREATE REPORT
========================================================= */

export const createReport = createAsyncThunk(
  "reports/createReport",

  async (reportData, { rejectWithValue }) => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      /*
       * Report may contain image/file.
       *
       * If FormData is passed from the page,
       * don't manually set Content-Type.
       */

      const isFormData = reportData instanceof FormData;

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      if (!isFormData) {
        headers["Content-Type"] = "application/json";
      }

      const response = await fetch(API_URL, {
        method: "POST",

        headers,

        body: isFormData ? reportData : JSON.stringify(reportData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to submit report");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Unable to connect to server");
    }
  },
);

/* =========================================================
   UPDATE REPORT
   Admin verification/status update ke liye
========================================================= */

export const updateReport = createAsyncThunk(
  "reports/updateReport",

  async ({ id, reportData }, { rejectWithValue }) => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const isFormData = reportData instanceof FormData;

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      if (!isFormData) {
        headers["Content-Type"] = "application/json";
      }

      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",

        headers,

        body: isFormData ? reportData : JSON.stringify(reportData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to update report");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Unable to connect to server");
    }
  },
);

/* =========================================================
   DELETE REPORT
========================================================= */

export const deleteReport = createAsyncThunk(
  "reports/deleteReport",

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
        return rejectWithValue(data.message || "Failed to delete report");
      }

      return {
        id,
        data,
      };
    } catch (error) {
      return rejectWithValue(error.message || "Unable to connect to server");
    }
  },
);

/* =========================================================
   INITIAL STATE
========================================================= */

const initialState = {
  reports: [],

  myReports: [],

  selectedReport: null,

  loading: false,

  myReportsLoading: false,

  selectedLoading: false,

  createLoading: false,

  updateLoading: false,

  deleteLoading: false,

  error: null,

  myReportsError: null,

  selectedError: null,

  createError: null,

  updateError: null,

  deleteError: null,
};

/* =========================================================
   REPORT SLICE
========================================================= */

const reportSlice = createSlice({
  name: "reports",

  initialState,

  reducers: {
    /* ---------------------------------------------
       CLEAR GENERAL ERROR
    --------------------------------------------- */

    clearReportError: (state) => {
      state.error = null;
    },

    /* ---------------------------------------------
       CLEAR MY REPORTS ERROR
    --------------------------------------------- */

    clearMyReportsError: (state) => {
      state.myReportsError = null;
    },

    /* ---------------------------------------------
       CLEAR SELECTED REPORT
    --------------------------------------------- */

    clearSelectedReport: (state) => {
      state.selectedReport = null;
      state.selectedError = null;
    },

    /* ---------------------------------------------
       CLEAR CREATE ERROR
    --------------------------------------------- */

    clearCreateError: (state) => {
      state.createError = null;
    },

    /* ---------------------------------------------
       CLEAR UPDATE ERROR
    --------------------------------------------- */

    clearUpdateError: (state) => {
      state.updateError = null;
    },

    /* ---------------------------------------------
       CLEAR DELETE ERROR
    --------------------------------------------- */

    clearDeleteError: (state) => {
      state.deleteError = null;
    },

    /* ---------------------------------------------
       CLEAR ALL REPORT DATA
    --------------------------------------------- */

    clearReports: (state) => {
      state.reports = [];
      state.myReports = [];
      state.selectedReport = null;

      state.error = null;
      state.myReportsError = null;
      state.selectedError = null;
    },
  },

  extraReducers: (builder) => {
    /* =====================================================
       FETCH ALL REPORTS
    ===================================================== */

    builder
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false;

        state.reports = Array.isArray(action.payload)
          ? action.payload
          : action.payload.reports || [];
      })

      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload || "Failed to fetch reports";
      });

    /* =====================================================
       FETCH MY REPORTS
    ===================================================== */

    builder
      .addCase(fetchMyReports.pending, (state) => {
        state.myReportsLoading = true;
        state.myReportsError = null;
      })

      .addCase(fetchMyReports.fulfilled, (state, action) => {
        state.myReportsLoading = false;

        state.myReports = Array.isArray(action.payload)
          ? action.payload
          : action.payload.reports || [];
      })

      .addCase(fetchMyReports.rejected, (state, action) => {
        state.myReportsLoading = false;

        state.myReportsError = action.payload || "Failed to fetch your reports";
      });

    /* =====================================================
       FETCH SINGLE REPORT
    ===================================================== */

    builder
      .addCase(fetchReportById.pending, (state) => {
        state.selectedLoading = true;
        state.selectedError = null;
      })

      .addCase(fetchReportById.fulfilled, (state, action) => {
        state.selectedLoading = false;

        state.selectedReport = action.payload.report || action.payload;
      })

      .addCase(fetchReportById.rejected, (state, action) => {
        state.selectedLoading = false;

        state.selectedError = action.payload || "Failed to fetch report";
      });

    /* =====================================================
       CREATE REPORT
    ===================================================== */

    builder
      .addCase(createReport.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })

      .addCase(createReport.fulfilled, (state, action) => {
        state.createLoading = false;

        const newReport = action.payload.report || action.payload;

        if (newReport) {
          state.reports.unshift(newReport);
          state.myReports.unshift(newReport);
        }
      })

      .addCase(createReport.rejected, (state, action) => {
        state.createLoading = false;

        state.createError = action.payload || "Failed to submit report";
      });

    /* =====================================================
       UPDATE REPORT
    ===================================================== */

    builder
      .addCase(updateReport.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })

      .addCase(updateReport.fulfilled, (state, action) => {
        state.updateLoading = false;

        const updatedReport = action.payload.report || action.payload;

        if (!updatedReport?._id) {
          return;
        }

        /* Update reports */

        const reportIndex = state.reports.findIndex(
          (report) => report._id === updatedReport._id,
        );

        if (reportIndex !== -1) {
          state.reports[reportIndex] = updatedReport;
        }

        /* Update my reports */

        const myReportIndex = state.myReports.findIndex(
          (report) => report._id === updatedReport._id,
        );

        if (myReportIndex !== -1) {
          state.myReports[myReportIndex] = updatedReport;
        }

        /* Update selected report */

        if (state.selectedReport?._id === updatedReport._id) {
          state.selectedReport = updatedReport;
        }
      })

      .addCase(updateReport.rejected, (state, action) => {
        state.updateLoading = false;

        state.updateError = action.payload || "Failed to update report";
      });

    /* =====================================================
       DELETE REPORT
    ===================================================== */

    builder
      .addCase(deleteReport.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })

      .addCase(deleteReport.fulfilled, (state, action) => {
        state.deleteLoading = false;

        const deletedId = action.payload.id;

        state.reports = state.reports.filter(
          (report) => report._id !== deletedId,
        );

        state.myReports = state.myReports.filter(
          (report) => report._id !== deletedId,
        );

        if (state.selectedReport?._id === deletedId) {
          state.selectedReport = null;
        }
      })

      .addCase(deleteReport.rejected, (state, action) => {
        state.deleteLoading = false;

        state.deleteError = action.payload || "Failed to delete report";
      });
  },
});

/* =========================================================
   ACTIONS
========================================================= */

export const {
  clearReportError,
  clearMyReportsError,
  clearSelectedReport,
  clearCreateError,
  clearUpdateError,
  clearDeleteError,
  clearReports,
} = reportSlice.actions;

/* =========================================================
   REDUCER
========================================================= */

export default reportSlice.reducer;
