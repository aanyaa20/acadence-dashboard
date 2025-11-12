import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaKey, FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import API_BASE_URL from "../config";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Enter Email, 2: Enter Code & New Password
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendCode = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/api/users/forgot-password`, {
        email,
      });

      toast.success("Reset code sent to your email!");
      setStep(2);
    } catch (error) {
      console.error("Error sending reset code:", error);
      toast.error(error.response?.data?.message || "Failed to send reset code");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!resetCode || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${API_BASE_URL}/api/users/reset-password`, {
        email,
        resetCode,
        newPassword,
      });

      toast.success("Password reset successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{ backgroundColor: "var(--color-bg-secondary)" }}
    >
      <div
        className="w-full max-w-md rounded-2xl shadow-2xl p-8 border"
        style={{
          backgroundColor: "var(--color-bg-elevated)",
          borderColor: "var(--color-border-light)",
        }}
      >
        {/* Back to Login Link */}
        <Link
          to="/login"
          className="flex items-center gap-2 mb-6 text-sm transition-colors"
          style={{ color: "var(--color-text-secondary)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--color-primary)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--color-text-secondary)")
          }
        >
          <FaArrowLeft />
          Back to Login
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="text-3xl font-bold mb-2"
            style={{
              background: "var(--gradient-primary)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Forgot Password
          </h1>
          <p
            className="text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {step === 1
              ? "Enter your email to receive a reset code"
              : "Enter the reset code and your new password"}
          </p>
        </div>

        {/* Step 1: Enter Email */}
        {step === 1 && (
          <form onSubmit={handleSendCode} className="space-y-6">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--color-text-tertiary)" }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
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
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-white transition-all shadow-lg"
              style={{
                background: loading
                  ? "var(--color-border-light)"
                  : "var(--gradient-primary)",
              }}
            >
              {loading ? "Sending..." : "Send Reset Code"}
            </button>
          </form>
        )}

        {/* Step 2: Enter Code & New Password */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-6">
            {/* Reset Code */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Reset Code
              </label>
              <div className="relative">
                <FaKey
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--color-text-tertiary)" }}
                />
                <input
                  type="text"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
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
                  required
                />
              </div>
              <p
                className="text-xs mt-2"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                Check your email for the 6-digit reset code
              </p>
            </div>

            {/* New Password */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--color-text-secondary)" }}
              >
                New Password
              </label>
              <div className="relative">
                <FaLock
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--color-text-tertiary)" }}
                />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
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
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Confirm Password
              </label>
              <div className="relative">
                <FaLock
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--color-text-tertiary)" }}
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
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
                  required
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-3 rounded-lg font-semibold border transition-all"
                style={{
                  borderColor: "var(--color-border-light)",
                  color: "var(--color-text-secondary)",
                }}
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-lg font-semibold text-white transition-all shadow-lg"
                style={{
                  background: loading
                    ? "var(--color-border-light)"
                    : "var(--gradient-primary)",
                }}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
