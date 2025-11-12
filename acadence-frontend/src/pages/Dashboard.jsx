import React, { useEffect, useState, useContext } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import axios from "axios";
import API_BASE_URL from "../config";
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
import { FaStar, FaClock, FaBookOpen, FaCheckCircle, FaTrophy, FaFire, FaSyncAlt } from "react-icons/fa";

export default function Dashboard() {
  const { user, refreshUser } = useContext(AuthContext);
  const [stats, setStats] = useState({
    points: 0,
    completed: 0,
  });
  const [progress, setProgress] = useState(0);
  const [recentCourses, setRecentCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [streakData, setStreakData] = useState({
    current: 0,
    longest: 0,
    activityLog: []
  });
  const [recs, setRecs] = useState([]);
  const [recsLoading, setRecsLoading] = useState(false);

  // Function to fetch AI-powered recommendations
  const fetchRecommendations = async () => {
    try {
      setRecsLoading(true);
      const userId = user?.id || user?._id;
      
      console.log("🎯 Fetching AI recommendations for user:", userId);
      
      if (userId) {
        const response = await axios.get(
          `${API_BASE_URL}/api/recommendations/${userId}`
        );
        
        console.log("✅ AI Recommendations received:", response.data);
        setRecs(response.data);
      }
    } catch (error) {
      console.error("❌ Error fetching recommendations:", error);
      // Set empty array on error
      setRecs([]);
    } finally {
      setRecsLoading(false);
    }
  };

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
        
        // Set streak data from user response
        setStreakData({
          current: userResponse.data.currentStreak || 0,
          longest: userResponse.data.longestStreak || 0,
          activityLog: userResponse.data.activityLog || []
        });
        
        // Set recent courses for display
        setRecentCourses(coursesResponse.data);

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
      
      // Also refresh user context data to get latest streak info
      if (refreshUser) {
        refreshUser();
      }
    } else {
      console.warn("⚠️ No user object available");
      setLoading(false);
    }
  }, [user?.id, user?.totalPoints]); // Watch for ID and totalPoints changes

  // Add visibility change listener to refresh when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        console.log("📱 Tab became visible, refreshing stats and user data...");
        fetchUserStats();
        if (refreshUser) {
          refreshUser();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user, refreshUser]);

  // Periodic refresh to catch streak updates (every 30 seconds when page is active)
  useEffect(() => {
    if (!user) return;
    
    const intervalId = setInterval(() => {
      if (!document.hidden) {
        console.log("🔄 Periodic refresh - updating stats and streaks...");
        fetchUserStats();
        if (refreshUser) {
          refreshUser();
        }
      }
    }, 30000); // 30 seconds
    
    return () => clearInterval(intervalId);
  }, [user, refreshUser]);

  // Calculate current learning streak
  const calculateStreak = () => {
    return streakData.current || 0;
  };

  // Calculate longest streak
  const calculateLongestStreak = () => {
    return streakData.longest || 0;
  };

  // Get motivational message based on streak
  const getStreakMessage = (streak) => {
    if (streak === 0) return "Start your learning journey today!";
    if (streak < 3) return "Great start! Keep it up!";
    if (streak < 7) return "You're on fire! 🔥";
    if (streak < 14) return "Amazing consistency!";
    if (streak < 30) return "Unstoppable! Keep going!";
    return "Legendary streak! 🏆";
  };

  // Render calendar heatmap for last 30 days
  const renderCalendarHeatmap = () => {
    const days = [];
    const today = new Date();
    
    // Create a map of activity by date
    const activityMap = {};
    if (streakData.activityLog) {
      streakData.activityLog.forEach(log => {
        const date = new Date(log.date);
        date.setHours(0, 0, 0, 0);
        const dateKey = date.getTime();
        activityMap[dateKey] = log.lessonsCompleted || 0;
      });
    }
    
    // Generate calendar for last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dateKey = date.getTime();
      const lessonsCompleted = activityMap[dateKey] || 0;
      
      // Determine activity level (0-3)
      let activity = 0;
      if (lessonsCompleted >= 5) activity = 3; // High activity
      else if (lessonsCompleted >= 3) activity = 2; // Medium activity
      else if (lessonsCompleted >= 1) activity = 1; // Low activity
      else activity = 0; // No activity
      
      // More subtle orange tones
      const intensity = activity === 0 ? 'var(--color-bg-tertiary)' :
                       activity === 1 ? 'rgba(251, 146, 60, 0.25)' :
                       activity === 2 ? 'rgba(249, 115, 22, 0.5)' :
                       '#F97316';
      
      const isToday = i === 0;
      const dayNumber = date.getDate();
      
      days.push(
        <div
          key={i}
          className={`relative flex items-center justify-center rounded transition-all hover:scale-110 hover:shadow-md ${isToday ? 'ring-1 ring-orange-400' : ''}`}
          style={{ 
            backgroundColor: intensity,
            width: '28px',
            height: '28px',
          }}
          title={`${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${lessonsCompleted} ${lessonsCompleted === 1 ? 'lesson' : 'lessons'}`}
        >
          <span className="text-xs font-medium" style={{ 
            color: activity > 0 ? 'white' : 'var(--color-text-tertiary)',
            fontSize: '10px'
          }}>
            {dayNumber}
          </span>
        </div>
      );
    }
    
    return days;
  };

  // Refresh stats every time the dashboard becomes visible
  useEffect(() => {
    const handleFocus = () => {
      console.log("👁 Window focused - refreshing stats...");
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

  return (
    <div className="p-6 pt-20 relative bg-secondary min-h-screen">
      {/* Welcome Section */}
      <header className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{
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
            if (refreshUser) {
              refreshUser();
            }
          }}
          className="flex items-center gap-2 px-4 py-2 text-inverse rounded-lg transition-all shadow-custom-sm hover:shadow-custom-md"
          style={{ backgroundColor: 'var(--color-primary)' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}
          title="Refresh stats and streaks"
        >
          <FaSyncAlt className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </header>

      {/* Stats Section */}
      <section className="grid grid-cols-2 gap-5 mb-8">
        <StatCard 
          title="Learning Points" 
          value={loading ? "..." : (user?.totalPoints || stats.points || 0)} 
          icon={<FaStar className="text-2xl" style={{ color: 'var(--color-warning)' }} />} 
        />
        <StatCard 
          title="Completed Lessons" 
          value={loading ? "..." : stats.completed} 
          icon={<FaBookOpen className="text-2xl" style={{ color: 'var(--color-success)' }} />} 
        />
      </section>

      {/* Panels */}
      <section className="grid grid-cols-3 gap-6">
        {/* Quick Progress Overview */}
        <div className="col-span-2 rounded-2xl shadow-custom-xl p-6 bg-elevated border border-light">
          <h3 className="text-primary text-xl font-semibold mb-6 flex items-center gap-2">
            <FaTrophy className="text-yellow-500" /> Your Learning Journey
          </h3>
          
          <div className="grid grid-cols-3 gap-5">
            {/* Total Courses Card */}
            <div className="p-5 rounded-xl border-2 transition-all hover:scale-105" style={{
              background: 'linear-gradient(135deg, #6d28d9 0%, #4c1d95 100%)',
              borderColor: 'rgba(109, 40, 217, 0.3)'
            }}>
              <div className="flex items-center justify-between mb-3">
                <FaBookOpen className="text-3xl text-white opacity-80" />
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">
                    {recentCourses.length}
                  </div>
                  <div className="text-xs text-white opacity-75 mt-1">
                    Enrolled Courses
                  </div>
                </div>
              </div>
              <div className="text-xs text-white opacity-70">
                Keep learning to unlock more!
              </div>
            </div>

            {/* Completed Lessons Card */}
            <div className="p-5 rounded-xl border-2 transition-all hover:scale-105" style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderColor: 'rgba(16, 185, 129, 0.3)'
            }}>
              <div className="flex items-center justify-between mb-3">
                <FaCheckCircle className="text-3xl text-white opacity-80" />
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">
                    {stats.completed}
                  </div>
                  <div className="text-xs text-white opacity-75 mt-1">
                    Lessons Completed
                  </div>
                </div>
              </div>
              <div className="text-xs text-white opacity-70">
                {stats.completed === 0 ? "Start your first lesson!" : "Amazing progress!"}
              </div>
            </div>

            {/* Learning Points Card */}
            <div className="p-5 rounded-xl border-2 transition-all hover:scale-105" style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              borderColor: 'rgba(245, 158, 11, 0.3)'
            }}>
              <div className="flex items-center justify-between mb-3">
                <FaStar className="text-3xl text-white opacity-80" />
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">
                    {user?.totalPoints || stats.points || 0}
                  </div>
                  <div className="text-xs text-white opacity-75 mt-1">
                    Total Points
                  </div>
                </div>
              </div>
              <div className="text-xs text-white opacity-70">
                Earn 5 pts per lesson, 20 per quiz!
              </div>
            </div>
          </div>

          {/* Progress Motivation */}
          <div className="mt-6 p-4 rounded-xl" style={{ backgroundColor: 'var(--color-bg-tertiary)' }}>
            <div className="flex items-center gap-3">
              <div className="text-3xl">
                {progress === 0 ? "🚀" : progress < 30 ? "🌱" : progress < 60 ? "🌿" : progress < 90 ? "🌳" : "🏆"}
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
                  {progress === 0 ? "Ready to start your learning journey?" : 
                   progress < 30 ? "Great start! Keep the momentum going!" :
                   progress < 60 ? "You're making excellent progress!" :
                   progress < 90 ? "Almost there! You're doing amazing!" :
                   "Congratulations! You're crushing it!"}
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-500" 
                    style={{ 
                      width: `${progress}%`,
                      background: 'linear-gradient(90deg, #6d28d9 0%, #10b981 100%)'
                    }}
                  ></div>
                </div>
                <div className="text-xs mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
                  {progress}% Overall Progress
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Streak Tracker */}
        <div className="rounded-2xl shadow-custom-xl p-6 bg-elevated border border-light">
          <h3 className="text-primary text-xl font-semibold flex items-center gap-2 mb-5">
            <FaFire className="text-orange-500" /> Learning Streak
          </h3>
          
          {/* Current Streak Display */}
          <div className="text-center mb-5 p-5 rounded-xl" style={{ background: 'linear-gradient(135deg, #FB923C 0%, #F97316 50%, #EA580C 100%)' }}>
            <div className="text-4xl mb-2">🔥</div>
            <div className="text-4xl font-bold text-white mb-1">
              {calculateStreak()}
            </div>
            <div className="text-white text-xs font-medium opacity-90">Day Streak</div>
            <div className="text-white text-xs mt-2 opacity-80">
              {getStreakMessage(calculateStreak())}
            </div>
          </div>

          {/* Streak Stats */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="p-3 rounded-lg text-center" style={{ backgroundColor: 'var(--color-bg-tertiary)' }}>
              <div className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
                {stats.completed}
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                Total Lessons
              </div>
            </div>
            <div className="p-3 rounded-lg text-center" style={{ backgroundColor: 'var(--color-bg-tertiary)' }}>
              <div className="text-xl font-bold" style={{ color: '#F97316' }}>
                {calculateLongestStreak()}
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                Best Streak
              </div>
            </div>
          </div>

          {/* Calendar Heatmap - Last 30 Days */}
          <div>
            <h4 className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--color-text-secondary)' }}>
              Activity Calendar
            </h4>
            <div className="grid grid-cols-7 gap-1.5 mb-2">
              {renderCalendarHeatmap()}
            </div>
            <div className="flex items-center justify-center gap-2 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              <span className="opacity-75">Less</span>
              <div className="flex gap-1">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: 'var(--color-bg-tertiary)' }}></div>
                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: 'rgba(251, 146, 60, 0.25)' }}></div>
                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: 'rgba(249, 115, 22, 0.5)' }}></div>
                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#F97316' }}></div>
              </div>
              <span className="opacity-75">More</span>
            </div>
          </div>
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
    <div className="rounded-xl p-5 shadow-custom-lg bg-elevated border border-light hover:shadow-custom-xl transition-all duration-300 flex flex-col items-center justify-center gap-2 hover:-translate-y-0.5">
      <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--color-bg-tertiary)' }}>{icon}</div>
      <div className="text-3xl font-bold text-primary">{value}</div>
      <div className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>{title}</div>
    </div>
  );
}
