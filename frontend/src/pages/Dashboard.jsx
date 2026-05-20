// src/pages/Dashboard.jsx
// Temporary dashboard — just confirms login works
// Will be fully built in a later phase

import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center">

        <div className="text-5xl mb-6">🎉</div>

        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome, {user?.name}!
        </h1>

        <p className="text-gray-400 mb-2">
          {user?.email}
        </p>

        <p className="text-green-400 font-medium mb-8">
          ✅ Authentication working perfectly
        </p>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6 text-left max-w-sm mx-auto">
          <p className="text-gray-400 text-sm mb-1">User ID</p>
          <p className="text-white text-xs font-mono">{user?.id}</p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Logout
        </button>

      </div>
    </div>
  );
};

export default Dashboard;