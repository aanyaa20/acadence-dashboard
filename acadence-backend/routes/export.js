import express from 'express';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import Quiz from '../models/Quiz.js';

const router = express.Router();

// Export all data as JSON
router.get('/all', async (req, res) => {
  try {
    const users = await User.find({}).select('-password').lean();
    const courses = await Course.find({}).lean();
    const lessons = await Lesson.find({}).lean();
    const quizzes = await Quiz.find({}).lean();

    const data = {
      database: 'acadence_db',
      exportDate: new Date().toISOString(),
      collections: {
        users: {
          count: users.length,
          data: users
        },
        courses: {
          count: courses.length,
          data: courses
        },
        lessons: {
          count: lessons.length,
          data: lessons
        },
        quizzes: {
          count: quizzes.length,
          data: quizzes
        }
      },
      summary: {
        totalUsers: users.length,
        totalCourses: courses.length,
        totalLessons: lessons.length,
        totalQuizzes: quizzes.length
      }
    };

    res.json(data);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ message: 'Export failed', error: error.message });
  }
});

// Export users only
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}).select('-password').lean();
    res.json({ count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ message: 'Export failed', error: error.message });
  }
});

// Export courses only
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find({}).lean();
    res.json({ count: courses.length, data: courses });
  } catch (error) {
    res.status(500).json({ message: 'Export failed', error: error.message });
  }
});

export default router;
