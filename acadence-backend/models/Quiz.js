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
    answer: {
      type: String,
      required: true
    }
  }], // Array of question objects
  score: {
    type: Number,
    required: true // Key score for the quiz
  }
}, {
  timestamps: true // This adds createdAt and updatedAt automatically
});

export default mongoose.model('Quiz', quizSchema);