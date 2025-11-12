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
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
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
    if (validate()) onGenerate(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div
        className="rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-scale-in border"
        style={{
          backgroundColor: "var(--color-bg-elevated)",
          borderColor: "var(--color-border-light)",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isGenerating}
          className="absolute top-4 right-4 transition disabled:opacity-50"
          style={{ color: "var(--color-text-tertiary)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-primary)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-tertiary)")}
        >
          <FaTimes size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <FaRobot className="text-3xl" style={{ color: "var(--color-primary)" }} />
          <div>
            <h2 className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>
              Generate AI Course
            </h2>
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
              Create a personalized course with AI
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Topic Input */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Course Topic *
            </label>
            <input
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              placeholder="e.g., Web Development, Python Basics, Machine Learning"
              disabled={isGenerating}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "var(--color-bg-secondary)",
                borderColor: errors.topic ? "var(--color-error)" : "var(--color-border-light)",
                color: "var(--color-text-primary)",
              }}
            />
            {errors.topic && (
              <p className="text-sm mt-1" style={{ color: "var(--color-error)" }}>
                {errors.topic}
              </p>
            )}
          </div>

          {/* Difficulty Select */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Difficulty Level
            </label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              disabled={isGenerating}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "var(--color-bg-secondary)",
                borderColor: "var(--color-border-light)",
                color: "var(--color-text-primary)",
              }}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {/* Number of Lessons */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Number of Lessons (3–10)
            </label>
            <input
              type="number"
              name="numberOfLessons"
              value={formData.numberOfLessons}
              onChange={handleChange}
              min="3"
              max="10"
              disabled={isGenerating}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "var(--color-bg-secondary)",
                borderColor: errors.numberOfLessons
                  ? "var(--color-error)"
                  : "var(--color-border-light)",
                color: "var(--color-text-primary)",
              }}
            />
            {errors.numberOfLessons && (
              <p className="text-sm mt-1" style={{ color: "var(--color-error)" }}>
                {errors.numberOfLessons}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isGenerating}
              className="flex-1 px-4 py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "var(--color-bg-tertiary)",
                color: "var(--color-text-primary)",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="flex-1 px-4 py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "var(--color-text-inverse)",
              }}
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

        {/* Info */}
        {isGenerating && (
          <div
            className="mt-4 p-3 border rounded-lg"
            style={{
              backgroundColor: "var(--color-primary-light)",
              borderColor: "var(--color-primary)",
            }}
          >
            <p className="text-sm text-center" style={{ color: "var(--color-text-primary)" }}>
              🤖 AI is creating your course... This may take 10–30 seconds
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

        /* 💜 Ultra-soft pastel violet palette */
        :root {
          --color-primary: #C8A2FF;
          --color-primary-hover: #B388FF;
          --color-primary-light: #F4EAFF;
          --color-accent: #D8B4FE;
        }

        [data-theme="dark"] {
          --color-primary: #B799FF;
          --color-primary-hover: #A985FF;
          --color-primary-light: #4C1D95;
          --color-accent: #C4B5FD;
        }
      `}</style>
    </div>
  );
}
