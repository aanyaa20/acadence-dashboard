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
      
            points: userResponse.data.totalPoints || user?.totalPoints || 0,
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
  }, [user, user?.totalPoints]); // Refresh when points change

  const statsDisplay = [
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
    <div className="p-8 pt-24" style={{ color: 'var(--color-text-primary)' }}>
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2 flex items-center gap-3" style={{ 
          background: 'var(--gradient-primary)', 
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          <FaChartLine style={{ color: 'var(--color-primary)' }} /> Your Progress
        </h1>
        <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
          Keep going {user?.name || "Learner"}! Here's how far you've come
        </p>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <FaSpinner className="text-6xl animate-spin" style={{ color: 'var(--color-primary)' }} />
        </div>
      ) : (
        <>
          {/* StatCards */}
          <section className="grid md:grid-cols-2 gap-6 mb-12">
            {statsDisplay.map((stat) => (
              <div
                key={stat.id}
                className="p-6 rounded-2xl shadow-lg flex items-center gap-4 hover:scale-[1.02] transition border"
                style={{
                  background: 'var(--gradient-primary)',
                  borderColor: 'var(--color-border-light)'
                }}
              >
                <div className="p-4 rounded-full text-2xl" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                  {stat.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold" style={{ color: 'var(--color-text-inverse)' }}>{stat.value}</h3>
                  <p className="text-sm" style={{ color: 'var(--color-text-inverse)', opacity: 0.9 }}>{stat.title}</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-inverse)', opacity: 0.7 }}>{stat.desc}</p>
                </div>
              </div>
            ))}
          </section>

          {/* Course Progress */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
              <FaBookOpen style={{ color: 'var(--color-primary)' }} /> Course Progress
            </h2>
            {courses.length === 0 ? (
              <div className="p-8 rounded-2xl shadow-lg border text-center" style={{
                backgroundColor: 'var(--color-bg-elevated)',
                borderColor: 'var(--color-border-light)'
              }}>
                <p style={{ color: 'var(--color-text-secondary)' }}>No courses started yet. Generate your first course!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="p-6 rounded-2xl shadow-lg border"
                    style={{
                      backgroundColor: 'var(--color-bg-elevated)',
                      borderColor: 'var(--color-border-light)'
                    }}
                  >
                    <h3 className="font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>{course.title}</h3>
                    <div className="flex justify-between text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                      <span>{course.completedLessons} / {course.totalLessons} lessons</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full h-3 rounded-full" style={{ backgroundColor: 'var(--color-bg-tertiary)' }}>
                      <div
                        className="h-3 rounded-full transition-all duration-500"
                        style={{ 
                          background: 'linear-gradient(to right, var(--color-accent), var(--color-primary))',
                          width: `${course.progress}%` 
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Achievements */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
              <FaMedal style={{ color: 'var(--color-warning)' }} /> Achievements
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  className="p-6 rounded-2xl shadow-lg flex items-center gap-4 border"
                  style={{
                    background: 'var(--gradient-primary)',
                    borderColor: 'var(--color-border-light)'
                  }}
                >
                  <div className="text-3xl">{ach.icon}</div>
                  <h3 className="font-semibold" style={{ color: 'var(--color-text-inverse)' }}>{ach.title}</h3>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
