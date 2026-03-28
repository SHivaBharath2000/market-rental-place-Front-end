/* eslint-disable react/prop-types */
import { Navigate, useLocation } from "react-router-dom";

function hasValidSession() {
  return Boolean(localStorage.getItem("token"));
}

/** Renders children only when a session token exists; otherwise redirects to Login. */
export default function ProtectedRoute({ children }) {
  const location = useLocation();

  if (!hasValidSession()) {
    return <Navigate to="/Login" replace state={{ from: location }} />;
  }

  return children;
}
