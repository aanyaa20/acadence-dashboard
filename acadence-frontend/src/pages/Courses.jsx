import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaBookOpen, FaSpinner, FaGraduationCap } from "react-icons/fa";
import toast from "react-hot-toast";
import pythonImg from "../assets/python.png";
import devImg from "../assets/dev.png";
import dsaImg from "../assets/dsa.png";
import completeImg from "../assets/complete.png";
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
      title: "The Complete Full-Stack Web Development Bootcamp",
      image: devImg,
      progress: 60,
      link: "https://www.udemy.com/course/the-complete-web-development-bootcamp/learn/lecture/41780544?start=0#overview"
    },
    {
      id: 2,
      title: "Mastering Data Structures & Algorithms using C and C++",
      image: dsaImg,
      progress: 40,
      link: "https://www.udemy.com/course/datastructurescncpp/learn/lecture/13319372?start=15#overview",
    },
    {
      id: 3,
      title: "Complete Placement Preparation",
      image: completeImg,
      progress: 20,
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
      <div className="pt-24 p-8 text-white flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaSpinner className="text-5xl text-indigo-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading your courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 p-8 text-white">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-3">
          <FaBookOpen className="text-blue-300" /> My Courses
        </h1>
        <p className="text-gray-300 text-lg">
          Track your enrolled courses and continue learning
        </p>
      </header>

      {/* AI Generated Courses Section */}
      {generatedCourses.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <FaGraduationCap className="text-purple-400" />
            AI Generated Courses
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {generatedCourses.map((course) => (
              <div
                key={course._id}
                className="bg-gradient-to-br from-purple-700 to-indigo-900 rounded-2xl shadow-lg overflow-hidden hover:scale-[1.02] transition cursor-pointer"
                onClick={() => navigate(`/course/${course._id}`)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold flex-1">{course.title}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(
                        course.difficulty
                      )}`}
                    >
                      {course.difficulty}
                    </span>
                  </div>
                  
                  <p className="text-indigo-200 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">Lessons</span>
                      <span className="font-semibold">{course.totalLessons}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">Duration</span>
                      <span className="font-semibold">{course.estimatedDuration}</span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-700 h-3 rounded-full mb-2">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500"
                      style={{
                        width: `${
                          (course.completedLessons / course.totalLessons) * 100
                        }%`,
                      }}
                    />
                  </div>
                  <p className="text-sm text-indigo-200 mb-4">
                    {Math.round((course.completedLessons / course.totalLessons) * 100)}%
                    completed
                  </p>

                  <button className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-sm font-medium">
                    Continue Learning
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Static Enrolled Courses Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <FaBookOpen className="text-indigo-400" />
          Enrolled Courses
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {staticCourses.map((course) => (
            <div
              key={course.id}
              className="bg-gradient-to-br from-indigo-700 to-blue-900 rounded-2xl shadow-lg overflow-hidden hover:scale-[1.02] transition"
            >
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                <div className="w-full bg-slate-700 h-3 rounded-full mb-2">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-indigo-400 to-blue-500"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
                <p className="text-sm text-indigo-200 mb-4">
                  {course.progress}% completed
                </p>

                {/* Continue Button */}
                {course.link ? (
                  <a
                    href={course.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-sm font-medium text-center"
                  >
                    Continue
                  </a>
                ) : (
                  <button className="w-full px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-sm font-medium">
                    Continue
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
