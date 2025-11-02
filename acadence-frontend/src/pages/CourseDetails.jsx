import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaBook,
  FaClock,
  FaGraduationCap,
  FaCheckCircle,
  FaSpinner,
  FaArrowLeft,
  FaQuestionCircle,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import API_BASE_URL from "../config";

export default function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [expandedLesson, setExpandedLesson] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);

      // Fetch course details
      const courseResponse = await axios.get(
        `${API_BASE_URL}/api/courses/${courseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Fetch lessons
      const lessonsResponse = await axios.get(
        `${API_BASE_URL}/api/lessons/course/${courseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Fetch quiz
      const quizResponse = await axios.get(
        `${API_BASE_URL}/api/quizzes/course/${courseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCourse(courseResponse.data);
      setLessons(lessonsResponse.data);
      setQuiz(quizResponse.data);
    } catch (error) {
      console.error("Error fetching course details:", error);
      toast.error("Failed to load course details");
      navigate("/dashboard/allcourses");
    } finally {
      setLoading(false);
    }
  };

  const toggleLesson = (lessonId) => {
    setExpandedLesson(expandedLesson === lessonId ? null : lessonId);
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: "text-green-400 bg-green-900/30 border-green-500/30",
      intermediate: "text-yellow-400 bg-yellow-900/30 border-yellow-500/30",
      advanced: "text-red-400 bg-red-900/30 border-red-500/30",
    };
    return colors[difficulty?.toLowerCase()] || colors.beginner;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="text-6xl text-indigo-400 animate-spin mx-auto mb-4" />
          <p className="text-xl text-gray-400">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-400">Course not found</p>
          <button
            onClick={() => navigate("/dashboard/allcourses")}
            className="mt-4 px-6 py-2 bg-indigo-500 rounded-lg hover:bg-indigo-600"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard/allcourses")}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
        >
          <FaArrowLeft />
          Back to All Courses
        </button>

        {/* Course Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-8 mb-8 shadow-2xl">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
              <p className="text-indigo-100 text-lg mb-4">{course.description}</p>
            </div>
            <span
              className={`px-4 py-2 rounded-full border text-sm font-semibold capitalize ${getDifficultyColor(
                course.difficulty
              )}`}
            >
              {course.difficulty}
            </span>
          </div>

          {/* Course Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 bg-white/10 rounded-lg p-4">
              <FaBook className="text-2xl text-indigo-200" />
              <div>
                <p className="text-sm text-indigo-200">Total Lessons</p>
                <p className="text-xl font-bold">{course.totalLessons}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 rounded-lg p-4">
              <FaClock className="text-2xl text-indigo-200" />
              <div>
                <p className="text-sm text-indigo-200">Duration</p>
                <p className="text-xl font-bold">{course.estimatedDuration}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 rounded-lg p-4">
              <FaGraduationCap className="text-2xl text-indigo-200" />
              <div>
                <p className="text-sm text-indigo-200">Progress</p>
                <p className="text-xl font-bold">
                  {Math.round((course.completedLessons / course.totalLessons) * 100)}%
                </p>
              </div>
            </div>
          </div>

          {/* Learning Objectives */}
          {course.learningObjectives && course.learningObjectives.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <FaCheckCircle />
                What You'll Learn
              </h3>
              <ul className="space-y-2">
                {course.learningObjectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                    <span className="text-indigo-100">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Lessons Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <FaBook className="text-indigo-400" />
            Course Lessons
          </h2>

          <div className="space-y-4">
            {lessons.map((lesson, index) => (
              <div
                key={lesson._id}
                className="bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-700"
              >
                {/* Lesson Header */}
                <button
                  onClick={() => toggleLesson(lesson._id)}
                  className="w-full p-6 flex items-center justify-between hover:bg-slate-750 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-semibold">{lesson.title}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <FaClock />
                          {lesson.duration || "30 mins"}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaGraduationCap />
                          {lesson.points} points
                        </span>
                      </div>
                    </div>
                  </div>
                  {expandedLesson === lesson._id ? (
                    <FaChevronUp className="text-gray-400" />
                  ) : (
                    <FaChevronDown className="text-gray-400" />
                  )}
                </button>

                {/* Lesson Content */}
                {expandedLesson === lesson._id && (
                  <div className="p-6 pt-0 border-t border-slate-700">
                    <div className="prose prose-invert max-w-none">
                      <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                        {lesson.content}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quiz Section */}
        {quiz && (
          <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold flex items-center gap-3 mb-2">
                  <FaQuestionCircle className="text-purple-400" />
                  {quiz.title}
                </h2>
                <p className="text-gray-400">{quiz.description}</p>
                <p className="text-indigo-400 mt-2">
                  Total Score: {quiz.score} points
                </p>
              </div>
              <button
                onClick={() => setShowQuiz(!showQuiz)}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition"
              >
                {showQuiz ? "Hide Quiz" : "View Quiz"}
              </button>
            </div>

            {showQuiz && (
              <div className="space-y-6 mt-6">
                {quiz.questions.map((question, index) => (
                  <div
                    key={index}
                    className="bg-slate-900 rounded-lg p-6 border border-slate-700"
                  >
                    <h4 className="text-lg font-semibold mb-3">
                      {index + 1}. {question.ques}
                    </h4>
                    <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                      <p className="text-sm text-green-300 font-medium mb-1">
                        ✓ Answer:
                      </p>
                      <p className="text-gray-300">{question.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
