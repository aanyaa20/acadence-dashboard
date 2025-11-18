import express from 'express';
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import Quiz from '../models/Quiz.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all courses for the authenticated user (alias route)
router.get('/user', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId;
    const courses = await Course.find({ userId: userId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all courses for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    console.log('📨 GET /api/courses - Fetching user courses');
    const userId = req.user.id || req.user.userId;
    console.log('👤 User ID:', userId);
    
    const courses = await Course.find({ userId: userId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    
    console.log(`✅ Found ${courses.length} courses for user ${userId}`);
    res.json(courses);
  } catch (error) {
    console.error('❌ Error in GET /api/courses:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: error.message, error: error.toString() });
  }
});

// Get a specific course
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId;
    const course = await Course.findOne({
      _id: req.params.id,
      userId: userId
    }).populate('userId', 'name email');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new course
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, topic, description } = req.body;
    const userId = req.user.id || req.user.userId;

    const course = new Course({
      userId: userId,
      title,
      topic,
      description
    });

    await course.save();

    res.status(201).json({
      message: 'Course created successfully',
      course
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a course
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, topic, description } = req.body;
    const userId = req.user.id || req.user.userId;

    const updatedCourse = await Course.findOneAndUpdate(
      { _id: req.params.id, userId: userId },
      { title, topic, description },
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({
      message: 'Course updated successfully',
      course: updatedCourse
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a course and all its associated lessons and quizzes
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId;
    const course = await Course.findOneAndDelete({
      _id: req.params.id,
      userId: userId
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Delete all lessons associated with this course
    await Lesson.deleteMany({ courseId: req.params.id });

    // Delete all quizzes associated with this course
    await Quiz.deleteMany({ courseId: req.params.id });

    res.json({ message: 'Course and associated lessons and quizzes deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;