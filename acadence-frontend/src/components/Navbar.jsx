// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { FaChevronDown, FaChevronUp, FaMoon, FaSun, FaFire, FaInfoCircle, FaEnvelope } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import API_BASE_URL from "../config";
import logo from "../assets/logo.png";
import toast from "react-hot-toast";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });
  const [streak, setStreak] = useState(0);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // Apply theme on mount and when it changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Fetch user streak - use user context to stay in sync
  useEffect(() => {
    if (user) {
      // Get streak directly from user context
      setStreak(user.currentStreak || 0);
    }
  }, [user, user?.currentStreak]); // Re-run when user or currentStreak changes

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  function handleLogout() {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  }

  return (
    <nav className="px-6 py-4 flex justify-between items-center shadow-custom-md fixed top-0 left-0 w-full z-50 border-b" style={{
      backgroundColor: 'var(--color-bg-primary)',
      borderColor: 'var(--color-border-light)'
    }}>
      {/* Left: Logo + Brand */}
      <div className="flex items-center gap-3 text-2xl font-bold">
        <img src={logo} alt="Acadence Logo" className="w-10 h-10 rounded-full shadow-custom-sm" />
        <Link to="/" className="transition-colors" style={{
          background: 'var(--gradient-primary)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Acadence
        </Link>
      </div>

      {/* Right Side */}
      <div className="flex items-center space-x-6">
        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-4">
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-2 text-sm font-medium transition-colors px-3 py-2 rounded-lg hover:bg-opacity-10 cursor-pointer"
            style={{ color: 'var(--color-text-secondary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--color-primary)';
              e.currentTarget.style.backgroundColor = 'rgba(147, 51, 234, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--color-text-secondary)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <FaInfoCircle />
            About
          </a>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-2 text-sm font-medium transition-colors px-3 py-2 rounded-lg hover:bg-opacity-10 cursor-pointer"
            style={{ color: 'var(--color-text-secondary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--color-primary)';
              e.currentTarget.style.backgroundColor = 'rgba(147, 51, 234, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--color-text-secondary)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <FaEnvelope />
            Contact
          </a>
        </div>
        {/* Streak Indicator - Only show when logged in */}
        {token && (
          <div 
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg shadow-sm transition-all cursor-default"
            style={{
              background: 'linear-gradient(135deg, #FB923C 0%, #F97316 100%)',
            }}
            title={`${streak} day learning streak! Keep it going!`}
          >
            <FaFire className="text-white text-base" />
            <span className="text-white font-semibold text-sm">{streak}</span>
          </div>
        )}

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg transition-all"
          style={{
            backgroundColor: 'var(--color-bg-tertiary)',
            color: 'var(--color-text-secondary)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-primary-light)';
            e.currentTarget.style.color = 'var(--color-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-bg-tertiary)';
            e.currentTarget.style.color = 'var(--color-text-secondary)';
          }}
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === "dark" ? <FaSun className="text-lg" /> : <FaMoon className="text-lg" />}
        </button>
       
        {token ? (
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg transition border"
              style={{
                backgroundColor: 'var(--color-bg-tertiary)',
                borderColor: 'var(--color-border-light)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-light)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-tertiary)'}
            >
              <img
                src={
                  user?.profilePhoto ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user?.name || "User"
                  )}&background=9333EA&color=fff&bold=true&size=64`
                }
                alt="Profile"
                className="w-8 h-8 rounded-full shadow-custom-sm object-cover border-2"
                style={{ borderColor: 'var(--color-primary)' }}
              />
              <div className="flex flex-col items-start text-left">
                <span className="font-medium text-sm" style={{ color: 'var(--color-text-primary)' }}>{user?.name || "User"}</span>
                <span className="text-xs flex items-center gap-1" style={{ color: 'var(--color-success)' }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--color-success)' }}></span>
                  Online
                </span>
              </div>
              {open ? <FaChevronUp style={{ color: 'var(--color-text-tertiary)' }} /> : <FaChevronDown style={{ color: 'var(--color-text-tertiary)' }} />}
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-40 rounded-lg shadow-custom-lg overflow-hidden z-50 border" style={{
                backgroundColor: 'var(--color-bg-elevated)',
                borderColor: 'var(--color-border-light)'
              }}>
                <Link
                  to="/dashboard/settings"
                  className="block px-4 py-2 transition-colors"
                  style={{ color: 'var(--color-text-primary)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-tertiary)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 transition-colors"
                  style={{ color: 'var(--color-error)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-error-light)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg transition shadow-custom-sm font-medium"
              style={{ 
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-text-inverse)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 rounded-lg transition shadow-custom-sm font-medium"
              style={{ 
                backgroundColor: 'var(--color-secondary)',
                color: 'var(--color-text-inverse)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-secondary-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-secondary)'}
            >
              Signup
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
