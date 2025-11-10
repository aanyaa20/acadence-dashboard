import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await model.generateContent(message);
    res.json({ reply: response.response.text() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "⚠️ Error connecting to AI server." });
  }
});

app.listen(5000, () => console.log("✅ Server running on port 5000"));
