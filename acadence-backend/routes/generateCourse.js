import express from "express";
import { getCourseGenerationModel } from "../config/gemini.js";
import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";
import Quiz from "../models/Quiz.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Detailed prompt template for course generation
const createCoursePrompt = (topic, difficulty, numberOfLessons) => {
  return `You are an expert educational content creator. Generate a comprehensive course on the topic: "${topic}" with difficulty level: "${difficulty}".

CRITICAL INSTRUCTIONS:
1. You MUST respond ONLY with valid JSON. No additional text, explanation, or markdown formatting.
2. The JSON must be parseable and follow the exact structure specified below.
3. Generate exactly ${numberOfLessons} lessons for this course.
4. Each lesson should have substantial educational content (minimum 300 words).
5. Create exactly 1 quiz with 5 questions related to the entire course content.

REQUIRED JSON STRUCTURE (respond with ONLY this JSON, nothing else):
{
  "course": {
    "title": "string - The complete course title",
    "topic": "string - The main topic/subject",
    "description": "string - A comprehensive course description (100-200 words)",
    "difficulty": "string - beginner, intermediate, or advanced",
    "estimatedDuration": "string - Estimated time to complete (e.g., '4 hours', '2 weeks')",
    "learningObjectives": ["string - objective 1", "string - objective 2", "string - objective 3"]
  },
  "lessons": [
    {
      "title": "string - Lesson title",
      "content": "string - Detailed lesson content with explanations, examples, and educational material (minimum 300 words). Use proper formatting with paragraphs.",
      "order": number - Sequential number starting from 1,
      "points": number - Points awarded for completing this lesson (10-50),
      "duration": "string - Estimated time (e.g., '30 minutes')"
    }
  ],
  "quiz": {
    "title": "string - Quiz title for the entire course",
    "description": "string - Brief description of what the quiz covers",
    "questions": [
      {
        "ques": "string - The question text",
        "answer": "string - The correct answer with brief explanation"
      }
    ],
    "score": number - Total points for the quiz (50-100)
  }
}

IMPORTANT VALIDATION RULES:
- All lessons must be in the "lessons" array (exactly ${numberOfLessons} lessons)
- Quiz must contain exactly 5 questions
- All string fields must be non-empty
- All content must be educational and professional
- Lesson content must be comprehensive and detailed
- Questions should test understanding of the course material
- Answers should include brief explanations

Generate the course now. Remember: ONLY output the JSON structure, nothing else.`;
};

// POST /api/generate-course - Generate a new course using Gemini AI
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { topic, difficulty = "beginner", numberOfLessons = 5 } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!topic || topic.trim() === "") {
      return res.status(400).json({ error: "Course topic is required" });
    }

    if (numberOfLessons < 3 || numberOfLessons > 15) {
      return res.status(400).json({ 
        error: "Number of lessons must be between 3 and 15" 
      });
    }

    const validDifficulties = ["beginner", "intermediate", "advanced"];
    if (!validDifficulties.includes(difficulty.toLowerCase())) {
      return res.status(400).json({ 
        error: "Difficulty must be: beginner, intermediate, or advanced" 
      });
    }

    console.log(`📚 Generating course: ${topic} (${difficulty}) with ${numberOfLessons} lessons...`);

    // Get Gemini model
    const model = getCourseGenerationModel();

    // Generate course content
    const prompt = createCoursePrompt(topic, difficulty, numberOfLessons);
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Parse JSON response
    let courseData;
    try {
      // Remove markdown code blocks if present
      const cleanedResponse = responseText
        .replace(/```json\s*/g, "")
        .replace(/```\s*/g, "")
        .trim();
      
      courseData = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("❌ Failed to parse Gemini response:", responseText);
      return res.status(500).json({ 
        error: "Failed to parse AI response. Please try again.",
        details: parseError.message 
      });
    }

    // Validate the structure
    if (!courseData.course || !courseData.lessons || !courseData.quiz) {
      return res.status(500).json({ 
        error: "Invalid course structure generated. Please try again." 
      });
    }

    // Create the course in the database
    const course = new Course({
      userId,
      title: courseData.course.title,
      topic: courseData.course.topic,
      description: courseData.course.description,
      difficulty: courseData.course.difficulty || difficulty,
      estimatedDuration: courseData.course.estimatedDuration,
      learningObjectives: courseData.course.learningObjectives || [],
      totalLessons: courseData.lessons.length,
      completedLessons: 0,
    });

    await course.save();
    console.log(`✅ Course created: ${course._id}`);

    // Create lessons
    const lessonPromises = courseData.lessons.map((lessonData, index) => {
      const lesson = new Lesson({
        courseId: course._id,
        title: lessonData.title,
        content: lessonData.content,
        order: lessonData.order || index + 1,
        points: lessonData.points || 10,
        duration: lessonData.duration,
        completed: false,
      });
      return lesson.save();
    });

    const savedLessons = await Promise.all(lessonPromises);
    console.log(`✅ ${savedLessons.length} lessons created`);

    // Create quiz
    const quiz = new Quiz({
      courseId: course._id,
      title: courseData.quiz.title,
      description: courseData.quiz.description,
      questions: courseData.quiz.questions.map((q) => ({
        ques: q.ques,
        answer: q.answer,
      })),
      score: courseData.quiz.score || 100,
    });

    await quiz.save();
    console.log(`✅ Quiz created: ${quiz._id}`);

    // Return the complete course data
    res.status(201).json({
      message: "Course generated successfully",
      course: {
        ...course.toObject(),
        lessonsCount: savedLessons.length,
        quizId: quiz._id,
      },
      lessons: savedLessons,
      quiz,
    });
  } catch (error) {
    console.error("❌ Error generating course:", error);
    res.status(500).json({ 
      error: "Failed to generate course",
      details: error.message 
    });
  }
});

// POST /api/generate-course/preview - Preview course without saving
router.post("/preview", authenticateToken, async (req, res) => {
  try {
    const { topic, difficulty = "beginner", numberOfLessons = 5 } = req.body;

    if (!topic || topic.trim() === "") {
      return res.status(400).json({ error: "Course topic is required" });
    }

    console.log(`👀 Previewing course: ${topic}`);

    const model = getCourseGenerationModel();
    const prompt = createCoursePrompt(topic, difficulty, numberOfLessons);
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    let courseData;
    try {
      const cleanedResponse = responseText
        .replace(/```json\s*/g, "")
        .replace(/```\s*/g, "")
        .trim();
      
      courseData = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("❌ Failed to parse preview response");
      return res.status(500).json({ 
        error: "Failed to parse AI response",
        details: parseError.message 
      });
    }

    res.json({
      message: "Course preview generated",
      preview: courseData,
    });
  } catch (error) {
    console.error("❌ Error previewing course:", error);
    res.status(500).json({ 
      error: "Failed to preview course",
      details: error.message 
    });
  }
});

export default router;
