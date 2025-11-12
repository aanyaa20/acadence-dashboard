// src/pages/Settings.jsx
import React, { useState, useContext, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  FaUser,
  FaLock,
  FaBell,
  FaGlobe,
  FaEye,
  FaEyeSlash,
  FaCheck,
  FaCamera,
  FaUpload,
} from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
import API_BASE_URL from "../config";

export default function Settings() {
  const { user, refreshUser } = useContext(AuthContext);
  const fileInputRef = useRef(null);

  // Profile photo state
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [courseUpdates, setCourseUpdates] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  // Language preference
  const [language, setLanguage] = useState("en");

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoUpload = async () => {
    if (!photoPreview) {
      toast.error("Please select a photo first");
      return;
    }

    try {
      setUploadingPhoto(true);
      const authToken = localStorage.getItem('token');

      const response = await axios.put(
        `${API_BASE_URL}/api/users/profile-photo`,
        { profilePhoto: photoPreview },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      toast.success("Profile photo updated successfully!");
      setPhotoPreview(null);
      
      // Refresh user data
      if (refreshUser) {
        await refreshUser();
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast.error(error.response?.data?.message || "Failed to upload photo");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handlePasswordUpdate = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    // Here you would call your API to update password
    toast.success("Password updated successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleNotificationSave = () => {
    toast.success("Notification preferences saved!");
  };

  return (
    <div
      className="pt-20 py-8 px-6 min-h-screen"
      style={{ backgroundColor: "var(--color-bg-secondary)" }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1
            className="text-3xl font-bold mb-2"
            style={{
              background: "var(--gradient-primary)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Settings
          </h1>
          <p
            className="text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Manage your account preferences and settings
          </p>
        </div>

        {/* Profile Section */}
        <div
          className="rounded-xl shadow-lg p-6 mb-5 border"
          style={{
            backgroundColor: "var(--color-bg-elevated)",
            borderColor: "var(--color-border-light)",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <FaUser style={{ color: "var(--color-primary)" }} />
            <h2
              className="text-lg font-semibold"
              style={{ color: "var(--color-text-primary)" }}
            >
              Profile Information
            </h2>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Profile Photo */}
            <div className="relative">
              <img
                src={
                  photoPreview ||
                  user?.profilePhoto ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user?.name || "User"
                  )}&background=9333EA&color=fff&bold=true&size=128`
                }
                alt="Profile Avatar"
                className="w-24 h-24 rounded-full border-4 shadow-lg object-cover"
                style={{ borderColor: "var(--color-primary)" }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 rounded-full shadow-lg border-2 transition-transform hover:scale-110"
                style={{
                  backgroundColor: "var(--color-primary)",
                  borderColor: "var(--color-bg-elevated)",
                  color: "white",
                }}
              >
                <FaCamera />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <p
                className="text-lg font-semibold"
                style={{ color: "var(--color-text-primary)" }}
              >
                {user?.name}
              </p>
              <p
                className="text-sm"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {user?.email}
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                Member since{" "}
                {new Date(user?.createdAt || Date.now()).toLocaleDateString(
                  "en-US",
                  { month: "long", year: "numeric" }
                )}
              </p>

              {/* Upload Button */}
              {photoPreview && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={handlePhotoUpload}
                    disabled={uploadingPhoto}
                    className="px-4 py-2 rounded-lg font-semibold text-white transition-all flex items-center gap-2"
                    style={{
                      background: uploadingPhoto
                        ? "var(--color-border-light)"
                        : "var(--gradient-primary)",
                    }}
                  >
                    <FaUpload />
                    {uploadingPhoto ? "Uploading..." : "Upload Photo"}
                  </button>
                  <button
                    onClick={() => setPhotoPreview(null)}
                    disabled={uploadingPhoto}
                    className="px-4 py-2 rounded-lg font-semibold border transition-all"
                    style={{
                      borderColor: "var(--color-border-light)",
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Password Change Section */}
        <div
          className="rounded-xl shadow-lg p-6 mb-5 border"
          style={{
            backgroundColor: "var(--color-bg-elevated)",
            borderColor: "var(--color-border-light)",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <FaLock style={{ color: "var(--color-primary)" }} />
            <h2
              className="text-lg font-semibold"
              style={{ color: "var(--color-text-primary)" }}
            >
              Change Password
            </h2>
          </div>

          <div className="space-y-4">
            {/* Current Password */}
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-4 py-2.5 pr-12 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: "var(--color-bg-secondary)",
                    borderColor: "var(--color-border-light)",
                    color: "var(--color-text-primary)",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--color-primary)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "var(--color-border-light)")
                  }
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowCurrentPassword(!showCurrentPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                  style={{ color: "var(--color-text-tertiary)" }}
                >
                  {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--color-text-secondary)" }}
              >
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-4 py-2.5 pr-12 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: "var(--color-bg-secondary)",
                    borderColor: "var(--color-border-light)",
                    color: "var(--color-text-primary)",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--color-primary)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "var(--color-border-light)")
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                  style={{ color: "var(--color-text-tertiary)" }}
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-2.5 pr-12 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: "var(--color-bg-secondary)",
                    borderColor: "var(--color-border-light)",
                    color: "var(--color-text-primary)",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--color-primary)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "var(--color-border-light)")
                  }
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                  style={{ color: "var(--color-text-tertiary)" }}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              onClick={handlePasswordUpdate}
              className="w-full py-2.5 rounded-lg font-medium transition-all hover:shadow-lg flex items-center justify-center gap-2"
              style={{
                background: "var(--gradient-primary)",
                color: "var(--color-text-inverse)",
              }}
            >
              <FaCheck /> Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
