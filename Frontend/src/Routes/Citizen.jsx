import { Route } from "react-router-dom";

import RoleSelection from "../Pages/Common Pages/RoleSelectionPage.jsx";
import AdminLogin from "../Pages/Common Pages/AdminLoginPage.jsx";
import CitizenLogin from "../Pages/Common Pages/CitizenLoginPage.jsx";
import CitizenDashboard from "../Pages/Citizen Pages/Dashboard.jsx";
import CitizenRegister from "../Pages/Common Pages/CitizenRegisterPage.jsx";
import RiskMap from "../Pages/Citizen Pages/Riskmap.jsx";
import CitizenAlerts from "../Pages/Citizen Pages/Alert.jsx";
import CitizenReports from "../Pages/Citizen Pages/Reports.jsx";
import CitizenMyReports from "../Pages/Citizen Pages/MyReport.jsx";
import CitizenAIAssistant from "../Pages/Citizen Pages/Ai.jsx";
import CitizenProfile from "../Pages/Citizen Pages/Profile.jsx";
import Emergency from "../Pages/Citizen Pages/Emergency.jsx";
import ProtectedRoute from "../Pages/Citizen Pages/Protection.jsx";

function CitizenRoutes() {
  return (
    <>
      <Route path="/" element={<RoleSelection />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      <Route path="/citizen/login" element={<CitizenLogin />} />
      <Route path="/citizen/register" element={<CitizenRegister />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
        <Route path="/citizen/risk-map" element={<RiskMap />} />
        <Route path="/citizen/alerts" element={<CitizenAlerts />} />
        <Route path="/citizen/reports" element={<CitizenMyReports />} />
        <Route path="/citizen/report" element={<CitizenReports />} />
        <Route path="/citizen/assistant" element={<CitizenAIAssistant />} />
        <Route path="/citizen/profile" element={<CitizenProfile />} />
        <Route path="/citizen/emergency" element={<Emergency />} />
      </Route>
    </>
  );
}

export default CitizenRoutes;
