import { configureStore } from "@reduxjs/toolkit";

// ==============================
// CITIZEN SLICES
// ==============================
import themeReducer from "./Citizen Slices/themeSlice";
import authReducer from "./Citizen Slices/authSlice";
import riskReducer from "./Citizen Slices/riskSlice";
import alertReducer from "./Citizen Slices/alertSlice";
import dashboardReducer from "./Citizen Slices/dashboardSlice";
import reportReducer from "./Citizen Slices/reportSlice";
import weatherReducer from "./Citizen Slices/weatherSlice";
import roadReducer from "./Citizen Slices/roadSlice";

// ==============================
// ADMIN SLICES
// ==============================
import adminDashboardReducer from "./Admin Slices/dashboardSlice";
import adminAlertReducer from "./Admin Slices/alertSlice";
import adminReportReducer from "./Admin Slices/reportSlice";
import adminRiskReducer from "./Admin Slices/riskSlice";
import adminRoadReducer from "./Admin Slices/roadSlice";

export const store = configureStore({
  reducer: {
    // ==========================
    // CITIZEN
    // ==========================
    theme: themeReducer,
    auth: authReducer,
    risk: riskReducer,
    alerts: alertReducer,
    dashboard: dashboardReducer,
    reports: reportReducer,
    weather: weatherReducer,
    road: roadReducer,

    // ==========================
    // ADMIN
    // ==========================
    adminDashboard: adminDashboardReducer,
    adminAlerts: adminAlertReducer,
    adminReports: adminReportReducer,
    adminRisk: adminRiskReducer,
    adminRoad: adminRoadReducer,
  },
});
