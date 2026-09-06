import { Route } from "react-router-dom";

import AdminDashboard from "../Pages/Admin Pages/Dashboard.jsx";
import AdminRiskMap from "../Pages/Admin Pages/Riskmap.jsx";
import AdminReports from "../Pages/Admin Pages/Report.jsx";
import AdminAlerts from "../Pages/Admin Pages/alerts.jsx";
import AdminRoads from "../Pages/Admin Pages/Roads.jsx";
import AdminUsers from "../Pages/Admin Pages/Users.jsx";
import AIMLMonitoring from "../Pages/Admin Pages/AiMl.jsx";
import SystemStatus from "../Pages/Admin Pages/Status.jsx";
import Settings from "../Pages/Admin Pages/Setting.jsx";
import AdminProtection from "../Pages/Admin Pages/Protecction.jsx";
import Management from "../Pages/Admin Pages/Management.jsx";

function AdminRoutes() {
  return (
    <>
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
    </>
  );
}

export default AdminRoutes;
