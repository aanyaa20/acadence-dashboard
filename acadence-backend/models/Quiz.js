import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  questions: [{
    ques: {
      type: String,
      required: true
    },
    options: [{
      type: String
    }],
    correctAnswer: {
      type: String,
      required: true
    },
    explanation: {
      type: String
    }
  }],
  score: {
    type: Number,
    required: true
  },
  attempts: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    score: Number,
    totalQuestions: Number,
    answers: [{
      questionIndex: Number,
      selectedAnswer: String,
      isCorrect: Boolean
    }],
    completedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true // This adds createdAt and updatedAt automatically
});

export default mongoose.model('Quiz', quizSchema);