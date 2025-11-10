import React, { useEffect, useState, useContext } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import axios from "axios";
import API_BASE_URL from "../config";
import Recommendations from "../components/Recommendations";
import ChatbotFloating from "../components/ChatbotFloating";
import { AuthContext } from "../context/AuthContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ✅ Import Icons
import { FaStar, FaClock, FaBookOpen, FaSyncAlt } from "react-icons/fa";

export default function Dashboard() {
  const { user, refreshUser } = useContext(AuthContext);
  const [stats, setStats] = useState({
    points: 0,
    completed: 0,
  });
  const [progress, setProgress] = useState(0);
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch stats
  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = user?.id || user?._id;
      
      console.log("🔍 Dashboard - Fetching user stats...");
      console.log("User object:", user);
      console.log("User ID:", userId);
      console.log("Token exists:", !!token);
      
      if (userId && token) {
        // Fetch user data for points
        console.log("📡 Fetching user data from:", `${API_BASE_URL}/api/users/${userId}`);
        const userResponse = await axios.get(
          `${API_BASE_URL}/api/users/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        console.log("✅ User data received:", userResponse.data);
        console.log("Total Points:", userResponse.data.totalPoints);

        // Fetch user's courses
        console.log("📡 Fetching courses...");
        const coursesResponse = await axios.get(
          `${API_BASE_URL}/api/courses/user`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        console.log("✅ Courses received:", coursesResponse.data);

        // Calculate total completed lessons and total lessons
        let totalCompleted = 0;
        let totalLessons = 0;
        
        for (const course of coursesResponse.data) {
          totalCompleted += course.completedLessons || 0;
          totalLessons += course.totalLessons || 0;
        }

        console.log("📊 Calculated stats:");
        console.log("- Total completed lessons:", totalCompleted);
        console.log("- Total lessons:", totalLessons);

        // Calculate progress percentage
        const progressPercentage = totalLessons > 0 
          ? Math.round((totalCompleted / totalLessons) * 100) 
          : 0;
        
        const newStats = {
          points: userResponse.data.totalPoints || 0,
          completed: totalCompleted,
        };
        
        console.log("✅ Setting stats:", newStats);
        setStats(newStats);

        console.log("✅ Setting progress:", progressPercentage);
        setProgress(progressPercentage);
      } else {
        console.warn("⚠️ Missing userId or token");
      }
    } catch (error) {
      console.error("❌ Error fetching user stats:", error);
      console.error("Error response:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user stats on mount and when user changes
  useEffect(() => {
    if (user) {
      fetchUserStats();
    } else {
      console.warn("⚠️ No user object available");
      setLoading(false);
    }
  }, [user]);

  // Refresh stats every time the dashboard becomes visible
  useEffect(() => {
    const handleFocus = () => {
      console.log("� Window focused - refreshing stats...");
      if (user) {
        fetchUserStats();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user]);

  // Also refresh when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        console.log("🔄 Tab visible - refreshing stats...");
        fetchUserStats();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [user]);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/recommendations`)
      .then((r) => setRecs(r.data || sampleRecs()))
      .catch(() => setRecs(sampleRecs()));
  }, []);

  function sampleRecs() {
    return [
      { id: "c1", title: "Advanced React Patterns", reason: "Matches your recent topics", score: 0.92 },
      { id: "c2", title: "GraphQL: From Zero to Production", reason: "Popular with users like you", score: 0.86 },
      { id: "c3", title: "Production-ready Node.js APIs", reason: "Complements current course", score: 0.81 },
    ];
  }

  const activityData = [
    { day: "Mon", lessons: 5 },
    { day: "Tue", lessons: 8 },
    { day: "Wed", lessons: 4 },
    { day: "Thu", lessons: 7 },
    { day: "Fri", lessons: 9 },
    { day: "Sat", lessons: 6 },
    { day: "Sun", lessons: 10 },
  ];

  return (
    <div className="p-8 pt-24 relative bg-secondary min-h-screen">
      {/* Welcome Section */}
      <header className="mb-10 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-extrabold mb-3" style={{
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Welcome Back, {user?.name || "Student"}
          </h1>
          <p className="text-secondary text-lg">
            Track your progress, explore recommendations, and continue learning
          </p>
        </div>
        <button
          onClick={() => {
            setLoading(true);
            fetchUserStats();
          }}
          className="flex items-center gap-2 px-4 py-2 text-inverse rounded-lg transition-all shadow-custom-sm hover:shadow-custom-md"
          style={{ backgroundColor: 'var(--color-primary)' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}
          title="Refresh stats"
        >
          <FaSyncAlt className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </header>

      {/* Stats Section */}
      <section className="grid grid-cols-12 gap-6 mb-10">
        <div className="col-span-8 grid grid-cols-2 gap-6">
          <StatCard 
            title="Learning Points" 
            value={loading ? "..." : stats.points} 
            icon={<FaStar className="text-3xl" style={{ color: 'var(--color-warning)' }} />} 
          />
          <StatCard 
            title="Completed Lessons" 
            value={loading ? "..." : stats.completed} 
            icon={<FaBookOpen className="text-3xl" style={{ color: 'var(--color-success)' }} />} 
          />
        </div>

        <div className="col-span-4 rounded-2xl shadow-custom-xl p-6 bg-elevated border border-light" style={{
          background: 'var(--gradient-soft)'
        }}>
          <h3 className="text-primary font-semibold mb-4">Your Skill Progress</h3>
          <div className="flex items-center gap-6">
            <div style={{ width: 120, height: 120 }}>
              <CircularProgressbar
                value={progress}
                text={`${progress}%`}
                styles={buildStyles({
                  textColor: "var(--color-primary)",
                  pathColor: "var(--color-primary)",
                  trailColor: "var(--color-border-light)",
                })}
              />
            </div>
            <div>
              <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Main Skillset</div>
              <div className="text-lg font-bold text-primary">Frontend Mastery</div>
              <div className="text-xs mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
                Graph components, state, hooks, performance
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Panels */}
      <section className="grid grid-cols-3 gap-8">
        {/* Learning Activity */}
        <div className="col-span-2 rounded-2xl shadow-custom-xl p-6 bg-elevated border border-light">
          <h3 className="text-primary text-2xl font-semibold mb-6">📊 Learning Activity</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-light)" />
              <XAxis dataKey="day" stroke="var(--color-text-secondary)" />
              <YAxis stroke="var(--color-text-secondary)" />
              <Tooltip contentStyle={{ 
                backgroundColor: 'var(--color-bg-elevated)', 
                border: '1px solid var(--color-border-light)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text-primary)'
              }} />
              <Line type="monotone" dataKey="lessons" stroke="var(--color-primary)" strokeWidth={3} dot={{ r: 5, fill: 'var(--color-primary)' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recommendations */}
        <div className="rounded-2xl shadow-custom-xl p-6 bg-elevated border border-light">
          <h3 className="text-primary text-2xl font-semibold mb-6 flex items-center gap-2">
            <FaStar /> Recommended for You
          </h3>
          <Recommendations items={recs} />
        </div>
      </section>

      {/* Floating Chatbot */}
      <ChatbotFloating />
    </div>
  );
}

/* ✅ StatCard with Icon */
function StatCard({ title, value, icon }) {
  return (
    <div className="rounded-2xl p-6 shadow-custom-lg bg-elevated border border-light hover:shadow-custom-xl transition-all duration-300 flex flex-col items-center justify-center gap-3 hover:-translate-y-1">
      <div className="p-4 rounded-full" style={{ backgroundColor: 'var(--color-bg-tertiary)' }}>{icon}</div>
      <div className="text-4xl font-extrabold text-primary">{value}</div>
      <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{title}</div>
    </div>
  );
}
