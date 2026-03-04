import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children, adminRequired = false }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    // Redirect to login with a return URL
    return <Navigate to="/login" state={{ from: window.location.pathname }} />;
  }

  if (adminRequired && user?.role !== "admin") {
    // If admin required but user is not admin, redirect to user dashboard
    return <Navigate to="/dashboard" />;
  }

  // If user is admin but trying to access user dashboard, redirect to admin
  if (
    !adminRequired &&
    user?.role === "admin" &&
    window.location.pathname === "/dashboard"
  ) {
    return <Navigate to="/admin" />;
  }

  return children;
};

export default PrivateRoute;
