import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

// =========================================================
// COMMON PAGES
// =========================================================

import RoleSelection from "./Pages/Common Pages/RoleSelectionPage.jsx";
import AdminLogin from "./Pages/Common Pages/AdminLoginPage.jsx";
import CitizenLogin from "./Pages/Common Pages/CitizenLoginPage.jsx";
import CitizenRegister from "./Pages/Common Pages/CitizenRegisterPage.jsx";

// =========================================================
// CITIZEN PAGES
// =========================================================

import CitizenDashboard from "./Pages/Citizen Pages/Dashboard.jsx";
import RiskMap from "./Pages/Citizen Pages/Riskmap.jsx";
import CitizenAlerts from "./Pages/Citizen Pages/Alert.jsx";
import CitizenReports from "./Pages/Citizen Pages/Reports.jsx";
import CitizenMyReports from "./Pages/Citizen Pages/MyReport.jsx";
import CitizenAIAssistant from "./Pages/Citizen Pages/Ai.jsx";
import CitizenProfile from "./Pages/Citizen Pages/Profile.jsx";
import Emergency from "./Pages/Citizen Pages/Emergency.jsx";
import CitizenRoads from "./Pages/Citizen Pages/Road.jsx";
import CitizenProtectedRoute from "./Pages/Citizen Pages/Protection.jsx";

// =========================================================
// ADMIN PAGES
// =========================================================

import AdminDashboard from "./Pages/Admin Pages/Dashboard.jsx";
import AdminRiskMap from "./Pages/Admin Pages/Riskmap.jsx";
import AdminReports from "./Pages/Admin Pages/Report.jsx";
import AdminAlerts from "./Pages/Admin Pages/Alert.jsx";
import AdminRoads from "./Pages/Admin Pages/Roads.jsx";
import AdminUsers from "./Pages/Admin Pages/Users.jsx";
import AIMLMonitoring from "./Pages/Admin Pages/AiMl.jsx";
import SystemStatus from "./Pages/Admin Pages/Status.jsx";
import Settings from "./Pages/Admin Pages/Setting.jsx";
import AdminProtection from "./Pages/Admin Pages/Protecction.jsx";
import Management from "./Pages/Admin Pages/Management.jsx";

function App() {
  const darkMode = useSelector((state) => state.theme?.darkMode || false);

  // =======================================================
  // DARK MODE
  // =======================================================

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);

    document.documentElement.style.colorScheme = darkMode ? "dark" : "light";
  }, [darkMode]);

  return (
    <BrowserRouter>
      <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
        <Routes>
          {/* =================================================
              COMMON ROUTES
          ================================================= */}

          <Route path="/" element={<RoleSelection />} />

          <Route path="/admin/login" element={<AdminLogin />} />

          <Route path="/citizen/login" element={<CitizenLogin />} />

          <Route path="/citizen/register" element={<CitizenRegister />} />

          {/* =================================================
              CITIZEN PROTECTED ROUTES
          ================================================= */}

          <Route element={<CitizenProtectedRoute />}>
            <Route path="/citizen/dashboard" element={<CitizenDashboard />} />

            <Route path="/citizen/risk-map" element={<RiskMap />} />

            {/* NEW: CITIZEN ROAD STATUS */}

            <Route path="/citizen/roads" element={<CitizenRoads />} />

            <Route path="/citizen/alerts" element={<CitizenAlerts />} />

            <Route path="/citizen/reports" element={<CitizenMyReports />} />

            <Route path="/citizen/report" element={<CitizenReports />} />

            <Route path="/citizen/assistant" element={<CitizenAIAssistant />} />

            <Route path="/citizen/profile" element={<CitizenProfile />} />

            <Route path="/citizen/emergency" element={<Emergency />} />
          </Route>

          {/* =================================================
              ADMIN PROTECTED ROUTES
          ================================================= */}

          <Route element={<AdminProtection />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            <Route path="/admin/risk-map" element={<AdminRiskMap />} />

            <Route path="/admin/reports" element={<AdminReports />} />

            <Route path="/admin/alerts" element={<AdminAlerts />} />

            <Route path="/admin/roads" element={<AdminRoads />} />

            <Route path="/admin/users" element={<AdminUsers />} />

            <Route path="/admin/ml" element={<AIMLMonitoring />} />

            <Route path="/admin/system" element={<SystemStatus />} />

            <Route path="/admin/management" element={<Management />} />

            <Route path="/admin/settings" element={<Settings />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
