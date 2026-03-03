import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children, adminRequired = false }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (adminRequired && user?.role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default PrivateRoute;
