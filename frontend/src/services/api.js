// src/services/api.js
// WHY THIS FILE EXISTS:
// One place for all API calls to your Flask backend.
// Every page imports from here — if your backend URL changes,
// you update it in ONE place only.

const BASE_URL = "http://127.0.0.1:5000/api";

// Helper function — sends requests and handles errors
const request = async (endpoint, method = "GET", body = null, token = null) => {
  const headers = {
    "Content-Type": "application/json",
  };

  // If token exists, add it to the Authorization header
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await response.json();

  // If response is not ok (4xx, 5xx), throw error with message
  if (!response.ok) {
    throw new Error(data.error || "Something went wrong");
  }

  return data;
};

// ─────────────────────────────────────────
// AUTH API CALLS
// ─────────────────────────────────────────

export const registerUser = (name, email, password) =>
  request("/register", "POST", { name, email, password });

export const loginUser = (email, password) =>
  request("/login", "POST", { email, password });

export const getProfile = (token) =>
  request("/me", "GET", null, token);