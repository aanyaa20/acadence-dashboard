import express from "express";
import { getCourseGenerationModel } from "../config/gemini.js";
import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";
import Quiz from "../models/Quiz.js";
import { authenticateToken } from "../middleware/auth.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Helper to log to file
function logToFile(message) {
  const logPath = path.join(__dirname, "..", "debug.log");
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logPath, `[${timestamp}] ${message}\n`);
}

// Detailed prompt template for comprehensive course generation
const createCoursePrompt = (topic, difficulty, numberOfLessons) => {
  return `Generate a COMPREHENSIVE and DETAILED course on "${topic}" (${difficulty} level).

CRITICAL RULES:
1. Respond with ONLY valid JSON - no markdown, no code blocks, no extra text
2. Make content DETAILED and educational
3. Each lesson: 500-800 words with thorough explanations, examples, and code snippets
4. Include relevant YouTube search terms for each lesson
5. Description: 150-200 words
6. Quiz: 5-10 challenging questions with detailed answers

Generate exactly ${numberOfLessons} lessons.

JSON format:
{
  "course": {
    "title": "Course title",
    "topic": "${topic}",
    "description": "Comprehensive 150-200 word description covering what students will learn",
    "difficulty": "${difficulty}",
    "estimatedDuration": "e.g. 4-6 hours",
    "learningObjectives": ["objective 1", "objective 2", "objective 3", "objective 4", "objective 5"]
  },
  "lessons": [
    {
      "title": "Lesson title",
      "content": "DETAILED 500-800 word lesson content with thorough explanations, real-world examples, code snippets (if applicable), best practices, and practical tips. Include headings, bullet points, and structured content.",
      "order": 1,
      "points": 20,
      "duration": "30-45 minutes",
      "videoSearchTerm": "Relevant YouTube search term for this lesson"
    }
  ],
  "quiz": {
    "title": "Quiz title",
    "description": "What the quiz covers",
    "questions": [
      {
        "ques": "Detailed question text testing understanding?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": "Option B",
        "explanation": "Why this answer is correct (2-3 sentences)"
      }
    ],
    "score": 50
  }
}

- Include 5-10 challenging quiz questions with 4 options each
- Make content DETAILED and comprehensive
- Include practical examples and explanations
- Provide video search terms for multimedia learning

Generate now. Return ONLY the JSON object.`;
};

// POST /api/generate-course - Generate a new course using Gemini AI
router.post("/", authenticateToken, async (req, res) => {
  const separator = "\n" + "=".repeat(80);
  console.log(separator);
  console.log("🔥 GENERATE COURSE REQUEST RECEIVED");
  console.log("=".repeat(80));
  
  logToFile(separator);
  logToFile("🔥 GENERATE COURSE REQUEST RECEIVED");
  logToFile("=".repeat(80));
  
  try {
    console.log("Request Body:", JSON.stringify(req.body, null, 2));
    console.log("User from token:", JSON.stringify(req.user, null, 2));
    
    logToFile("Request Body: " + JSON.stringify(req.body, null, 2));
    logToFile("User from token: " + JSON.stringify(req.user, null, 2));
    
    const { topic, difficulty = "beginner", numberOfLessons = 5 } = req.body;
    const userId = req.user.id || req.user.userId;

    console.log("Extracted userId:", userId);

    // Validate input
    if (!topic || topic.trim() === "") {
      console.log("❌ Validation failed: topic is required");
      return res.status(400).json({ error: "Course topic is required" });
    }

    if (numberOfLessons < 3 || numberOfLessons > 10) {
      console.log("❌ Validation failed: invalid number of lessons");
      return res.status(400).json({ 
        error: "Number of lessons must be between 3 and 10" 
      });
    }

    const validDifficulties = ["beginner", "intermediate", "advanced"];
    if (!validDifficulties.includes(difficulty.toLowerCase())) {
      console.log("❌ Validation failed: invalid difficulty");
      return res.status(400).json({ 
        error: "Difficulty must be: beginner, intermediate, or advanced" 
      });
    }

    console.log(`📚 Generating course: ${topic} (${difficulty}) with ${numberOfLessons} lessons for user ${userId}...`);

    // Get Gemini model
    console.log("🤖 Getting Gemini model...");
    const model = getCourseGenerationModel();

    // Generate course content with retry logic for 503 errors
    console.log("📝 Sending prompt to Gemini...");
    const prompt = createCoursePrompt(topic, difficulty, numberOfLessons);
    
    let result;
    const maxRetries = 3;
    let retryCount = 0;
    let lastError;
    
    while (retryCount < maxRetries) {
      try {
        console.log(`🔄 Attempt ${retryCount + 1} of ${maxRetries}...`);
        result = await model.generateContent(prompt);
        console.log("✅ Gemini API response received");
        break; // Success! Exit the retry loop
      } catch (geminiError) {
        lastError = geminiError;
        retryCount++;
        
        // Check if it's a 503 (overloaded) or rate limit error
        const isOverloaded = geminiError.message?.includes('503') || 
                            geminiError.message?.includes('overloaded') ||
                            geminiError.message?.includes('Service Unavailable');
        
        const isRateLimit = geminiError.message?.includes('429') || 
                           geminiError.message?.includes('rate limit');
        
        console.error(`❌ Gemini API Error (Attempt ${retryCount}/${maxRetries}):`, geminiError.message);
        
        if ((isOverloaded || isRateLimit) && retryCount < maxRetries) {
          // Exponential backoff: 2s, 4s, 8s
          const waitTime = Math.pow(2, retryCount) * 1000;
          console.log(`⏳ Model is overloaded. Waiting ${waitTime/1000} seconds before retry...`);
          logToFile(`⏳ Retry ${retryCount}: Waiting ${waitTime/1000}s due to ${isOverloaded ? '503' : '429'} error`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        } else if (retryCount >= maxRetries) {
          console.error("❌ Max retries reached. Giving up.");
          logToFile("❌ Max retries reached");
        } else {
          // For other errors, don't retry
          break;
        }
      }
    }
    
    // If we exhausted all retries, return error
    if (!result) {
      console.error("❌ Failed after all retries:", lastError.message);
      return res.status(503).json({ 
        error: "AI service is temporarily overloaded. Please try again in a few moments.",
        details: "The Gemini API is experiencing high traffic. We've attempted multiple retries but the service is still unavailable.",
        suggestion: "Please wait 30-60 seconds and try again.",
        technicalDetails: lastError.message 
      });
    }

    const responseText = result.response.text();
    console.log("📄 Response text length:", responseText.length);
    console.log("First 500 chars:", responseText.substring(0, 500));
    console.log("Last 500 chars:", responseText.substring(responseText.length - 500));
    
    logToFile("Response length: " + responseText.length);
    logToFile("First 1000 chars: " + responseText.substring(0, 1000));
    logToFile("Last 500 chars: " + responseText.substring(responseText.length - 500));

    // Parse JSON response
    let courseData;
    try {
      // More aggressive cleaning of markdown and extra text
      let cleanedResponse = responseText.trim();
      
      // Remove markdown code blocks
      cleanedResponse = cleanedResponse.replace(/```json\s*/gi, "");
      cleanedResponse = cleanedResponse.replace(/```\s*/g, "");
      
      // Find the first { and last }
      const firstBrace = cleanedResponse.indexOf('{');
      const lastBrace = cleanedResponse.lastIndexOf('}');
      
      if (firstBrace === -1 || lastBrace === -1) {
        throw new Error("No valid JSON found in response");
      }
      
      cleanedResponse = cleanedResponse.substring(firstBrace, lastBrace + 1);
      
      console.log("🧹 Cleaned response length:", cleanedResponse.length);
      console.log("🧹 First 300 chars:", cleanedResponse.substring(0, 300));
      
      logToFile("Cleaned response length: " + cleanedResponse.length);
      
      courseData = JSON.parse(cleanedResponse);
      console.log("✅ JSON parsed successfully");
      logToFile("✅ JSON parsed successfully");
    } catch (parseError) {
      console.error("❌ Failed to parse Gemini response");
      console.error("Parse error:", parseError.message);
      console.error("Parse error position:", parseError.message.match(/position (\d+)/)?.[1]);
      
      logToFile("❌ Parse error: " + parseError.message);
      logToFile("Full response: " + responseText);
      
      return res.status(500).json({ 
        error: "Failed to parse AI response. Please try again.",
        details: parseError.message,
        responsePreview: responseText.substring(0, 200)
      });
    }

    // Validate the structure
    console.log("🔍 Validating course structure...");
    console.log("courseData keys:", Object.keys(courseData));
    
    if (!courseData.course || !courseData.lessons || !courseData.quiz) {
      console.error("❌ Invalid structure. Has course?", !!courseData.course, "Has lessons?", !!courseData.lessons, "Has quiz?", !!courseData.quiz);
      return res.status(500).json({ 
        error: "Invalid course structure generated. Please try again.",
        structure: {
          hasCourse: !!courseData.course,
          hasLessons: !!courseData.lessons,
          hasQuiz: !!courseData.quiz
        }
      });
    }

    console.log("✅ Structure validated");
    console.log("Course data:", JSON.stringify(courseData.course, null, 2));

    // Create the course in the database
    console.log("💾 Creating course in database...");
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

    try {
      await course.save();
      console.log(`✅ Course created: ${course._id}`);
    } catch (dbError) {
      console.error("❌ Database error saving course:", dbError);
      throw dbError;
    }

    // Create lessons
    console.log(`💾 Creating ${courseData.lessons.length} lessons...`);
    const lessonPromises = courseData.lessons.map((lessonData, index) => {
      console.log(`  - Lesson ${index + 1}: ${lessonData.title}`);
      const lesson = new Lesson({
        courseId: course._id,
        title: lessonData.title,
        content: lessonData.content,
        order: lessonData.order || index + 1,
        points: lessonData.points || 10,
        duration: lessonData.duration,
        videoSearchTerm: lessonData.videoSearchTerm,
        completed: false,
        completedBy: [],
      });
      return lesson.save();
    });

    let savedLessons;
    try {
      savedLessons = await Promise.all(lessonPromises);
      console.log(`✅ ${savedLessons.length} lessons created`);
    } catch (lessonError) {
      console.error("❌ Error saving lessons:", lessonError);
      throw lessonError;
    }

    // Create quiz
    console.log("💾 Creating quiz...");
    console.log("Quiz data:", JSON.stringify(courseData.quiz, null, 2));
    
    const quiz = new Quiz({
      courseId: course._id,
      title: courseData.quiz.title,
      description: courseData.quiz.description,
      questions: courseData.quiz.questions.map((q) => ({
        ques: q.ques,
        options: q.options || [],
        correctAnswer: q.correctAnswer || q.answer,
        explanation: q.explanation || '',
      })),
      score: courseData.quiz.score || 100,
      attempts: [],
    });

    try {
      await quiz.save();
      console.log(`✅ Quiz created: ${quiz._id}`);
    } catch (quizError) {
      console.error("❌ Error saving quiz:", quizError);
      throw quizError;
    }

    // Return the complete course data
    console.log("🎉 Course generation complete!");
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
    console.error("Error stack:", error.stack);
    console.error("Error name:", error.name);
    console.error("Error details:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    
    logToFile("❌ ERROR: " + error.message);
    logToFile("Stack: " + error.stack);
    logToFile("Name: " + error.name);
    
    res.status(500).json({ 
      error: "Failed to generate course",
      details: error.message,
      errorType: error.name
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
