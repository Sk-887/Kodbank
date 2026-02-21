const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../db');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '2h';

// ─── REGISTER ────────────────────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, phone, role } = req.body;

    // Validate required fields
    if (!username || !email || !password || !phone) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Only allow Customer role
    if (role && role !== 'Customer') {
      return res.status(403).json({ success: false, message: 'Only Customer role is allowed.' });
    }

    // Check if user already exists
    const [existing] = await pool.query(
      'SELECT uid FROM KodUser WHERE username = ? OR email = ?',
      [username, email]
    );
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Username or email already exists.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert user
    await pool.query(
      'INSERT INTO KodUser (username, email, password, phone, role, balance) VALUES (?, ?, ?, ?, ?, ?)',
      [username, email, hashedPassword, phone, 'Customer', 100000.00]
    );

    return res.status(201).json({ success: true, message: 'Registration successful! Please login.' });
  } catch (err) {
    console.error('Register Error:', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// ─── LOGIN ───────────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }

    // Fetch user from DB
    const [users] = await pool.query(
      'SELECT uid, username, password, role FROM KodUser WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }

    const user = users[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }

    // Generate JWT
    const expiryDate = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
    const token = jwt.sign(
      { sub: user.username, role: user.role, uid: user.uid },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Store token in DB
    await pool.query(
      'INSERT INTO UserToken (token, uid, expiry) VALUES (?, ?, ?)',
      [token, user.uid, expiryDate]
    );

    // Set cookie
    res.cookie('kodbank_token', token, {
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000, // 2 hours
      sameSite: 'strict',
    });

    return res.status(200).json({ success: true, message: 'Login successful!', token });
  } catch (err) {
    console.error('Login Error:', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// ─── CHECK BALANCE ────────────────────────────────────────────────────────────
router.get('/balance', async (req, res) => {
  try {
    // Get token from cookie or Authorization header
    const token = req.cookies.kodbank_token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided. Please login.' });
    }

    // Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (jwtErr) {
      if (jwtErr.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'Token expired. Please login again.' });
      }
      return res.status(401).json({ success: false, message: 'Invalid token. Please login again.' });
    }

    // Check token in DB (ensure it's not been invalidated)
    const [tokenRows] = await pool.query(
      'SELECT tid FROM UserToken WHERE token = ? AND expiry > NOW()',
      [token]
    );
    if (tokenRows.length === 0) {
      return res.status(401).json({ success: false, message: 'Session expired. Please login again.' });
    }

    // Fetch balance using username from token
    const username = decoded.sub;
    const [users] = await pool.query(
      'SELECT balance FROM KodUser WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.status(200).json({
      success: true,
      balance: users[0].balance,
      username,
    });
  } catch (err) {
    console.error('Balance Error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─── LOGOUT ──────────────────────────────────────────────────────────────────
router.post('/logout', (req, res) => {
  res.clearCookie('kodbank_token');
  return res.status(200).json({ success: true, message: 'Logged out successfully.' });
});

module.exports = router;
