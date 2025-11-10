import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get the Gemini model for course generation
export const getCourseGenerationModel = () => {
  return genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 16384, // Increased for longer courses
      responseMimeType: "application/json", // Request JSON directly
    },
  });
};

// Get the Gemini model for chatbot
export const getChatbotModel = () => {
  return genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature: 0.9,
      topP: 1,
      topK: 40,
      maxOutputTokens: 2048,
    },
  });
};

export default genAI;
