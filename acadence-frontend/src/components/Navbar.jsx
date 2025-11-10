// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp, FaMoon, FaSun } from "react-icons/fa";
import logo from "../assets/logo.png";
import toast from "react-hot-toast";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // Apply theme on mount and when it changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

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
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-custom-sm" style={{
                background: 'var(--gradient-primary)',
                color: 'var(--color-text-inverse)'
              }}>
                A
              </div>
              <div className="flex flex-col items-start text-left">
                <span className="font-medium text-sm" style={{ color: 'var(--color-text-primary)' }}>Aanya</span>
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
