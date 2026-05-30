/* ============================================================
   routes/auth.js — Authentication routes
   ============================================================
   POST /api/auth/register  — create account, returns JWT
   POST /api/auth/login     — verify credentials, returns JWT
   ============================================================ */

const express = require('express');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');

const router = express.Router();

// ── Helper: sign a JWT for a user ────────────────────────────
function signToken(user) {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }  // token valid for 7 days
  );
}


// ── POST /api/auth/register ──────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    // Check if email is already taken
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'An account with that email already exists' });
    }

    // Create user — password is hashed by the pre-save hook in User.js
    const user  = await User.create({ name, email, password });
    const token = signToken(user);

    res.status(201).json({ token });

  } catch (err) {
    // Mongoose validation errors (e.g. password too short)
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors).map(e => e.message).join(', ');
      return res.status(400).json({ message });
    }
    res.status(500).json({ message: 'Server error during registration' });
  }
});


// ── POST /api/auth/login ─────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare password with stored hash (method defined in User model)
    const match = await user.matchPassword(password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = signToken(user);
    res.json({ token });

  } catch (err) {
    res.status(500).json({ message: 'Server error during login' });
  }
});


module.exports = router;
