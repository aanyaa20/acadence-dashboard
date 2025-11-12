import express from 'express';
import Lesson from '../models/Lesson.js';
import Course from '../models/Course.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all lessons for a specific course
router.get('/course/:courseId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId;
    
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

    // Add completion status for current user
    const lessonsWithUserStatus = lessons.map(lesson => {
      const lessonObj = lesson.toObject();
      lessonObj.completedByCurrentUser = lesson.completedBy.some(
        id => id.toString() === userId.toString()
      );
      return lessonObj;
    });

    res.json(lessonsWithUserStatus);
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

// Toggle lesson completion (mark/unmark as complete)
router.patch('/:id/complete', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId;
    const { isCompleting } = req.body; // true = mark complete, false = mark incomplete
    
    console.log(`🎯 ${isCompleting ? 'Completing' : 'Uncompleting'} lesson for user:`, userId);
    
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    console.log("📚 Lesson found:", lesson.title);

    // Check if user already completed this lesson
    const alreadyCompleted = lesson.completedBy.some(
      id => id.toString() === userId.toString()
    );

    console.log("✅ Already completed?", alreadyCompleted);

    let pointsChange = 0;
    let action = '';

    // MARK AS COMPLETE
    if (isCompleting && !alreadyCompleted) {
      console.log("➕ Marking as complete");
      
      // Add user to completedBy array
      lesson.completedBy.push(userId);
      lesson.completed = true;
      await lesson.save();

      // Update course completion stats
      const course = await Course.findById(lesson.courseId);
      if (course) {
        course.completedLessons = (course.completedLessons || 0) + 1;
        await course.save();
        console.log(`📈 Course progress: ${course.completedLessons} lessons completed`);
      }

      // Award points and update streak
      const User = (await import('../models/User.js')).default;
      const user = await User.findById(userId);
      console.log("👤 Looking for user with ID:", userId);
      console.log("👤 User found:", user ? `Yes - ${user.name}` : "NO USER FOUND!");
      
      if (user) {
        const oldPoints = user.totalPoints;
        user.totalPoints += 5;
        pointsChange = 5;
        console.log(`🎁 Awarded 5 points. Old: ${oldPoints} → New: ${user.totalPoints}`);
        
        // Update streak - this now happens on EVERY lesson completion
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Find or create today's activity log
        let todayActivity = user.activityLog.find(log => {
          const logDate = new Date(log.date);
          logDate.setHours(0, 0, 0, 0);
          return logDate.getTime() === today.getTime();
        });
        
        if (todayActivity) {
          todayActivity.lessonsCompleted += 1;
        } else {
          // New day - add activity log
          user.activityLog.push({
            date: today,
            lessonsCompleted: 1
          });
          
          // Calculate streak
          if (user.lastActivityDate) {
            const lastActivity = new Date(user.lastActivityDate);
            lastActivity.setHours(0, 0, 0, 0);
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (lastActivity.getTime() === yesterday.getTime()) {
              user.currentStreak += 1;
              console.log(`🔥 Streak continued! Now at ${user.currentStreak} days`);
            } else if (lastActivity.getTime() === today.getTime()) {
              // Same day, don't change streak
            } else {
              user.currentStreak = 1;
              console.log(`🔥 New streak started!`);
            }
          } else {
            user.currentStreak = 1;
            console.log(`🔥 First streak day!`);
          }
          
          if (user.currentStreak > user.longestStreak) {
            user.longestStreak = user.currentStreak;
            console.log(`🏆 New longest streak: ${user.longestStreak}`);
          }
          
          user.lastActivityDate = today;
        }
        
        await user.save();
        console.log("💾 User saved successfully with new points!");
      } else {
        console.log("❌ ERROR: User not found, cannot award points!");
      }
      action = 'completed';
    } 
    // MARK AS INCOMPLETE
    else if (!isCompleting && alreadyCompleted) {
      console.log("➖ Unmarking as complete");
      
      // Remove user from completedBy array
      lesson.completedBy = lesson.completedBy.filter(
        id => id.toString() !== userId.toString()
      );
      
      // If no one has completed it, mark lesson as incomplete
      if (lesson.completedBy.length === 0) {
        lesson.completed = false;
      }
      await lesson.save();

      // Update course completion stats
      const course = await Course.findById(lesson.courseId);
      if (course) {
        course.completedLessons = Math.max(0, (course.completedLessons || 0) - 1);
        await course.save();
        console.log(`📉 Course progress: ${course.completedLessons} lessons completed`);
      }

      // Deduct points (but don't go negative)
      const User = (await import('../models/User.js')).default;
      const user = await User.findById(userId);
      if (user) {
        user.totalPoints = Math.max(0, user.totalPoints - 5);
        pointsChange = -5;
        console.log(`💸 Deducted 5 points. New total: ${user.totalPoints}`);
        
        // Decrease today's lesson count
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayActivity = user.activityLog.find(log => {
          const logDate = new Date(log.date);
          logDate.setHours(0, 0, 0, 0);
          return logDate.getTime() === today.getTime();
        });
        
        if (todayActivity && todayActivity.lessonsCompleted > 0) {
          todayActivity.lessonsCompleted -= 1;
        }
        
        await user.save();
      }
      action = 'unmarked';
    } else {
      action = 'no_change';
    }

    // Get updated lesson with user status
    const updatedLesson = await Lesson.findById(req.params.id);
    const isCompleted = updatedLesson.completedBy.some(
      id => id.toString() === userId.toString()
    );

    res.json({
      message: action === 'completed' ? 'Lesson marked as completed' : 
               action === 'unmarked' ? 'Lesson marked as incomplete' : 
               'No change made',
      lesson: updatedLesson,
      isCompleted,
      pointsChange,
      action
    });
  } catch (error) {
    console.error("❌ Error toggling lesson completion:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;