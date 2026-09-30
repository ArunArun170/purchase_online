const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

function signUser(user) {
  return jwt.sign(
    { id: user._id.toString(), email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function publicUser(user) {
  return { id: user._id, name: user.name, phone: user.phone, email: user.email, role: user.role };
}

router.post("/signup", async (req, res) => {
  try {
    const { name, phone = "", email, password } = req.body;
    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) return res.status(409).json({ message: "An account with this email already exists" });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name: name.trim(), phone: phone.trim(), email: normalizedEmail, passwordHash });
    res.status(201).json({ token: signUser(user), user: publicUser(user) });
  } catch (error) {
    res.status(500).json({ message: "Failed to create account", error: error.message });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: String(email || "").trim().toLowerCase() });
    if (!user || !(await bcrypt.compare(password || "", user.passwordHash))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    res.json({ token: signUser(user), user: publicUser(user) });
  } catch (error) {
    res.status(500).json({ message: "Failed to sign in", error: error.message });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id).select("name phone email role").lean();
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

router.get("/accounts", requireAuth, requireAdmin, async (_req, res) => {
  const users = await User.find().select("name phone email role createdAt").sort({ createdAt: -1 }).lean();
  res.json(users);
});

module.exports = router;
