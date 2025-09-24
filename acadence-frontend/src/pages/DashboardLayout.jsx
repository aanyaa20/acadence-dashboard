// src/pages/DashboardLayout.jsx
import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  HiMenuAlt2,
  HiOutlineHome,
  HiBookOpen,
  HiChartBar,
  HiCog,
  HiCreditCard,
  HiLogout,
} from "react-icons/hi";

export default function DashboardLayout() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const menu = [
    { to: "/dashboard", label: "Dashboard", icon: <HiOutlineHome /> },
    { to: "/dashboard/courses", label: "My Courses", icon: <HiBookOpen /> },
    { to: "/dashboard/allcourses", label: "All Courses", icon: <HiBookOpen /> },
    { to: "/dashboard/progress", label: "Progress", icon: <HiChartBar /> },
    { to: "/dashboard/settings", label: "Settings", icon: <HiCog /> },
    { to: "/dashboard/payments", label: "Payments", icon: <HiCreditCard /> },
  ];

  function signOut() {
    localStorage.removeItem("token");
    toast.success("✅ Logged out successfully");
    navigate("/login");
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-blue-900 text-white">
      {/* Sidebar */}
      <aside
        className={`flex flex-col transition-all duration-300 ${
          open ? "w-64" : "w-20"
        } bg-gradient-to-b from-indigo-800 to-blue-900 shadow-xl`}
      >
        {/* header: logo + toggle */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="rounded-md w-10 h-10 bg-indigo-700 flex items-center justify-center font-bold text-lg">
              A
            </div>
            {open}
          </div>

          <button
            onClick={() => setOpen((s) => !s)}
            className="p-2 rounded-md bg-white/10 hover:bg-white/20"
            aria-label="toggle sidebar"
          >
            <HiMenuAlt2 className="text-lg" />
          </button>
        </div>

        {/* nav */}
        <nav className="mt-4 flex-1 flex flex-col gap-1 p-2">
          {menu.map((m) => (
            <NavLink
              key={m.to}
              to={m.to}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-white/5 ${
                  isActive ? "bg-white/10 ring-1 ring-white/10" : ""
                }`
              }
              end={m.to === "/dashboard"}
            >
              <div className="text-xl">{m.icon}</div>
              {open && <span>{m.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* bottom actions */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 text-left"
          >
            <HiLogout className="text-xl" />
            {open && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
