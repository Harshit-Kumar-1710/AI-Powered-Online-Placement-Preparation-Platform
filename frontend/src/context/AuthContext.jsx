// src/context/AuthContext.jsx
// WHY THIS FILE EXISTS:
// Stores login state GLOBALLY — any component can know
// if user is logged in, who they are, and their token.
// Without this, you'd have to pass user data through every component manually.

import { createContext, useContext, useState, useEffect } from "react";

// Step 1: Create the context object
const AuthContext = createContext(null);

// Step 2: Create the Provider component
// This wraps your entire app and makes auth data available everywhere
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);    // stores user object
  const [token, setToken] = useState(null);  // stores JWT token
  const [loading, setLoading] = useState(true); // prevents flash of wrong UI

  // On app load — check if user was previously logged in
  // localStorage persists data even after browser refresh
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }

    setLoading(false); // done checking
  }, []);

  // Called after successful register or login
  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    // Save to localStorage so login persists on refresh
    localStorage.setItem("token", jwtToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Called when user clicks logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isLoggedIn: !!user, // true if user exists, false if null
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Step 3: Custom hook — makes using AuthContext cleaner
// Usage: const { user, login, logout, isLoggedIn } = useAuth();
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};