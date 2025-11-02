import express from 'express';
import Quiz from '../models/Quiz.js';
import Course from '../models/Course.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all quizzes for a specific course
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

    const quizzes = await Quiz.find({ courseId: req.params.courseId })
      .sort({ createdAt: 1 });

    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific quiz (without answers for security)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Check if the quiz belongs to a course owned by the user
    const course = await Course.findOne({
      _id: quiz.courseId,
      userId: req.user.userId
    });

    if (!course) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Return quiz without answers for security
    const { questions, ...quizData } = quiz.toObject();
    const quizWithoutAnswers = {
      ...quizData,
      questions: questions.map(q => ({
        _id: q._id,
        ques: q.ques
        // Note: answer is intentionally omitted for security
      }))
    };

    res.json(quizWithoutAnswers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new quiz
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { courseId, title, description, questions, score } = req.body;

    // Check if the course belongs to the user
    const course = await Course.findOne({
      _id: courseId,
      userId: req.user.userId
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const quiz = new Quiz({
      courseId,
      title,
      description,
      questions, // Array of question objects: [{ques: "question text", answer: "correct answer"}, ...]
      score
    });

    await quiz.save();

    res.status(201).json({
      message: 'Quiz created successfully',
      quiz
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a quiz
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, description, questions, score } = req.body;

    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Check if the quiz belongs to a course owned by the user
    const course = await Course.findOne({
      _id: quiz.courseId,
      userId: req.user.userId
    });

    if (!course) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      { title, description, questions, score },
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Quiz updated successfully',
      quiz: updatedQuiz
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a quiz
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Check if the quiz belongs to a course owned by the user
    const course = await Course.findOne({
      _id: quiz.courseId,
      userId: req.user.userId
    });

    if (!course) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    await Quiz.findByIdAndDelete(req.params.id);

    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit quiz and check answers
router.post('/:id/submit', authenticateToken, async (req, res) => {
  try {
    const { answers } = req.body; // Array of answer strings in the same order as questions

    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Check if the quiz belongs to a course owned by the user
    const course = await Course.findOne({
      _id: quiz.courseId,
      userId: req.user.userId
    });

    if (!course) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Check answers
    let correctAnswers = 0;
    const questionCount = quiz.questions.length;

    if (answers.length !== questionCount) {
      return res.status(400).json({ message: 'Number of answers does not match number of questions' });
    }

    for (let i = 0; i < questionCount; i++) {
      if (answers[i] && quiz.questions[i].answer.toLowerCase().trim() === answers[i].toLowerCase().trim()) {
        correctAnswers++;
      }
    }

    const score = Math.round((correctAnswers / questionCount) * 100); // Percentage score

    res.json({
      message: 'Quiz submitted successfully',
      score: score,
      correctAnswers,
      totalQuestions: questionCount,
      percentage: Math.round((correctAnswers / questionCount) * 100)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;