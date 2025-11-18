import React, { useEffect, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import axios from "axios";
import API_BASE_URL from "../config";
import ChatbotFloating from "../components/ChatbotFloating";
import { AuthContext } from "../context/AuthContext";
import CalendarCurrent from "../components/CalendarCurrent";
import confetti from "canvas-confetti";
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
  const navigate = useNavigate();
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
  const previousStreakRef = useRef(0);
  const [animatedProgress, setAnimatedProgress] = useState(0);

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

  // Confetti celebration function
  const celebrateStreak = (streak) => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#F97316', '#FB923C', '#FDBA74', '#2563EB', '#3B82F6']
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#F97316', '#FB923C', '#FDBA74', '#2563EB', '#3B82F6']
      });
    }, 250);
  };

  // Check for streak milestones and trigger confetti
  useEffect(() => {
    const currentStreak = streakData.current || 0;
    const previousStreak = previousStreakRef.current;

    // Milestone thresholds
    const milestones = [3, 7, 14, 30, 50, 100];
    
    if (currentStreak > previousStreak) {
      // Check if we just hit a milestone
      const hitMilestone = milestones.some(
        milestone => currentStreak >= milestone && previousStreak < milestone
      );
      
      if (hitMilestone) {
        console.log(`🎉 Streak milestone reached: ${currentStreak} days!`);
        celebrateStreak(currentStreak);
      }
    }

    previousStreakRef.current = currentStreak;
  }, [streakData.current]);

  // Animate progress ring with easing
  useEffect(() => {
    if (progress === 0) {
      setAnimatedProgress(0);
      return;
    }

    const duration = 1500; // 1.5 seconds
    const steps = 60;
    const stepValue = progress / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const easeOutQuart = 1 - Math.pow(1 - currentStep / steps, 4);
      const newProgress = easeOutQuart * progress;
      
      setAnimatedProgress(newProgress);

      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedProgress(progress);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [progress]);

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
    if (streak < 7) return "You're on fire!";
    if (streak < 14) return "Amazing consistency!";
    if (streak < 30) return "Unstoppable! Keep going!";
    return "Legendary streak!";
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
    <div className="p-6 pt-16 relative bg-secondary min-h-screen">
      {/* Welcome Section */}
      <header className="mb-6 flex justify-between items-start">
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
        <div className="rounded-xl p-5 shadow-custom-lg bg-elevated border border-light hover:shadow-custom-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Lessons Learned</h3>
            <FaBookOpen className="text-xl" style={{ color: 'var(--color-success)' }} />
          </div>
          <div className="flex items-center gap-4">
            <div style={{ width: 80, height: 80 }}>
              <CircularProgressbar
                value={animatedProgress}
                text={`${Math.round(animatedProgress)}%`}
                styles={buildStyles({
                  textColor: 'var(--color-text-primary)',
                  pathColor: 'var(--color-success)',
                  trailColor: 'var(--color-bg-tertiary)',
                  textSize: '20px',
                  pathTransitionDuration: 0.5,
                  pathTransition: 'stroke-dashoffset 0.5s ease-in-out'
                })}
              />
            </div>
            <div>
              <div className="text-3xl font-bold" style={{ color: 'var(--color-success)' }}>
                {loading ? "..." : stats.completed}
              </div>
              <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Completed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Panels */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Quick Course Access + Learning Goals + Badges */}
        <div className="lg:col-span-1 space-y-6">
          {/* 1. Quick Course Access */}
          <div className="rounded-2xl shadow-custom-xl p-6 bg-elevated border border-light">
            <h3 className="text-primary text-xl font-semibold mb-4 flex items-center gap-2">
              <FaBookOpen className="text-blue-500" /> Continue Learning
            </h3>
            
            {recentCourses.length === 0 ? (
              <div className="text-center py-6">
                <FaBookOpen className="text-5xl mx-auto mb-3" style={{ color: 'var(--color-text-tertiary)' }} />
                <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                  No courses yet. Start your first course!
                </p>
                <button
                  onClick={() => navigate('/dashboard/allcourses')}
                  className="px-4 py-2 rounded-lg font-semibold text-sm transition-all"
                  style={{
                    background: 'var(--gradient-primary)',
                    color: 'var(--color-text-inverse)'
                  }}
                >
                  Browse Courses
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentCourses.slice(0, 2).map((course, idx) => (
                  <div 
                    key={course._id || idx}
                    className="p-4 rounded-xl border transition-all hover:scale-[1.02] hover:shadow-lg cursor-pointer"
                    style={{ 
                      backgroundColor: 'var(--color-bg-tertiary)',
                      borderColor: 'var(--color-border-light)'
                    }}
                    onClick={() => navigate(`/course/${course._id}`)}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center text-xl flex-shrink-0" 
                        style={{ background: 'linear-gradient(135deg, #1E40AF 0%, #1E3A8A 100%)' }}>
                        <FaBookOpen className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold mb-1 line-clamp-2" style={{ color: 'var(--color-text-primary)' }}>
                          {course.title}
                        </h4>
                        <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                          {course.completedLessons || 0} / {course.totalLessons || 0} lessons completed
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all" 
                        style={{ 
                          width: `${course.totalLessons > 0 ? ((course.completedLessons || 0) / course.totalLessons) * 100 : 0}%`,
                          background: 'linear-gradient(90deg, #2563EB 0%, #10b981 100%)'
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
                
                {recentCourses.length > 2 && (
                  <button
                    onClick={() => navigate('/dashboard/allcourses')}
                    className="w-full py-2 rounded-lg text-sm font-medium transition-all"
                    style={{
                      backgroundColor: 'var(--color-bg-tertiary)',
                      color: 'var(--color-primary)',
                      border: '1px solid var(--color-border-light)'
                    }}
                  >
                    View All Courses
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 2. Learning Goals Widget */}
          <div className="rounded-2xl shadow-custom-xl p-6 bg-elevated border border-light">
            <h3 className="text-primary text-xl font-semibold mb-4 flex items-center gap-2">
              <FaCheckCircle /> Weekly Goals
            </h3>
            
            <div className="space-y-4">
              {/* Goal 1: Complete Lessons */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                    Complete 5 lessons
                  </span>
                  <span className="text-xs font-bold" style={{ color: 'var(--color-primary)' }}>
                    {Math.min(stats.completed, 5)}/5
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all" 
                    style={{ 
                      width: `${Math.min((stats.completed / 5) * 100, 100)}%`,
                      background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
                    }}
                  ></div>
                </div>
              </div>

              {/* Goal 2: Earn Points */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                    Earn 100 points
                  </span>
                  <span className="text-xs font-bold" style={{ color: 'var(--color-warning)' }}>
                    {Math.min(user?.totalPoints || 0, 100)}/100
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all" 
                    style={{ 
                      width: `${Math.min(((user?.totalPoints || 0) / 100) * 100, 100)}%`,
                      background: 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)'
                    }}
                  ></div>
                </div>
              </div>

              {/* Goal 3: Maintain Streak */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                    7-day streak
                  </span>
                  <span className="text-xs font-bold" style={{ color: '#F97316' }}>
                    {Math.min(calculateStreak(), 7)}/7
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all" 
                    style={{ 
                      width: `${Math.min((calculateStreak() / 7) * 100, 100)}%`,
                      background: 'linear-gradient(90deg, #FB923C 0%, #F97316 100%)'
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg text-center" style={{ backgroundColor: 'var(--color-bg-tertiary)' }}>
              <p className="text-xs font-semibold flex items-center justify-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                <FaFire /> Keep going! You're making great progress!
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Learning Streak Tracker */}
        <div className="lg:col-span-2 space-y-6">
          {/* Learning Streak Card */}
          <div className="rounded-2xl shadow-custom-xl p-3 bg-elevated border border-light h-fit">
            <h3 className="text-primary text-xs font-semibold flex items-center gap-1.5 mb-2">
              <FaFire className="text-orange-500 text-sm" /> Learning Streak
            </h3>
            
            {/* Current Streak Display */}
            <div className="text-center mb-2 p-2 rounded-lg" style={{ background: 'linear-gradient(135deg, #FB923C 0%, #F97316 50%, #EA580C 100%)' }}>
              <FaFire className="text-lg mb-1 mx-auto" style={{ color: '#FFF' }} />
              <div className="text-xl font-bold text-white">
                {calculateStreak()}
              </div>
              <div className="text-white text-[9px] font-medium opacity-90">Day Streak</div>
            </div>

            {/* Modern Calendar Component */}
        <div 
          className="mt-1.5 p-2 rounded-xl border" 
          style={{ 
            backgroundColor: 'var(--color-bg-secondary)',
            borderColor: 'var(--color-border-light)'
          }}
        >
  <h4 
    className="text-[9px] font-semibold mb-1 uppercase tracking-wide text-center"
    style={{ color: 'var(--color-text-tertiary)' }}
  >
    Activity Calendar
  </h4>
  <div className="flex justify-center">
    <CalendarCurrent activityLog={streakData.activityLog} />
  </div>
</div>
</div>

          {/* Achievement Badges */}
          <div className="rounded-2xl shadow-custom-xl p-4 bg-elevated border border-light">
            <h3 className="text-primary text-base font-semibold mb-3 flex items-center gap-2">
              <FaTrophy className="text-yellow-500" /> Achievements
            </h3>
            
            <div className="grid grid-cols-3 gap-3">
              {/* Badge 1: First Course */}
              <div className="text-center">
                <div className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center text-xl mb-1.5 transition-all ${
                  recentCourses.length > 0 ? 'bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg' : 'bg-gray-700 opacity-40'
                }`}>
                  <FaBookOpen className="text-white" />
                </div>
                <p className="text-[10px] font-medium" style={{ color: recentCourses.length > 0 ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)' }}>
                  First Course
                </p>
              </div>

              {/* Badge 2: Week Streak */}
              <div className="text-center">
                <div className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center text-xl mb-1.5 transition-all ${
                  calculateStreak() >= 7 ? 'bg-gradient-to-br from-orange-500 to-red-600 shadow-lg' : 'bg-gray-700 opacity-40'
                }`}>
                  <FaFire className="text-white" />
                </div>
                <p className="text-[10px] font-medium" style={{ color: calculateStreak() >= 7 ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)' }}>
                  Week Streak
                </p>
              </div>

              {/* Badge 3: Quiz Master */}
              <div className="text-center">
                <div className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center text-xl mb-1.5 transition-all ${
                  (user?.totalPoints || 0) >= 100 ? 'bg-gradient-to-br from-green-500 to-emerald-700 shadow-lg' : 'bg-gray-700 opacity-40'
                }`}>
                  <FaStar className="text-white" />
                </div>
                <p className="text-[10px] font-medium" style={{ color: (user?.totalPoints || 0) >= 100 ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)' }}>
                  Quiz Master
                </p>
              </div>

              {/* Badge 4: 10 Lessons */}
              <div className="text-center">
                <div className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center text-xl mb-1.5 transition-all ${
                  stats.completed >= 10 ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg' : 'bg-gray-700 opacity-40'
                }`}>
                  <FaBookOpen className="text-white" />
                </div>
                <p className="text-[10px] font-medium" style={{ color: stats.completed >= 10 ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)' }}>
                  10 Lessons
                </p>
              </div>

              {/* Badge 5: Early Bird */}
              <div className="text-center">
                <div className="w-14 h-14 mx-auto rounded-full flex items-center justify-center text-xl mb-1.5 bg-gray-700 opacity-40">
                  <FaClock className="text-gray-500" />
                </div>
                <p className="text-[10px] font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
                  Early Bird
                </p>
              </div>

              {/* Badge 6: Perfectionist */}
              <div className="text-center">
                <div className="w-14 h-14 mx-auto rounded-full flex items-center justify-center text-xl mb-1.5 bg-gray-700 opacity-40">
                  <FaCheckCircle className="text-gray-500" />
                </div>
                <p className="text-[10px] font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
                  Perfectionist
                </p>
              </div>
            </div>

            <div className="mt-3 p-2 rounded-lg text-center" style={{ backgroundColor: 'var(--color-bg-tertiary)' }}>
              <p className="text-[10px] font-semibold flex items-center justify-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                <FaTrophy /> Unlock badges by completing goals!
              </p>
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
