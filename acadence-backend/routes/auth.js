import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default function authRoutes(db) {
  const router = express.Router();
  const users = db.collection("users");

  // Signup
  router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    const existingUser = await users.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await users.insertOne({ name, email, password: hashedPassword });

    res.json({ message: "Signup successful" });
  });

  // Login
  router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await users.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, email: user.email }, "secret123", { expiresIn: "1h" });

    res.json({ token, user: { name: user.name, email: user.email } });
  });

  return router;
}
