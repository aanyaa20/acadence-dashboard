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
  FaYoutube,
  FaCheck,
  FaStar,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import API_BASE_URL from "../config";
import QuizTaker from "../components/QuizTaker";

export default function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { token, refreshUser } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [expandedLesson, setExpandedLesson] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [takingQuiz, setTakingQuiz] = useState(false);
  const [completedLessons, setCompletedLessons] = useState([]);

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const authToken = localStorage.getItem('token');

      // Fetch course details
      const courseResponse = await axios.get(
        `${API_BASE_URL}/api/courses/${courseId}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      // Fetch lessons
      const lessonsResponse = await axios.get(
        `${API_BASE_URL}/api/lessons/course/${courseId}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      // Fetch quiz
      const quizResponse = await axios.get(
        `${API_BASE_URL}/api/quizzes/course/${courseId}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      setCourse(courseResponse.data);
      setLessons(lessonsResponse.data);
      setQuiz(quizResponse.data[0]); // Get first quiz
      
      // Set completed lessons
      const completed = lessonsResponse.data
        .filter(lesson => lesson.completed)
        .map(lesson => lesson._id);
      setCompletedLessons(completed);
    } catch (error) {
      console.error("Error fetching course details:", error);
      toast.error("Failed to load course details");
      navigate("/dashboard/allcourses");
    } finally {
      setLoading(false);
    }
  };

  const handleLessonComplete = async (lessonId) => {
    try {
      const authToken = localStorage.getItem('token');
      const response = await axios.patch(
        `${API_BASE_URL}/api/lessons/${lessonId}/complete`,
        {},
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      // Add to completed lessons
      if (!completedLessons.includes(lessonId)) {
        setCompletedLessons([...completedLessons, lessonId]);
        
        if (response.data.pointsAwarded > 0) {
          toast.success(`Lesson completed! You earned ${response.data.pointsAwarded} points! `);
        } else {
          toast.success("Lesson marked as complete!");
        }
        
        // Refresh course to update progress
        await fetchCourseDetails();
        
        // Refresh user data in context to update points everywhere
        if (refreshUser) {
          await refreshUser();
        }
      }
    } catch (error) {
      console.error("Error completing lesson:", error);
      toast.error(error.response?.data?.message || "Failed to mark lesson as complete");
    }
  };

  const getYouTubeEmbedUrl = (searchTerm) => {
    // Create a YouTube search URL
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(searchTerm)}`;
  };

  const handleQuizComplete = async (results) => {
    // Refresh course data to get updated points
    await fetchCourseDetails();
    
    // Refresh user data in context to update points everywhere
    if (refreshUser) {
      await refreshUser();
    }
    
    toast.success(`Quiz completed with ${results.percentage}% score!`);
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
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div className="text-left flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-semibold">{lesson.title}</h3>
                        {completedLessons.includes(lesson._id) && (
                          <span className="flex items-center gap-1 text-green-400 text-sm font-semibold bg-green-900/30 px-3 py-1 rounded-full">
                            <FaCheckCircle />
                            Completed
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <FaClock />
                          {lesson.duration || "30 mins"}
                        </span>
                        <span className="flex items-center gap-1 text-yellow-400">
                          <FaStar />
                          5 points
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
                    {/* YouTube Video Link */}
                    {lesson.videoSearchTerm && (
                      <div className="mb-6 bg-slate-900/50 rounded-lg p-4 border border-slate-600">
                        <div className="flex items-center gap-3 mb-3">
                          <FaYoutube className="text-red-500 text-2xl" />
                          <h4 className="text-lg font-semibold text-white">Watch Tutorial</h4>
                        </div>
                        <a
                          href={getYouTubeEmbedUrl(lesson.videoSearchTerm)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                        >
                          <FaYoutube />
                          Search: {lesson.videoSearchTerm}
                        </a>
                      </div>
                    )}

                    {/* Lesson Content */}
                    <div className="max-w-none mb-6 bg-slate-900/30 rounded-lg p-6 border border-slate-700">
                      <div 
                        className="lesson-content"
                        dangerouslySetInnerHTML={{ 
                          __html: lesson.content.includes('<') 
                            ? lesson.content 
                            : `<p>${lesson.content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>`
                        }}
                      />
                    </div>

                    {/* Complete Lesson Button */}
                    <div className="flex justify-between items-center pt-4 border-t border-slate-600">
                      <p className="text-sm text-gray-400">
                        {completedLessons.includes(lesson._id) 
                          ? "Great job! You've completed this lesson." 
                          : "Finished reading? Mark this lesson as complete to track your progress."}
                      </p>
                      {!completedLessons.includes(lesson._id) && (
                        <button
                          onClick={() => handleLessonComplete(lesson._id)}
                          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
                        >
                          <FaCheck />
                          Mark Complete
                        </button>
                      )}
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
            {!takingQuiz ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold flex items-center gap-3 mb-2">
                      <FaQuestionCircle className="text-purple-400" />
                      {quiz.title}
                    </h2>
                    <p className="text-gray-400">{quiz.description}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <p className="text-indigo-400">
                        <strong>Questions:</strong> {quiz.questions.length}
                      </p>
                      <p className="text-green-400">
                        <strong>Reward:</strong> 20 Learning Points
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setTakingQuiz(true)}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg font-semibold text-lg transition-all transform hover:scale-[1.02]"
                >
                  Take Quiz
                </button>
              </>
            ) : (
              <div>
                <button
                  onClick={() => setTakingQuiz(false)}
                  className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
                >
                  <FaArrowLeft />
                  Back to Course
                </button>
                <QuizTaker quiz={quiz} onComplete={handleQuizComplete} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
