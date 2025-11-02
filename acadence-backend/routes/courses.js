import express from 'express';
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import Quiz from '../models/Quiz.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all courses for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const courses = await Course.find({ userId: req.user.userId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific course
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.id,
      userId: req.user.userId
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

    const course = new Course({
      userId: req.user.userId,
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

    const updatedCourse = await Course.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
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
    const course = await Course.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
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