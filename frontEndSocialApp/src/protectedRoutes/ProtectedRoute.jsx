import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const email = localStorage.getItem("signupEmail"); // email saved during signup

  if (!email) {
    // redirect if no email present
    return <Navigate to="/signup" replace />;
  }

  return children;
};

export default ProtectedRoute;
