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
2. Make content FOCUSED and educational
3. Each lesson: 200-300 words with clear explanations and key examples
4. Include relevant YouTube search terms for each lesson
5. Description: 100-150 words
6. Quiz: 3-5 questions with explanations

Generate exactly ${numberOfLessons} lessons.

JSON format:
{
  "course": {
    "title": "Course title",
    "topic": "${topic}",
    "description": "Comprehensive 100-150 word description covering what students will learn",
    "difficulty": "${difficulty}",
    "estimatedDuration": "e.g. 2-3 hours",
    "learningObjectives": ["objective 1", "objective 2", "objective 3", "objective 4", "objective 5"]
  },
  "lessons": [
    {
      "title": "Lesson title",
      "content": "FOCUSED 200-300 word lesson content with clear explanations, practical examples, code snippets (if applicable), and key takeaways. Include headings, bullet points, and structured content.",
      "order": 1,
      "points": 20,
      "duration": "20-30 minutes",
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
        "answer": "Option B",
        "explanation": "Why this answer is correct (2-3 sentences)"
      }
    ],
    "score": 50
  }
  }
}

- Include exactly 3-5 quiz questions with 4 options each
- Make content FOCUSED and practical
- Include clear examples and explanations
- Provide video search terms for multimedia learning

Generate now. Return ONLY the JSON object. Be concise but educational.`;
};

// POST /api/generate-course - Generate a new course using Gemini AI
router.post("/", authenticateToken, async (req, res) => {
  const separator = "\n" + "=".repeat(80);
  console.log(separator);
  console.log(" GENERATE COURSE REQUEST RECEIVED");
  console.log("=".repeat(80));
  
  logToFile(separator);
  logToFile("🔥 GENERATE COURSE REQUEST RECEIVED");
  logToFile("=".repeat(80));
  
  try {
    console.log("Request Body:", JSON.stringify(req.body, null, 2));
    console.log("User from token:", JSON.stringify(req.user, null, 2));
    
    logToFile("Request Body: " + JSON.stringify(req.body, null, 2));
    logToFile("User from token: " + JSON.stringify(req.user, null, 2));
    
    const { topic, difficulty = "beginner", numberOfLessons = 3 } = req.body;
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
      
      // Find the first { and extract a balanced JSON substring (handles nested braces)
      const firstBrace = cleanedResponse.indexOf('{');
      if (firstBrace === -1) {
        throw new Error("No valid JSON found in response");
      }

      // Extract balanced JSON by scanning for matching closing brace
      let braceCount = 0;
      let endIndex = -1;
      for (let i = firstBrace; i < cleanedResponse.length; i++) {
        const ch = cleanedResponse[i];
        if (ch === '{') braceCount++;
        else if (ch === '}') braceCount--;

        if (braceCount === 0) {
          endIndex = i;
          break;
        }
      }

      if (endIndex === -1) {
        // Couldn't find matching brace - fallback to last '}'
        const lastBrace = cleanedResponse.lastIndexOf('}');
        if (lastBrace === -1) throw new Error('No valid JSON end found');
        endIndex = lastBrace;
      }

      cleanedResponse = cleanedResponse.substring(firstBrace, endIndex + 1);
      
      // Sanitize common issues: smart quotes and trailing commas
      cleanedResponse = cleanedResponse
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u201C\u201D]/g, '"')
        // remove trailing commas before } or ]
        .replace(/,\s*}/g, '}')
        .replace(/,\s*]/g, ']');

      console.log("🧹 Cleaned response length:", cleanedResponse.length);
      console.log("🧹 First 300 chars:", cleanedResponse.substring(0, 300));
      
      logToFile("Cleaned response length: " + cleanedResponse.length);
      
      // Try JSON.parse; if it fails, attempt a couple more tolerant fixes
      try {
        courseData = JSON.parse(cleanedResponse);
      } catch (e) {
        // Second attempt: replace unescaped line breaks inside strings with \n
        const attempt2 = cleanedResponse.replace(/\r\n|\r|\n/g, '\\n');

        // Third attempt: ensure double quotes are used consistently for values in the form "key": 'value'
        const attempt3 = attempt2.replace(/"\s*:\s*'([^']*)'/g, ': "$1"');

        try {
          courseData = JSON.parse(attempt3);
        } catch (e2) {
          // If still failing, throw original parse error to outer catch
          throw e2;
        }
      }
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
      let cleanedResponse = responseText
        .replace(/```json\s*/g, "")
        .replace(/```\s*/g, "")
        .trim();

      const firstBrace = cleanedResponse.indexOf('{');
      if (firstBrace === -1) throw new Error('No JSON found in preview');
      let braceCount = 0;
      let endIndex = -1;
      for (let i = firstBrace; i < cleanedResponse.length; i++) {
        const ch = cleanedResponse[i];
        if (ch === '{') braceCount++;
        else if (ch === '}') braceCount--;
        if (braceCount === 0) { endIndex = i; break; }
      }
      if (endIndex === -1) endIndex = cleanedResponse.lastIndexOf('}');
      cleanedResponse = cleanedResponse.substring(firstBrace, endIndex + 1);

      cleanedResponse = cleanedResponse
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u201C\u201D]/g, '"')
        .replace(/,\s*}/g, '}')
        .replace(/,\s*]/g, ']');

      try {
        courseData = JSON.parse(cleanedResponse);
      } catch (e) {
        const attempt2 = cleanedResponse.replace(/\r\n|\r|\n/g, '\\n');
        courseData = JSON.parse(attempt2);
      }
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

// POST /api/generate-course/quick - Quick course generation with template (no AI parsing issues)
router.post("/quick", authenticateToken, async (req, res) => {
  try {
    const { topic, difficulty = "beginner", numberOfLessons = 5 } = req.body;
    const userId = req.user.id || req.user.userId;

    if (!topic || topic.trim() === "") {
      return res.status(400).json({ error: "Course topic is required" });
    }

    console.log(`⚡ Quick generating course: ${topic} for user ${userId}`);

    // Template-based course structure
    const courseData = {
      course: {
        title: `Complete ${topic.charAt(0).toUpperCase() + topic.slice(1)} Course`,
        topic: topic,
        description: `Master ${topic} with this comprehensive ${difficulty} level course. Learn fundamental concepts, best practices, and hands-on techniques that will help you build real-world projects.`,
        difficulty: difficulty,
        estimatedDuration: `${numberOfLessons * 45} minutes`,
        learningObjectives: [
          `Understand core ${topic} concepts and principles`,
          `Apply ${topic} techniques in practical scenarios`,
          `Build confidence in ${topic} development`,
          `Learn industry best practices and patterns`,
          `Create real-world ${topic} projects`
        ]
      },
      lessons: Array.from({ length: numberOfLessons }, (_, i) => {
        const lessonTopics = {
          1: { title: `Introduction to ${topic}`, content: `<h3>Welcome to ${topic}</h3>\n\nIn this foundational lesson, you'll discover what makes ${topic} essential in today's technology landscape. We'll explore core concepts, terminology, and real-world applications that demonstrate why ${topic} matters.\n\n<h3>What You'll Learn</h3>\n<ul>\n<li><b>Core Definitions:</b> Understanding key ${topic} terminology and concepts</li>\n<li><b>Historical Context:</b> How ${topic} evolved and why it's important today</li>\n<li><b>Practical Applications:</b> Real-world use cases and industry examples</li>\n<li><b>Getting Started:</b> Tools and resources you'll need</li>\n</ul>\n\n<h3>Key Takeaway</h3>\n<b>Foundation First:</b> Mastering ${topic} starts with understanding the fundamentals. Take time to absorb these concepts—they'll serve as building blocks for everything that follows.` },
          2: { title: `Core Concepts in ${topic}`, content: `<h3>Deep Dive into ${topic} Fundamentals</h3>\n\nNow that you understand the basics, let's explore the core principles that power ${topic}. This lesson focuses on practical techniques and patterns used by professionals.\n\n<h3>Essential Concepts</h3>\n<ul>\n<li><b>Key Principles:</b> The fundamental rules and best practices in ${topic}</li>\n<li><b>Common Patterns:</b> Proven approaches used across ${topic} projects</li>\n<li><b>Problem-Solving:</b> How to think through ${topic} challenges</li>\n<li><b>Code Examples:</b> Practical demonstrations of concepts in action</li>\n</ul>\n\n<h3>Hands-On Learning</h3>\nTheory meets practice here. Work through examples, experiment with concepts, and build your intuition for ${topic}. The more you practice, the more natural it becomes.\n\n<b>Pro Tip:</b> Don't just read—actually try implementing these concepts yourself!` },
          3: { title: `Advanced ${topic} Techniques`, content: `<h3>Level Up Your ${topic} Skills</h3>\n\nYou've got the foundations—now let's explore advanced techniques that separate beginners from professionals in ${topic}.\n\n<h3>Advanced Topics</h3>\n<ul>\n<li><b>Optimization:</b> Making your ${topic} implementations faster and more efficient</li>\n<li><b>Best Practices:</b> Industry-standard approaches to ${topic}</li>\n<li><b>Common Pitfalls:</b> Mistakes to avoid and how to fix them</li>\n<li><b>Real Projects:</b> Applying ${topic} to production-quality applications</li>\n</ul>\n\n<h3>Building Expertise</h3>\nMastery comes from deliberate practice. Apply these advanced concepts to your own projects, experiment with different approaches, and learn from both successes and failures.\n\n<b>Next Steps:</b> Combine everything you've learned to build complete ${topic} projects!` }
        };
        
        const lessonData = lessonTopics[i + 1] || lessonTopics[1];
        
        return {
          title: lessonData.title,
          content: lessonData.content,
          order: i + 1,
          points: 20,
          duration: "45 minutes",
          videoSearchTerm: `${topic} tutorial lesson ${i + 1}`
        };
      }),
      quiz: {
        title: `${topic.charAt(0).toUpperCase() + topic.slice(1)} Quiz`,
        description: `Test your knowledge of ${topic} concepts`,
        questions: [
          {
            ques: `What is the most important concept in ${topic}?`,
            options: ["Understanding fundamentals", "Skipping basics", "Ignoring best practices", "Avoiding practice"],
            answer: "Understanding fundamentals",
            explanation: "Building a strong foundation with fundamentals is crucial for success in any subject."
          },
          {
            ques: `How should you approach learning ${topic}?`,
            options: ["Rush through content", "Practice consistently", "Skip exercises", "Memorize without understanding"],
            answer: "Practice consistently",
            explanation: "Consistent practice and hands-on application lead to better retention and mastery."
          },
          {
            ques: `What is essential for mastering ${topic}?`,
            options: ["Only watching videos", "Reading documentation only", "Hands-on practice", "Avoiding challenges"],
            answer: "Hands-on practice",
            explanation: "Practical, hands-on experience is the most effective way to truly master a subject."
          },
          {
            ques: `Why are best practices important in ${topic}?`,
            options: ["They slow you down", "They ensure quality and maintainability", "They are optional", "They complicate things"],
            answer: "They ensure quality and maintainability",
            explanation: "Following best practices leads to better quality work that is easier to maintain and scale."
          },
          {
            ques: `What mindset helps most when learning ${topic}?`,
            options: ["Give up when stuck", "Avoid asking questions", "Stay curious and persistent", "Only learn surface-level"],
            answer: "Stay curious and persistent",
            explanation: "Curiosity and persistence are key traits that help you overcome challenges and achieve mastery."
          }
        ],
        score: 50
      }
    };

    // Create course in database
    const course = new Course({
      userId,
      title: courseData.course.title,
      topic: courseData.course.topic,
      description: courseData.course.description,
      difficulty: courseData.course.difficulty,
      estimatedDuration: courseData.course.estimatedDuration,
      learningObjectives: courseData.course.learningObjectives,
      totalLessons: courseData.lessons.length,
      completedLessons: 0,
    });
    await course.save();

    // Create lessons
    const lessonPromises = courseData.lessons.map((lessonData) => {
      const lesson = new Lesson({
        courseId: course._id,
        title: lessonData.title,
        content: lessonData.content,
        order: lessonData.order,
        points: lessonData.points,
        duration: lessonData.duration,
        videoSearchTerm: lessonData.videoSearchTerm,
        completed: false,
        completedBy: [],
      });
      return lesson.save();
    });
    const savedLessons = await Promise.all(lessonPromises);

    // Create quiz
    const quiz = new Quiz({
      courseId: course._id,
      title: courseData.quiz.title,
      description: courseData.quiz.description,
      questions: courseData.quiz.questions.map((q) => ({
        ques: q.ques,
        options: q.options,
        correctAnswer: q.answer,
        explanation: q.explanation,
      })),
      score: courseData.quiz.score,
      attempts: [],
    });
    await quiz.save();

    console.log(`✅ Quick course generated successfully: ${course._id}`);
    
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
    console.error("❌ Error in quick course generation:", error);
    res.status(500).json({ 
      error: "Failed to generate course",
      details: error.message 
    });
  }
});

export default router;
