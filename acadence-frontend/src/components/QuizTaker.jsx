import React, { useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaTrophy } from 'react-icons/fa';
import axios from 'axios';
import API_BASE_URL from '../config';
import toast from 'react-hot-toast';

const QuizTaker = ({ quiz, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: answer
    });
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    // Check if all questions are answered
    const unanswered = [];
    for (let i = 0; i < quiz.questions.length; i++) {
      if (!selectedAnswers[i]) {
        unanswered.push(i + 1);
      }
    }

    if (unanswered.length > 0) {
      toast.error(`Please answer all questions. Unanswered: ${unanswered.join(', ')}`);
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert selectedAnswers object to array
      const answersArray = [];
      for (let i = 0; i < quiz.questions.length; i++) {
        answersArray.push(selectedAnswers[i] || '');
      }

      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/api/quizzes/${quiz._id}/submit`,
        { answers: answersArray },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setResults(response.data);
      setShowResults(true);
      
      if (response.data.pointsAwarded > 0) {
        toast.success(`🎉 Quiz completed! You earned ${response.data.pointsAwarded} points!`);
      } else {
        toast.success('Quiz submitted successfully!');
      }

      if (onComplete) {
        onComplete(response.data);
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error(error.response?.data?.message || 'Failed to submit quiz');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAnswerClass = (option) => {
    if (!showResults) {
      return selectedAnswers[currentQuestion] === option
        ? 'bg-blue-600 text-white border-blue-600'
        : 'bg-gray-800 hover:bg-gray-700 text-white border-gray-600';
    }

    // Show results
    const question = quiz.questions[currentQuestion];
    const isCorrectAnswer = option === question.correctAnswer;
    const isSelected = selectedAnswers[currentQuestion] === option;

    if (isCorrectAnswer) {
      return 'bg-green-600 text-white border-green-600';
    }
    if (isSelected && !isCorrectAnswer) {
      return 'bg-red-600 text-white border-red-600';
    }
    return 'bg-gray-800 text-gray-400 border-gray-600';
  };

  if (showResults) {
    return (
      <div className="max-w-2xl mx-auto p-6 animate-fadeIn">
        <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-2xl p-8 border border-purple-500/30">
          <div className="text-center mb-8">
            <FaTrophy className="text-yellow-400 text-6xl mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">Quiz Completed!</h2>
            <p className="text-gray-300">Here are your results</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-sm mb-1">Your Score</p>
              <p className="text-3xl font-bold text-white">{results.percentage}%</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-sm mb-1">Correct Answers</p>
              <p className="text-3xl font-bold text-green-400">
                {results.correctAnswers}/{results.totalQuestions}
              </p>
            </div>
          </div>

          {results.pointsAwarded > 0 && (
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 mb-6 text-center">
              <p className="text-yellow-400 font-semibold">
                🎉 You earned {results.pointsAwarded} Learning Points!
              </p>
            </div>
          )}

          {results.alreadyCompleted && (
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 mb-6 text-center">
              <p className="text-blue-400">
                You've already completed this quiz before. Points are awarded only once.
              </p>
            </div>
          )}

          <div className="space-y-4 mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">Review Answers:</h3>
            {quiz.questions.map((question, index) => {
              const result = results.results[index];
              return (
                <div key={index} className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-start gap-3 mb-2">
                    {result.isCorrect ? (
                      <FaCheckCircle className="text-green-400 text-xl mt-1 flex-shrink-0" />
                    ) : (
                      <FaTimesCircle className="text-red-400 text-xl mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-white font-medium mb-2">
                        {index + 1}. {question.ques}
                      </p>
                      <p className="text-sm mb-1">
                        <span className="text-gray-400">Your answer: </span>
                        <span className={result.isCorrect ? 'text-green-400' : 'text-red-400'}>
                          {result.selectedAnswer}
                        </span>
                      </p>
                      {!result.isCorrect && (
                        <p className="text-sm">
                          <span className="text-gray-400">Correct answer: </span>
                          <span className="text-green-400">{question.correctAnswer}</span>
                        </p>
                      )}
                      {question.explanation && (
                        <p className="text-sm text-gray-300 mt-2 italic">
                          💡 {question.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => {
              setShowResults(false);
              setCurrentQuestion(0);
              setSelectedAnswers({});
              setResults(null);
            }}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
          >
            Review Questions Again
          </button>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div
        key={currentQuestion}
        className="bg-gray-900/50 rounded-2xl p-8 border border-gray-700 mb-6 animate-slideIn"
      >
          <h3 className="text-2xl font-semibold text-white mb-6">
            {question.ques}
          </h3>

          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={showResults}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${getAnswerClass(
                  option
                )}`}
              >
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm font-semibold">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1">{option}</span>
                </div>
              </button>
            ))}
          </div>

          {showResults && question.explanation && (
            <div className="mt-4 p-4 bg-blue-900/30 border border-blue-500/30 rounded-lg">
              <p className="text-blue-300">
                <strong>Explanation:</strong> {question.explanation}
              </p>
            </div>
          )}
        </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center gap-4">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Previous
        </button>

        <div className="flex gap-2">
          {quiz.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentQuestion
                  ? 'bg-purple-600 w-8'
                  : selectedAnswers[index]
                  ? 'bg-green-600'
                  : 'bg-gray-600'
              }`}
            />
          ))}
        </div>

        {currentQuestion === quiz.questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizTaker;
