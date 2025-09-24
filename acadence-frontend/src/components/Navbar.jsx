// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import logo from "../assets/logo.png";
import toast from "react-hot-toast";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  function handleLogout() {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  }

  return (
    <nav className="bg-indigo-900 text-white px-6 py-4 flex justify-between items-center shadow-md relative">
      {/* Left: Logo + Brand */}
      <div className="flex items-center gap-3 text-2xl font-bold">
        <img src={logo} alt="Acadence Logo" className="w-10 h-10 rounded-full" />
        <Link to="/" className="hover:text-indigo-300">
          Acadence
        </Link>
      </div>

      {/* Right Side */}
      <div className="flex items-center space-x-6">
        <Link to="/dashboard" className="hover:text-indigo-300">
          Dashboard
        </Link>
        <Link to="/dashboard/courses" className="hover:text-indigo-300">
          My Courses
        </Link>
        <Link to="/dashboard/allcourses" className="hover:text-indigo-300">
          All Courses
        </Link>

        {/* ✅ If user is logged in, show profile menu */}
        {token ? (
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center space-x-2 bg-indigo-800 px-3 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">
                A
              </div>
              <div className="flex flex-col items-start text-left">
                <span className="font-medium text-sm">Aanya</span>
                <span className="text-green-400 text-xs">● Online</span>
              </div>
              {open ? <FaChevronUp /> : <FaChevronDown />}
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-40 bg-indigo-800 text-white rounded-lg shadow-lg overflow-hidden z-50">
                <Link
                  to="/dashboard/settings"
                  className="block px-4 py-2 hover:bg-indigo-700"
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500 hover:text-white"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          // ✅ If logged out, show Login/Signup buttons
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 bg-indigo-700 rounded-lg hover:bg-indigo-600 transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-500 transition"
            >
              Signup
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
