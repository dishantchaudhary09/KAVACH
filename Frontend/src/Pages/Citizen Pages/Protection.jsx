import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const location = useLocation();

  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  // No login information
  if (!token || !user) {
    return <Navigate to="/citizen/login" replace state={{ from: location }} />;
  }

  // Check user data
  let userData;

  try {
    userData = JSON.parse(user);
  } catch (error) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return <Navigate to="/citizen/login" replace />;
  }

  // Only citizen can access citizen pages
  if (userData.role !== "citizen") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return <Navigate to="/citizen/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
