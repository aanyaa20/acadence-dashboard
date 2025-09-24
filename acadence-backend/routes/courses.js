import express from "express";
import { connectDB } from "../db.js";

const router = express.Router();

// Get all courses
router.get("/", async (req, res) => {
  const db = await connectDB();
  const courses = await db.collection("courses").find().toArray();
  res.json(courses);
});

export default router;
