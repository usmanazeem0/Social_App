// ProtectedRouteForHome.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRouteForHome = ({ children }) => {
  const token = localStorage.getItem("token"); // saved on login

  if (!token) {
    // If not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRouteForHome;
