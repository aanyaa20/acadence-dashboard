import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaBookOpen, FaSpinner, FaGraduationCap } from "react-icons/fa";
import toast from "react-hot-toast";
import dsaImg from "../assets/dsa.png";
import { AuthContext } from "../context/AuthContext";
import API_BASE_URL from "../config";

export default function Courses() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [generatedCourses, setGeneratedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const staticCourses = [
    {
      id: 1,
      title: "Mastering Data Structures & Algorithms using C and C++",
      image: dsaImg,
      progress: 40,
      link: "https://www.udemy.com/course/datastructurescncpp/learn/lecture/13319372?start=15#overview",
    },
  ];

  useEffect(() => {
    fetchUserCourses();
  }, []);

  const fetchUserCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/courses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGeneratedCourses(response.data);
    } catch (error) {
      console.error("Error fetching user courses:", error);
      if (error.response?.status !== 404) {
        toast.error("Failed to load your courses");
      }
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: "bg-green-500",
      intermediate: "bg-yellow-500",
      advanced: "bg-red-500",
    };
    return colors[difficulty?.toLowerCase()] || colors.beginner;
  };

  if (loading) {
    return (
      <div
        className="pt-24 p-8 flex items-center justify-center min-h-screen"
        style={{ color: "var(--color-text-primary)" }}
      >
        <div className="text-center">
          <FaSpinner
            className="text-5xl animate-spin mx-auto mb-4"
            style={{ color: "var(--color-primary)" }}
          />
          <p style={{ color: "var(--color-text-secondary)" }}>
            Loading your courses...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 p-8" style={{ color: "var(--color-text-primary)" }}>
      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <FaBookOpen className="text-4xl" style={{ color: "var(--color-primary)" }} />
          <h1
            className="text-4xl font-extrabold"
            style={{ color: "var(--color-text-primary)" }}
          >
            My Courses
          </h1>
        </div>
        <p
          className="text-lg"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Track your enrolled courses and continue learning
        </p>
      </header>

      {/* Empty State */}
      {generatedCourses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <div 
            className="w-32 h-32 rounded-full flex items-center justify-center mb-6"
            style={{ 
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
              border: '2px dashed var(--color-border-light)'
            }}
          >
            <FaGraduationCap className="text-6xl" style={{ color: 'var(--color-primary)' }} />
          </div>
          
          <h2 
            className="text-2xl font-bold mb-3"
            style={{ color: 'var(--color-text-primary)' }}
          >
            No Courses Yet
          </h2>
          
          <p 
            className="text-center mb-8 max-w-md"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Start your learning journey by creating your first AI-generated course or browsing available courses.
          </p>
          
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/dashboard/allcourses')}
              className="px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105"
              style={{
                background: 'var(--gradient-primary)',
                color: 'var(--color-text-inverse)'
              }}
            >
              Browse All Courses
            </button>
            
            <button
              onClick={() => navigate('/dashboard/allcourses#generate')}
              className="px-6 py-3 rounded-lg font-semibold transition-all border-2 hover:scale-105"
              style={{
                backgroundColor: 'transparent',
                color: 'var(--color-primary)',
                borderColor: 'var(--color-primary)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                e.currentTarget.style.color = 'var(--color-text-inverse)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--color-primary)';
              }}
            >
              Generate AI Course
            </button>
          </div>
        </div>
      )}

      {/* AI Generated Courses Section */}
      {generatedCourses.length > 0 && (
        <div className="mb-12">
          <h2
            className="text-2xl font-bold mb-6 flex items-center gap-2"
            style={{ color: "var(--color-text-primary)" }}
          >
            <FaGraduationCap style={{ color: "var(--color-accent)" }} />
            AI Generated Courses
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {generatedCourses.map((course) => (
              <div
                key={course._id}
                className="rounded-2xl shadow-lg overflow-hidden hover:scale-[1.02] transition cursor-pointer border"
                style={{
                  background: "linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%)",
                  borderColor: "rgba(37, 99, 235, 0.3)",
                }}
                onClick={() => navigate(`/course/${course._id}`)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3
                      className="text-xl font-bold flex-1"
                      style={{ color: "var(--color-text-inverse)" }}
                    >
                      {course.title}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(
                        course.difficulty
                      )}`}
                    >
                      {course.difficulty}
                    </span>
                  </div>

                  <p
                    className="text-sm mb-4 line-clamp-2"
                    style={{
                      color: "var(--color-text-inverse)",
                      opacity: 0.9,
                    }}
                  >
                    {course.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span
                        style={{
                          color: "var(--color-text-inverse)",
                          opacity: 0.8,
                        }}
                      >
                        Lessons
                      </span>
                      <span
                        className="font-semibold"
                        style={{ color: "var(--color-text-inverse)" }}
                      >
                        {course.totalLessons}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span
                        style={{
                          color: "var(--color-text-inverse)",
                          opacity: 0.8,
                        }}
                      >
                        Duration
                      </span>
                      <span
                        className="font-semibold"
                        style={{ color: "var(--color-text-inverse)" }}
                      >
                        {course.estimatedDuration}
                      </span>
                    </div>
                  </div>

                  <div
                    className="w-full h-3 rounded-full mb-2"
                    style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                  >
                    <div
                      className="h-3 rounded-full"
                      style={{
                        background:
                          "linear-gradient(to right, var(--color-accent), var(--color-primary))",
                        width: `${
                          (course.completedLessons / course.totalLessons) * 100
                        }%`,
                      }}
                    />
                  </div>
                  <p
                    className="text-sm mb-4"
                    style={{
                      color: "var(--color-text-inverse)",
                      opacity: 0.9,
                    }}
                  >
                    {Math.round(
                      (course.completedLessons / course.totalLessons) * 100
                    )}
                    % completed
                  </p>

                  <button
                    className="w-full px-4 py-2 rounded-lg text-sm font-medium transition"
                    style={{
                      backgroundColor: "var(--color-accent)",
                      color: "var(--color-text-inverse)",
                    }}
                  >
                    Continue Learning
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


    </div>
  );
}
