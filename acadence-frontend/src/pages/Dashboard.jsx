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
import { FaStar, FaClock, FaBookOpen } from "react-icons/fa";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [stats] = useState({
    points: 87,
    hours: "125h",
    completed: 42,
  });
  const [progress] = useState(74);
  const [recs, setRecs] = useState([]);

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
    <div className="p-8 pt-24 relative">
      {/* Welcome Section */}
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold mb-3 bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
          Welcome Back, {user?.name || "Student"}👋
        </h1>
        <p className="text-gray-300 text-lg">
          Track your progress, explore recommendations, and continue learning 🚀
        </p>
      </header>

      {/* Stats Section */}
      <section className="grid grid-cols-12 gap-6 mb-10">
        <div className="col-span-8 grid grid-cols-3 gap-6">
          <StatCard title="Learning Points" value={stats.points} icon={<FaStar className="text-yellow-400 text-3xl" />} />
          <StatCard title="Hours Spent" value={stats.hours} icon={<FaClock className="text-blue-300 text-3xl" />} />
          <StatCard title="Completed Lessons" value={stats.completed} icon={<FaBookOpen className="text-green-300 text-3xl" />} />
        </div>

        <div className="col-span-4 bg-gradient-to-br from-indigo-700 to-blue-900 rounded-2xl shadow-xl p-6">
          <h3 className="text-white font-semibold mb-4">Your Skill Progress</h3>
          <div className="flex items-center gap-6">
            <div style={{ width: 120, height: 120 }}>
              <CircularProgressbar
                value={progress}
                text={`${progress}%`}
                styles={buildStyles({
                  textColor: "#fff",
                  pathColor: "#38bdf8",
                  trailColor: "rgba(255,255,255,0.1)",
                })}
              />
            </div>
            <div>
              <div className="text-indigo-200 text-sm">Main Skillset</div>
              <div className="text-lg font-bold text-white">Frontend Mastery</div>
              <div className="text-xs text-indigo-300 mt-1">
                Graph components, state, hooks, performance
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Panels */}
      <section className="grid grid-cols-3 gap-8">
        {/* Learning Activity */}
        <div className="col-span-2 bg-gradient-to-br from-slate-800 to-indigo-900 rounded-2xl shadow-xl p-6">
          <h3 className="text-white text-2xl font-semibold mb-6">📊 Learning Activity</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#cbd5e1" />
              <YAxis stroke="#cbd5e1" />
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "none", color: "#fff" }} />
              <Line type="monotone" dataKey="lessons" stroke="#38bdf8" strokeWidth={3} dot={{ r: 5, fill: "#38bdf8" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recommendations */}
        <div className="bg-gradient-to-br from-indigo-800 to-blue-900 rounded-2xl shadow-xl p-6">
          <h3 className="text-white text-2xl font-semibold mb-6">⭐ Recommended for You</h3>
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
    <div className="rounded-2xl p-6 shadow-lg bg-gradient-to-br from-indigo-600 to-blue-800 text-white hover:scale-[1.02] transition-transform duration-300 flex flex-col items-center justify-center gap-3">
      <div className="p-4 bg-white/10 rounded-full">{icon}</div>
      <div className="text-4xl font-extrabold">{value}</div>
      <div className="text-indigo-200 text-sm">{title}</div>
    </div>
  );
}
