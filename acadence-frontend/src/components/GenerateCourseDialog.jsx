import React, { useState } from "react";
import { FaTimes, FaRobot, FaSpinner } from "react-icons/fa";

export default function GenerateCourseDialog({ isOpen, onClose, onGenerate, isGenerating }) {
  const [formData, setFormData] = useState({
    topic: "",
    difficulty: "beginner",
    numberOfLessons: 5,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.topic.trim()) {
      newErrors.topic = "Course topic is required";
    } else if (formData.topic.trim().length < 3) {
      newErrors.topic = "Topic must be at least 3 characters";
    }

    const lessons = parseInt(formData.numberOfLessons);
    if (lessons < 3 || lessons > 10) {
      newErrors.numberOfLessons = "Number of lessons must be between 3 and 10";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onGenerate(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isGenerating}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition disabled:opacity-50"
        >
          <FaTimes size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <FaRobot className="text-indigo-400 text-3xl" />
          <div>
            <h2 className="text-2xl font-bold text-white">Generate AI Course</h2>
            <p className="text-gray-400 text-sm">Create a personalized course with AI</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Topic Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Course Topic *
            </label>
            <input
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              placeholder="e.g., Web Development, Python Basics, Machine Learning"
              disabled={isGenerating}
              className={`w-full px-4 py-3 bg-slate-700 border ${
                errors.topic ? "border-red-500" : "border-slate-600"
              } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed`}
            />
            {errors.topic && (
              <p className="text-red-400 text-sm mt-1">{errors.topic}</p>
            )}
          </div>

          {/* Difficulty Select */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Difficulty Level
            </label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              disabled={isGenerating}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {/* Number of Lessons */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Number of Lessons (3-10)
            </label>
            <input
              type="number"
              name="numberOfLessons"
              value={formData.numberOfLessons}
              onChange={handleChange}
              min="3"
              max="10"
              disabled={isGenerating}
              className={`w-full px-4 py-3 bg-slate-700 border ${
                errors.numberOfLessons ? "border-red-500" : "border-slate-600"
              } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed`}
            />
            {errors.numberOfLessons && (
              <p className="text-red-400 text-sm mt-1">{errors.numberOfLessons}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isGenerating}
              className="flex-1 px-4 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="flex-1 px-4 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FaRobot />
                  Generate
                </>
              )}
            </button>
          </div>
        </form>

        {/* Info Message */}
        {isGenerating && (
          <div className="mt-4 p-3 bg-indigo-900/30 border border-indigo-500/30 rounded-lg">
            <p className="text-indigo-300 text-sm text-center">
              🤖 AI is creating your course... This may take 10-30 seconds
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
