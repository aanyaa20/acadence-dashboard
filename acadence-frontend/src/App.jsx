// src/App.jsx
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DashboardLayout from "./pages/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import AllCourses from "./pages/AllCourses";
import Progress from "./pages/Progress";
import Payments from "./pages/Payments";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute"; // ✅ import

export default function App() {
  return (
    <>
      {/* ✅ Navbar is always visible */}
      <Navbar />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ✅ Protected Dashboard routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="courses" element={<Courses />} />
          <Route path="allcourses" element={<AllCourses />} />
          <Route path="progress" element={<Progress />} />
          <Route path="payments" element={<Payments />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>

      {/* ✅ Toast container */}
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </>
  );
}
