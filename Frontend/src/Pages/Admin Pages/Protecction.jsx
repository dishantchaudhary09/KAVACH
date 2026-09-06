
import { Navigate, Outlet, useLocation } from "react-router-dom";

const AdminProtection = () => {
  const location = useLocation();

  // =====================================
  // GET TOKEN
  // =====================================
  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  // =====================================
  // GET USER SAFELY
  // =====================================
  let user = null;

  try {
    const storedUser =
      localStorage.getItem("user") ||
      sessionStorage.getItem("user");

    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Invalid stored user data:", error);

    localStorage.removeItem("user");
    sessionStorage.removeItem("user");

    user = null;
  }

  // =====================================
  // AUTH CHECK
  // =====================================
  if (!token || !user) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // =====================================
  // ROLE CHECK
  // =====================================
  const userRole = String(user.role || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");

  const allowedAdminRoles = [
    "admin",
    "administrator",
    "superadmin",
  ];

  if (!allowedAdminRoles.includes(userRole)) {
    return <Navigate to="/admin/login" replace />;
  }

  // =====================================
  // ADMIN AUTHENTICATED
  // =====================================
  return <Outlet />;
};

export default AdminProtection;

