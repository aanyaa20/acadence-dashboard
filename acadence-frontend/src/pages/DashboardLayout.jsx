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
  HiLogout,
} from "react-icons/hi";

export default function DashboardLayout() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const menu = [
    { to: "/dashboard", label: "Dashboard", icon: <HiOutlineHome /> },
    { to: "/dashboard/courses", label: "My Courses", icon: <HiBookOpen /> },
    { to: "/dashboard/allcourses", label: "All Courses", icon: <HiBookOpen /> },
    { to: "/dashboard/settings", label: "Settings", icon: <HiCog /> },
  ];

  function signOut() {
    localStorage.removeItem("token");
    toast.success("✅ Logged out successfully");
    navigate("/login");
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
      {/* Hamburger Toggle - Always Visible */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-20 left-4 z-50 p-3 rounded-lg shadow-lg transition-all hover:scale-110"
        style={{
          backgroundColor: 'var(--color-bg-elevated)',
          color: 'var(--color-text-primary)',
          border: '1px solid var(--color-border-light)'
        }}
        aria-label="Toggle sidebar"
      >
        <HiMenuAlt2 className="text-2xl" />
      </button>

      {/* Sidebar */}
      <aside
        className={`flex flex-col transition-all duration-300 fixed z-40 h-screen top-0 left-0 ${
          open ? "w-64" : "w-0 lg:w-20"
        } border-r overflow-hidden`}
        style={{
          backgroundColor: 'var(--color-bg-primary)',
          borderColor: 'var(--color-border-light)',
          color: 'var(--color-text-primary)'
        }}
      >
        {/* header: logo + toggle */}
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--color-border-light)' }}>
          <div className="flex items-center gap-2">
            <div className="rounded-lg w-10 h-10 flex items-center justify-center font-bold text-lg shadow-custom-md" style={{
              background: 'var(--gradient-primary)',
              color: 'var(--color-text-inverse)'
            }}>
              A
            </div>
            {open && (
              <span className="font-bold text-lg" style={{ 
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Acadence
              </span>
            )}
          </div>

          <button
            onClick={() => setOpen((s) => !s)}
            className="p-2 rounded-md transition-all"
            style={{ backgroundColor: 'var(--color-bg-tertiary)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-light)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-tertiary)'}
            aria-label="toggle sidebar"
          >
            <HiMenuAlt2 className="text-lg" style={{ color: 'var(--color-text-secondary)' }} />
          </button>
        </div>

        {/* nav */}
        <nav className="mt-4 flex-1 flex flex-col gap-1 p-2">
          {menu.map((m) => (
            <NavLink
              key={m.to}
              to={m.to}
              end={m.to === "/dashboard"}
              onClick={() => {
                // Close sidebar on mobile when menu item is clicked
                if (window.innerWidth < 1024) {
                  setOpen(false);
                }
              }}
            >
              {({ isActive }) => (
                <div
                  className="flex items-center gap-3 p-3 rounded-lg transition-all"
                  style={{
                    backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
                    color: isActive ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)',
                    boxShadow: isActive ? 'var(--shadow-sm)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'var(--color-bg-tertiary)';
                      e.currentTarget.style.color = 'var(--color-text-primary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--color-text-secondary)';
                    }
                  }}
                >
                  <div className="text-xl">{m.icon}</div>
                  {open && <span className="font-medium">{m.label}</span>}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* bottom actions */}
        <div className="p-4 border-t" style={{ borderColor: 'var(--color-border-light)' }}>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all font-medium"
            style={{ color: 'var(--color-error)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-error-light)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <HiLogout className="text-xl" />
            {open && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={`flex-1 transition-all duration-300 ${open ? 'ml-64' : 'ml-0 lg:ml-20'}`} style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
        <div className="p-8 pt-24">
          <Outlet />
        </div>
      </main>

      {/* Overlay for mobile when sidebar is open */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
}
