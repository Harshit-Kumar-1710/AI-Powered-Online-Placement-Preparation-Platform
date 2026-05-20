// src/components/ProtectedRoute.jsx
// WHY THIS FILE EXISTS:
// Guards pages that require login.
// If user is not logged in → redirects to /login automatically.
// Usage: wrap any route with <ProtectedRoute> in App.jsx

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) return null; // still checking localStorage

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
    // 'replace' means /dashboard won't be in browser history
    // so pressing Back won't go to the protected page
  }

  return children; // user is logged in — show the page
};

export default ProtectedRoute;