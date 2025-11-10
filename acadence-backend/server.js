import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/users.js";
import courseRoutes from "./routes/courses.js";
import lessonRoutes from "./routes/lessons.js";
import quizRoutes from "./routes/quizzes.js";
import generateCourseRoutes from "./routes/generateCourse.js";
import { getChatbotModel } from "./config/gemini.js";

dotenv.config();

const app = express();
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

const DEFAULT_PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/acadence";

// ✅ Connect to MongoDB with retry options
mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    console.error("\n🔍 Troubleshooting:");
    console.error("1. Check if your IP is whitelisted in MongoDB Atlas");
    console.error("2. Verify your connection string in .env file");
    console.error("3. Wait 2-3 minutes after adding IP to whitelist");
    process.exit(1);
  });

// ✅ Chatbot endpoint with context awareness
app.post("/api/chat", async (req, res) => {
  try {
    const { message, userId, userName, userEmail, courses, conversationHistory } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    console.log("📩 Chat request received:", { message, userId, coursesCount: courses?.length || 0 });

    // Build context prompt
    let contextPrompt = `You are Acadence AI, a friendly and knowledgeable learning assistant for an educational platform called Acadence. 

Your role is to:
- Help students find and understand courses
- Answer questions about learning paths and skills
- Provide study tips and motivation
- Explain concepts in simple terms
- Recommend courses based on interests
- Help with course navigation and features
- Answer questions about their enrolled courses and progress

Guidelines:
- Be friendly, encouraging, and supportive
- Keep responses concise but helpful (2-4 sentences max unless explaining something complex)
- Use simple, clear language
- If asked about specific courses they haven't enrolled in, suggest they explore the course catalog
- For technical questions, provide clear step-by-step explanations
- Always be positive and motivating
- Reference their actual enrolled courses when relevant
- Celebrate their progress and achievements

`;

    // Add user-specific context
    if (userName) {
      contextPrompt += `\nUser Information:
- Name: ${userName}
${userEmail ? `- Email: ${userEmail}` : ''}
- Total Enrolled Courses: ${courses?.length || 0}
`;

      // Add course information
      if (courses && courses.length > 0) {
        contextPrompt += `\nUser's Enrolled Courses:\n`;
        courses.forEach((course) => {
          contextPrompt += `- "${course.title}"
  • Topic: ${course.topic}
  • Difficulty: ${course.difficulty}
  • Progress: ${course.progress} (${course.completionPercentage}% complete)
  • Duration: ${course.estimatedDuration || 'Not specified'}
`;
        });
      } else {
        contextPrompt += `\nNote: User hasn't enrolled in any courses yet. Encourage them to explore the course catalog and recommend starting with beginner-friendly topics.`;
      }
    }

    // Add conversation history for context continuity
    if (conversationHistory && conversationHistory.length > 0) {
      contextPrompt += `\n\nRecent Conversation:\n`;
      conversationHistory.forEach(msg => {
        contextPrompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.text}\n`;
      });
    }

    contextPrompt += `\nUser's Current Question: ${message}\n\nProvide a helpful, personalized response:`;

    console.log("🤖 Calling Gemini API...");
    const model = getChatbotModel();
    const result = await model.generateContent(contextPrompt);
    const reply = result.response.text();

    console.log("✅ Gemini response received");
    res.json({ reply });
  } catch (error) {
    console.error("❌ Gemini API error:", error);
    res.status(500).json({ error: "Failed to generate response" });
  }
});

// ✅ Request logger middleware
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

// ✅ API Routes
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/generate-course", generateCourseRoutes);

// ✅ Recommendations endpoint (placeholder)
app.get("/api/recommendations", (req, res) => {
  res.json([
    { id: 1, title: "Introduction to Web Development", type: "course" },
    { id: 2, title: "Python for Data Science", type: "course" },
    { id: 3, title: "Machine Learning Basics", type: "course" }
  ]);
});

// ✅ Test Gemini endpoint
app.get("/api/test-gemini", async (req, res) => {
  try {
    console.log("🧪 Testing Gemini API...");
    const model = getChatbotModel();
    const result = await model.generateContent("Say hello in 3 words");
    const reply = result.response.text();
    console.log("✅ Gemini test successful:", reply);
    res.json({ success: true, response: reply });
  } catch (error) {
    console.error("❌ Gemini test failed:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Health check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// ✅ Start server
app.listen(DEFAULT_PORT, () => {
  console.log(`✅ Server running on port ${DEFAULT_PORT}`);
});
