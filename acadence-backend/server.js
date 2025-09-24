import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import authRoutes from "./routes/auth.js";
import detect from "detect-port"; // ✅ auto-detect free port

dotenv.config();

const app = express();
app.use(cors({ origin: "*", credentials: true }));

app.use(express.json());

const DEFAULT_PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";

MongoClient.connect(MONGO_URI)
  .then(async (client) => {
    console.log("✅ Connected to MongoDB");
    const db = client.db("acadence");

    // Routes
    app.use("/api/auth", authRoutes(db));

    // Health check
    app.get("/api/health", (req, res) => res.json({ status: "ok" }));

   // ✅ always use fixed port from .env (default 5000)
app.listen(DEFAULT_PORT, () => {
  console.log(`✅ Server running on port ${DEFAULT_PORT}`);
});

  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
