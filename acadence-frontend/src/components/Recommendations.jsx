import React from "react";
import { FaBook, FaClock, FaLightbulb } from "react-icons/fa";

export default function Recommendations({ items = [], loading = false }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 rounded-xl animate-pulse" style={{
            backgroundColor: 'var(--color-bg-tertiary)'
          }}>
            <div className="h-4 rounded mb-2" style={{ backgroundColor: 'var(--color-bg-secondary)', width: '70%' }}></div>
            <div className="h-3 rounded mb-3" style={{ backgroundColor: 'var(--color-bg-secondary)', width: '90%' }}></div>
            <div className="h-3 rounded" style={{ backgroundColor: 'var(--color-bg-secondary)', width: '50%' }}></div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-8" style={{ color: 'var(--color-text-secondary)' }}>
        <FaLightbulb className="mx-auto text-4xl mb-3" style={{ color: 'var(--color-warning)' }} />
        <p>No recommendations available yet.</p>
        <p className="text-sm mt-2">Complete a course to get personalized suggestions!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((course, index) => (
        <div 
          key={index} 
          className="p-4 rounded-xl transition-all duration-300 hover:-translate-y-1 border"
          style={{
            backgroundColor: 'var(--color-bg-elevated)',
            borderColor: 'var(--color-border-light)',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <FaBook style={{ color: 'var(--color-primary)' }} />
                <h4 className="font-bold text-lg" style={{ color: 'var(--color-text-primary)' }}>
                  {course.title}
                </h4>
              </div>
              
              <p className="text-sm mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                {course.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-3 text-xs mb-3">
                <span className="px-2 py-1 rounded-lg" style={{
                  backgroundColor: course.difficulty === 'beginner' 
                    ? 'var(--color-success-light)' 
                    : course.difficulty === 'intermediate' 
                    ? 'var(--color-warning-light)' 
                    : 'var(--color-error-light)',
                  color: 'var(--color-text-primary)'
                }}>
                  {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
                </span>
                
                <span className="flex items-center gap-1" style={{ color: 'var(--color-text-tertiary)' }}>
                  <FaClock />
                  {course.estimatedDuration}
                </span>
                
                <span className="px-2 py-1 rounded-lg" style={{
                  backgroundColor: 'var(--color-bg-tertiary)',
                  color: 'var(--color-text-secondary)'
                }}>
                  {course.topic}
                </span>
              </div>
              
              <div className="flex items-start gap-2 p-2 rounded-lg" style={{
                backgroundColor: 'var(--color-primary-light)'
              }}>
                <FaLightbulb className="mt-1 flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
                <p className="text-xs italic" style={{ color: 'var(--color-text-primary)' }}>
                  {course.reason}
                </p>
              </div>
            </div>
            
            <button 
              className="px-4 py-2 rounded-lg font-medium transition-all hover:opacity-90 shadow-md whitespace-nowrap"
              style={{
                background: 'var(--gradient-primary)',
                color: 'var(--color-text-inverse)'
              }}
            >
              Start Course
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
