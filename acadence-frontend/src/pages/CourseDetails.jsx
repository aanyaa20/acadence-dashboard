import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from 'react-markdown';
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
  FaCheck,
  FaStar,
  FaTrash,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import API_BASE_URL from "../config";
import QuizTaker from "../components/QuizTaker";

export default function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { token, refreshUser } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [expandedLesson, setExpandedLesson] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [takingQuiz, setTakingQuiz] = useState(false);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [showUnenrollModal, setShowUnenrollModal] = useState(false);

  // Check if we're on the quiz route
  const isQuizRoute = location.pathname.includes('/quiz');

  // Function to convert HTML-like tags to markdown
  const convertToMarkdown = (content) => {
    if (!content) return '';
    
    return content
      // Convert heading tags
      .replace(/<h1>(.*?)<\/h1>/gi, '# $1\n\n')
      .replace(/<h2>(.*?)<\/h2>/gi, '## $1\n\n')
      .replace(/<h3>(.*?)<\/h3>/gi, '### $1\n\n')
      .replace(/<h4>(.*?)<\/h4>/gi, '#### $1\n\n')
      .replace(/<h5>(.*?)<\/h5>/gi, '##### $1\n\n')
      .replace(/<h6>(.*?)<\/h6>/gi, '###### $1\n\n')
      // Convert bold and italic
      .replace(/<b>(.*?)<\/b>/gi, '**$1**')
      .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<i>(.*?)<\/i>/gi, '*$1*')
      .replace(/<em>(.*?)<\/em>/gi, '*$1*')
      // Convert line breaks
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<br>/gi, '\n')
      // Convert lists
      .replace(/<ul>/gi, '\n')
      .replace(/<\/ul>/gi, '\n')
      .replace(/<ol>/gi, '\n')
      .replace(/<\/ol>/gi, '\n')
      .replace(/<li>(.*?)<\/li>/gi, '- $1\n')
      // Convert paragraphs
      .replace(/<p>(.*?)<\/p>/gi, '$1\n\n')
      // Remove any remaining HTML tags
      .replace(/<\/?[^>]+(>|$)/g, '')
      // Clean up extra newlines
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  };

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  useEffect(() => {
    if (isQuizRoute && quiz) {
      setTakingQuiz(true);
    }
  }, [isQuizRoute, quiz]);

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
      
      // Set completed lessons - check if user has completed them
      const completed = lessonsResponse.data
        .filter(lesson => lesson.completedByCurrentUser || lesson.completed)
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

  const handleLessonComplete = async (lessonId, isCurrentlyCompleted) => {
    try {
      const authToken = localStorage.getItem('token');
      const isCompleting = !isCurrentlyCompleted; // Toggle
      
      console.log('='.repeat(80));
      console.log('🎯 LESSON TOGGLE REQUEST');
      console.log('Lesson ID:', lessonId);
      console.log('isCurrentlyCompleted:', isCurrentlyCompleted);
      console.log('isCompleting:', isCompleting);
      console.log('Token exists:', !!authToken);
      console.log('API URL:', `${API_BASE_URL}/api/lessons/${lessonId}/complete`);
      console.log('='.repeat(80));
      
      const response = await axios.patch(
        `${API_BASE_URL}/api/lessons/${lessonId}/complete`,
        { isCompleting },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      console.log('✅ Response:', response.data);

      // Update completed lessons array
      if (isCompleting && !completedLessons.includes(lessonId)) {
        setCompletedLessons([...completedLessons, lessonId]);
        toast.success(`✅ Lesson completed! +${response.data.pointsChange} points!`);
      } else if (!isCompleting && completedLessons.includes(lessonId)) {
        setCompletedLessons(completedLessons.filter(id => id !== lessonId));
        toast.info(`Lesson marked as incomplete. ${response.data.pointsChange} points.`);
      }
      
      // Refresh course to update progress
      await fetchCourseDetails();
      
      // Refresh user data in context to update points and streak everywhere
      if (refreshUser) {
        await refreshUser();
      }
    } catch (error) {
      console.error("❌ Error toggling lesson completion:", error);
      console.error("❌ Error response:", error.response?.data);
      console.error("❌ Error status:", error.response?.status);
      console.error("❌ Full error:", error);
      toast.error(error.response?.data?.message || "Failed to update lesson status");
    }
  };

  const handleQuizComplete = async (results) => {
    console.log("🎯 Quiz completed! Results:", results);
    
    // No toast notifications - QuizTaker component shows full results card
    // Don't refresh course details here - it will unmount the QuizTaker and hide the results
    
    // Only refresh user data to update points globally
    if (refreshUser) {
      console.log("🔄 Calling refreshUser...");
      await refreshUser();
    }
  };

  const handleUnenroll = async () => {
    try {
      const authToken = localStorage.getItem('token');
      await axios.delete(
        `${API_BASE_URL}/api/courses/${courseId}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      setShowUnenrollModal(false);
      navigate("/dashboard/allcourses");
    } catch (error) {
      console.error("Error unenrolling from course:", error);
      setShowUnenrollModal(false);
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
      <div className="min-h-screen flex items-center justify-center" style={{ 
        backgroundColor: 'var(--color-bg-primary)', 
        color: 'var(--color-text-primary)' 
      }}>
        <div className="text-center">
          <FaSpinner className="text-6xl animate-spin mx-auto mb-4" style={{ color: 'var(--color-primary)' }} />
          <p className="text-xl" style={{ color: 'var(--color-text-secondary)' }}>Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ 
        backgroundColor: 'var(--color-bg-primary)', 
        color: 'var(--color-text-primary)' 
      }}>
        <div className="text-center">
          <p className="text-xl" style={{ color: 'var(--color-text-secondary)' }}>Course not found</p>
          <button
            onClick={() => navigate("/dashboard/allcourses")}
            className="mt-4 px-6 py-2 rounded-lg transition"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-text-inverse)'
            }}
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6" style={{ 
      backgroundColor: 'var(--color-bg-primary)', 
      color: 'var(--color-text-primary)' 
    }}>
      <div className="max-w-7xl mx-auto">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/dashboard/allcourses")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-opacity-10 transition font-semibold"
            style={{ 
              color: 'var(--color-text-secondary)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}
          >
            <FaArrowLeft />
            Back to All Courses
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-bold shadow-lg hover:shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #1E40AF, #1E3A8A)',
                color: '#fff'
              }}
            >
              <FaGraduationCap />
              Go to Dashboard
            </button>

            <button
              onClick={() => setShowUnenrollModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-bold border-2 border-red-500/40 text-red-400 hover:bg-red-500/20 shadow-lg"
            >
              <FaTrash />
              Unenroll
            </button>
          </div>
        </div>

        {/* Unenroll Confirmation Modal */}
        {showUnenrollModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl" style={{
              backgroundColor: 'var(--color-bg-elevated)',
              borderColor: 'var(--color-border-light)'
            }}>
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                  <FaTrash className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                  Unenroll from Course?
                </h3>
                <p className="text-base mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                  Are you sure you want to unenroll from this course? This will delete all your progress and cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowUnenrollModal(false)}
                    className="flex-1 px-6 py-3 rounded-xl font-bold transition-all border-2"
                    style={{
                      borderColor: 'var(--color-border-light)',
                      color: 'var(--color-text-primary)',
                      backgroundColor: 'var(--color-bg-secondary)'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUnenroll}
                    className="flex-1 px-6 py-3 rounded-xl font-bold transition-all bg-red-600 text-white hover:bg-red-700"
                  >
                    Unenroll
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Course Header */}
        <div className="rounded-3xl p-8 mb-8 shadow-2xl border" style={{
          background: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 50%, #1E3A8A 100%)',
          borderColor: 'rgba(37, 99, 235, 0.3)'
        }}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2 text-white drop-shadow-lg">{course.title}</h1>
              <p className="text-lg mb-4 text-white opacity-95">{course.description}</p>
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
            <div className="flex items-center gap-3 rounded-lg p-4" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
              <FaBook className="text-2xl" style={{ color: 'var(--color-text-inverse)', opacity: 0.8 }} />
              <div>
                <p className="text-sm" style={{ color: 'var(--color-text-inverse)', opacity: 0.8 }}>Total Lessons</p>
                <p className="text-xl font-bold" style={{ color: 'var(--color-text-inverse)' }}>{course.totalLessons}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg p-4" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
              <FaClock className="text-2xl" style={{ color: 'var(--color-text-inverse)', opacity: 0.8 }} />
              <div>
                <p className="text-sm" style={{ color: 'var(--color-text-inverse)', opacity: 0.8 }}>Duration</p>
                <p className="text-xl font-bold" style={{ color: 'var(--color-text-inverse)' }}>{course.estimatedDuration}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg p-4" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
              <FaGraduationCap className="text-2xl" style={{ color: 'var(--color-text-inverse)', opacity: 0.8 }} />
              <div>
                <p className="text-sm" style={{ color: 'var(--color-text-inverse)', opacity: 0.8 }}>Progress</p>
                <p className="text-xl font-bold" style={{ color: 'var(--color-text-inverse)' }}>
                  {Math.round((course.completedLessons / course.totalLessons) * 100)}%
                </p>
              </div>
            </div>
          </div>

          {/* Learning Objectives */}
          {course.learningObjectives && course.learningObjectives.length > 0 && (
            <div className="mt-6 pt-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
                <FaCheckCircle />
                What You'll Learn
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {course.learningObjectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <FaCheckCircle className="mt-1 flex-shrink-0 text-emerald-300" />
                    <span className="text-white opacity-90">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Course Completion Banner */}
        {course.completedLessons === course.totalLessons && course.totalLessons > 0 && (
          <div className="mb-8 rounded-3xl p-8 text-center shadow-2xl border-2 relative overflow-hidden" style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            borderColor: '#34d399'
          }}>
            <div className="text-7xl mb-4">🎉</div>
            <h2 className="text-4xl font-bold text-white mb-2">Congratulations!</h2>
            <p className="text-white text-xl mb-4">You've completed all lessons in this course!</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-8 py-4 bg-white text-green-600 rounded-xl font-bold hover:bg-gray-100 transition transform hover:scale-105 shadow-xl"
            >
               View Your Progress on Dashboard
            </button>
          </div>
        )}

        {/* Lessons Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3" style={{ color: 'var(--color-text-primary)' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #1E40AF, #1E3A8A)' }}>
              <FaBook className="text-xl text-white" />
            </div>
            Course Lessons
          </h2>

          <div className="space-y-6">
            {lessons.map((lesson, index) => (
              <div
                key={lesson._id}
                className="rounded-2xl overflow-hidden shadow-xl border-2 transition-all hover:shadow-2xl hover:scale-[1.01]"
                style={{
                  backgroundColor: 'var(--color-bg-elevated)',
                  borderColor: completedLessons.includes(lesson._id) ? '#10b981' : 'var(--color-border-light)'
                }}
              >
                {/* Lesson Header */}
                <button
                  onClick={() => toggleLesson(lesson._id)}
                  className="w-full p-6 flex items-center justify-between transition"
                  style={{ backgroundColor: 'transparent' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-tertiary)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold" style={{
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--color-text-inverse)'
                    }}>
                      {index + 1}
                    </div>
                    <div className="text-left flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>{lesson.title}</h3>
                        {completedLessons.includes(lesson._id) && (
                          <span className="flex items-center gap-1 text-sm font-semibold px-3 py-1 rounded-full" style={{
                            color: 'var(--color-success)',
                            backgroundColor: 'var(--color-success-light)'
                          }}>
                            <FaCheckCircle />
                            Completed
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
                        <span className="flex items-center gap-1">
                          <FaClock />
                          {lesson.duration || "30 mins"}
                        </span>
                        <span className="flex items-center gap-1" style={{ color: 'var(--color-warning)' }}>
                          <FaStar />
                          5 points
                        </span>
                      </div>
                    </div>
                  </div>
                  {expandedLesson === lesson._id ? (
                    <FaChevronUp style={{ color: 'var(--color-text-tertiary)' }} />
                  ) : (
                    <FaChevronDown style={{ color: 'var(--color-text-tertiary)' }} />
                  )}
                </button>

                {/* Lesson Content */}
                {expandedLesson === lesson._id && (
                  <div className="p-6 pt-0 border-t" style={{ borderColor: 'var(--color-border-light)' }}>
                    {/* Lesson Content */}
                    <div className="max-w-none mb-6 rounded-lg p-6 border" style={{
                      backgroundColor: 'var(--color-bg-secondary)',
                      borderColor: 'var(--color-border-light)',
                      color: 'var(--color-text-primary)'
                    }}>
                      <ReactMarkdown
                        components={{
                          h1: ({node, ...props}) => <h1 style={{color: 'var(--color-text-primary)', fontSize: '2em', fontWeight: 'bold', marginBottom: '1rem'}} {...props} />,
                          h2: ({node, ...props}) => <h2 style={{color: 'var(--color-text-primary)', fontSize: '1.5em', fontWeight: 'bold', marginBottom: '0.75rem', marginTop: '1.5rem'}} {...props} />,
                          h3: ({node, ...props}) => <h3 style={{color: 'var(--color-text-primary)', fontSize: '1.25em', fontWeight: 'bold', marginBottom: '0.5rem', marginTop: '1rem'}} {...props} />,
                          p: ({node, ...props}) => <p style={{color: 'var(--color-text-primary)', marginBottom: '1rem', lineHeight: '1.7'}} {...props} />,
                          ul: ({node, ...props}) => <ul style={{color: 'var(--color-text-primary)', marginLeft: '1.5rem', marginBottom: '1rem', listStyleType: 'disc'}} {...props} />,
                          ol: ({node, ...props}) => <ol style={{color: 'var(--color-text-primary)', marginLeft: '1.5rem', marginBottom: '1rem', listStyleType: 'decimal'}} {...props} />,
                          li: ({node, ...props}) => <li style={{color: 'var(--color-text-primary)', marginBottom: '0.5rem'}} {...props} />,
                          code: ({node, inline, ...props}) => 
                            inline 
                              ? <code style={{backgroundColor: 'rgba(99, 102, 241, 0.1)', padding: '0.2em 0.4em', borderRadius: '3px', color: '#60A5FA', fontSize: '0.9em'}} {...props} />
                              : <code style={{display: 'block', backgroundColor: 'var(--color-bg-tertiary)', padding: '1rem', borderRadius: '0.5rem', color: 'var(--color-text-primary)', fontSize: '0.9em', overflowX: 'auto', marginBottom: '1rem'}} {...props} />,
                          strong: ({node, ...props}) => <strong style={{color: 'var(--color-primary)', fontWeight: 'bold'}} {...props} />,
                          em: ({node, ...props}) => <em style={{color: 'var(--color-text-secondary)', fontStyle: 'italic'}} {...props} />,
                          blockquote: ({node, ...props}) => <blockquote style={{borderLeft: '4px solid var(--color-primary)', paddingLeft: '1rem', marginLeft: '0', marginBottom: '1rem', color: 'var(--color-text-secondary)', fontStyle: 'italic'}} {...props} />,
                        }}
                      >
                        {convertToMarkdown(lesson.content)}
                      </ReactMarkdown>
                    </div>

                    {/* Complete Lesson Button - Only show if not completed */}
                    {!completedLessons.includes(lesson._id) && (
                      <div className="flex justify-between items-center pt-4 border-t" style={{ borderColor: 'var(--color-border-light)' }}>
                        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                          Finished reading? Mark this lesson as complete to track your progress.
                        </p>
                        <button
                          onClick={() => handleLessonComplete(lesson._id, false)}
                          className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
                          style={{
                            background: 'linear-gradient(to right, var(--color-success), #10b981)',
                            color: 'var(--color-text-inverse)'
                          }}
                        >
                          <FaCheck />
                          Mark Complete
                        </button>
                      </div>
                    )}
                    
                    {/* Completed Status - Show when completed */}
                    {completedLessons.includes(lesson._id) && (
                      <div className="flex items-center gap-2 pt-4 border-t" style={{ borderColor: 'var(--color-border-light)' }}>
                        <FaCheck className="text-green-400" />
                        <p className="text-sm font-semibold" style={{ color: 'var(--color-success)' }}>
                          ✅ Lesson Completed!
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quiz Section */}
        {quiz && (
          <div className="rounded-2xl p-8 border" style={{
            backgroundColor: 'var(--color-bg-elevated)',
            borderColor: 'var(--color-border-light)'
          }}>
            {!takingQuiz ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold flex items-center gap-3 mb-2" style={{ color: 'var(--color-text-primary)' }}>
                      <FaQuestionCircle style={{ color: 'var(--color-accent)' }} />
                      {quiz.title}
                    </h2>
                    <p style={{ color: 'var(--color-text-secondary)' }}>{quiz.description}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <p style={{ color: 'var(--color-primary)' }}>
                        <strong>Questions:</strong> {quiz.questions.length}
                      </p>
                      <p style={{ color: 'var(--color-success)' }}>
                        <strong>Reward:</strong> 20 Learning Points
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/course/${courseId}/quiz`)}
                  className="w-full py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-[1.02]"
                  style={{
                    background: 'var(--gradient-primary)',
                    color: 'var(--color-text-inverse)'
                  }}
                >
                  Take Quiz
                </button>
              </>
            ) : (
              <div>
                <button
                  onClick={() => setTakingQuiz(false)}
                  className="flex items-center gap-2 mb-6 transition"
                  style={{ color: 'var(--color-text-secondary)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text-primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}
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
