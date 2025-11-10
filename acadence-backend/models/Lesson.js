import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
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
  content: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    default: 1
  },
  duration: {
    type: String,
    trim: true
  },
  points: {
    type: Number,
    default: 10
  },
  videoSearchTerm: {
    type: String,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true // This adds createdAt and updatedAt automatically
});

export default mongoose.model('Lesson', lessonSchema);