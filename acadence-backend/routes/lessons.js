import express from 'express';
import Lesson from '../models/Lesson.js';
import Course from '../models/Course.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all lessons for a specific course
router.get('/course/:courseId', authenticateToken, async (req, res) => {
  try {
    // First check if the course belongs to the user
    const course = await Course.findOne({
      _id: req.params.courseId,
      userId: req.user.userId
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const lessons = await Lesson.find({ courseId: req.params.courseId })
      .sort({ createdAt: 1 });

    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific lesson
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Check if the lesson belongs to a course owned by the user
    const course = await Course.findOne({
      _id: lesson.courseId,
      userId: req.user.userId
    });

    if (!course) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    res.json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new lesson
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { courseId, title, content, points } = req.body;

    // Check if the course belongs to the user
    const course = await Course.findOne({
      _id: courseId,
      userId: req.user.userId
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const lesson = new Lesson({
      courseId,
      title,
      content,
      points: points || 10
    });

    await lesson.save();

    // Update the total lessons count in the course
    course.totalLessons += 1;
    await course.save();

    res.status(201).json({
      message: 'Lesson created successfully',
      lesson
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a lesson
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, content, points, completed } = req.body;

    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Check if the lesson belongs to a course owned by the user
    const course = await Course.findOne({
      _id: lesson.courseId,
      userId: req.user.userId
    });

    if (!course) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    const updatedLesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      { title, content, points, completed },
      { new: true, runValidators: true }
    );

    // If lesson is marked as completed and it wasn't completed before, update completed lessons count
    if (completed && !lesson.completed) {
      course.completedLessons = (course.completedLessons || 0) + 1;
      await course.save();
    } else if (!completed && lesson.completed) {
      // If lesson is marked as incomplete and it was completed before, decrease the count
      course.completedLessons = Math.max(0, (course.completedLessons || 0) - 1);
      await course.save();
    }

    res.json({
      message: 'Lesson updated successfully',
      lesson: updatedLesson
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a lesson
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Check if the lesson belongs to a course owned by the user
    const course = await Course.findOne({
      _id: lesson.courseId,
      userId: req.user.userId
    });

    if (!course) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    await Lesson.findByIdAndDelete(req.params.id);

    // Update the total lessons count in the course
    course.totalLessons = Math.max(0, (course.totalLessons || 0) - 1);
    
    // If the lesson was completed, also decrease the completed lessons count
    if (lesson.completed) {
      course.completedLessons = Math.max(0, (course.completedLessons || 0) - 1);
    }
    
    await course.save();

    res.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark lesson as completed
router.patch('/:id/complete', authenticateToken, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Check if the lesson belongs to a course owned by the user
    const course = await Course.findOne({
      _id: lesson.courseId,
      userId: req.user.userId
    });

    if (!course) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Update lesson completion status
    lesson.completed = true;
    await lesson.save();

    // Update course completion stats
    if (!course.completedLessons) {
      course.completedLessons = 0;
    }
    
    if (!lesson.completed) { // If it wasn't already completed
      course.completedLessons += 1;
      await course.save();
    }

    res.json({
      message: 'Lesson marked as completed',
      lesson
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;