import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import API_BASE_URL from "../config";
import {
  FaClock,
  FaBookOpen,
  FaCertificate,
  FaMedal,
  FaChartLine,
  FaStar,
  FaSpinner,
} from "react-icons/fa";

export default function Progress() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    
    completed: 0,
    
    points: 0,
  });
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = user?.id || user?._id;
        
        if (userId && token) {
          // Fetch user data for points
          const userResponse = await axios.get(
            `${API_BASE_URL}/api/users/${userId}`,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );

          // Fetch user's courses
          const coursesResponse = await axios.get(
            `${API_BASE_URL}/api/courses/user`,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );

          // Calculate stats
          let totalCompleted = 0;
          let totalLessons = 0;
          const coursesList = [];
          
          for (const course of coursesResponse.data) {
            totalCompleted += course.completedLessons || 0;
            totalLessons += course.totalLessons || 0;
            
            const progress = course.totalLessons > 0 
              ? Math.round((course.completedLessons / course.totalLessons) * 100) 
              : 0;
              
            coursesList.push({
              id: course._id,
              title: course.title,
              progress,
              completedLessons: course.completedLessons || 0,
              totalLessons: course.totalLessons || 0,
            });
          }

          
          const completedCourses = coursesList.filter(c => c.progress === 100).length;
          
          setStats({
        
            completed: totalCompleted,
      
            points: userResponse.data.totalPoints || 0,
          });

          setCourses(coursesList);
        }
      } catch (error) {
        console.error("Error fetching progress data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProgressData();
    }
  }, [user]);

  const statsDisplay = [
    {
      id: 1,
     
      value: loading ? "..." : stats.hours,
      icon: <FaClock />,
      desc: "Total learning time",
    },
    {
      id: 2,
      title: "Lessons Completed",
      value: loading ? "..." : stats.completed,
      icon: <FaBookOpen />,
      desc: "Chapters finished so far",
    },
    {
      id: 3,
      title: "Learning Points",
      value: loading ? "..." : stats.points,
      icon: <FaStar />,
      desc: "Points earned",
    },
  ];

  const achievements = [
    {
      id: 1,
      title: "First 10 Lessons",
      icon: <FaMedal className="text-yellow-400" />,
    },
    {
      id: 2,
      title: "100 Hours of Learning",
      icon: <FaMedal className="text-indigo-400" />,
    },
    {
      id: 3,
      title: "Completed 3 Courses",
      icon: <FaMedal className="text-green-400" />,
    },
  ];

  return (
    <div className="p-8 pt-24 text-white">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-3">
          <FaChartLine className="text-blue-300" /> Your Progress
        </h1>
        <p className="text-gray-300 text-lg">
          Keep going {user?.name || "Learner"}! Here's how far you've come
        </p>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <FaSpinner className="text-6xl text-indigo-400 animate-spin" />
        </div>
      ) : (
        <>
          {/* StatCards */}
          <section className="grid md:grid-cols-3 gap-6 mb-12">
            {statsDisplay.map((stat) => (
              <div
                key={stat.id}
                className="bg-gradient-to-br from-indigo-700 to-blue-900 p-6 rounded-2xl shadow-lg flex items-center gap-4 hover:scale-[1.02] transition"
              >
                <div className="p-4 bg-white/10 rounded-full text-2xl">
                  {stat.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{stat.value}</h3>
                  <p className="text-sm text-indigo-200">{stat.title}</p>
                  <p className="text-xs text-gray-400">{stat.desc}</p>
                </div>
              </div>
            ))}
          </section>

          {/* Course Progress */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <FaBookOpen className="text-blue-300" /> Course Progress
            </h2>
            {courses.length === 0 ? (
              <div className="bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-700 text-center">
                <p className="text-gray-400">No courses started yet. Generate your first course!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700"
                  >
                    <h3 className="font-semibold mb-3">{course.title}</h3>
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                      <span>{course.completedLessons} / {course.totalLessons} lessons</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-700 h-3 rounded-full">
                      <div
                        className="h-3 rounded-full bg-gradient-to-r from-indigo-400 to-blue-500 transition-all duration-500"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Achievements */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <FaMedal className="text-yellow-400" /> Achievements
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  className="bg-gradient-to-br from-indigo-800 to-blue-900 p-6 rounded-2xl shadow-lg flex items-center gap-4"
                >
                  <div className="text-3xl">{ach.icon}</div>
                  <h3 className="font-semibold">{ach.title}</h3>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
