import React from "react";
import { Navigate } from "react-router-dom";

const AuthCallback = () => {
  return <Navigate to="/login" replace />;
};

export default AuthCallback;
