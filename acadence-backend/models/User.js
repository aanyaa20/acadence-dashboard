import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  profilePhoto: {
    type: String,
    default: null
  },
  resetPasswordToken: {
    type: String,
    default: null
  },
  resetPasswordExpires: {
    type: Date,
    default: null
  },
  theme: {
    type: String,
    enum: ['light', 'dark'],
    default: 'light'
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  activityLog: [{
    date: {
      type: Date,
      default: Date.now
    },
    lessonsCompleted: {
      type: Number,
      default: 0
    }
  }],
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  lastActivityDate: {
    type: Date
  }
}, {
  timestamps: true // This adds createdAt and updatedAt automatically
});

export default mongoose.model('User', userSchema);