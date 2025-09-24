// src/pages/Settings.jsx
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Settings() {
  const { user } = useContext(AuthContext);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className="flex justify-center items-start py-10 px-4 text-white">
      <div className="w-full max-w-2xl bg-gradient-to-br from-indigo-900 to-indigo-1000 rounded-2xl shadow-xl p-8">
        
        {/* Title */}
        <h2 className="text-2xl font-bold mb-6">⚙️ Settings</h2>

        {/* Profile Info */}
        <div className="flex items-center gap-4 mb-8">
          <img
            src={
              user?.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user?.name || "User"
              )}&background=6366f1&color=fff&bold=true&size=128`
            }
            alt="Profile Avatar"
            className="w-14 h-14 rounded-full border-2 border-indigo-500"
          />
          <div>
            <p className="text-lg font-semibold">{user?.name}</p>
            <p className="text-sm text-gray-300">{user?.email}</p>
            <p className="text-xs text-gray-400 mt-1">
              Member since{" "}
              {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Change Password */}
        <div className="mb-6">
          <label className="block text-sm text-gray-300 mb-2">
            Change Password
          </label>
          <input
            type="password"
            placeholder="Enter new password"
            className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button className="mt-3 px-4 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-500 transition">
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}
