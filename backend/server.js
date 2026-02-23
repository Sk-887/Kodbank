const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { initDB } = require('./db');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

/* ─── CORS FIX ───────────────────────────────────────────── */
app.use(cors({
  origin: "*",   // allow all origins (safe for testing)
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: false
}));

/* ─── Middleware ─────────────────────────────────────────── */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ─── Serve Frontend ─────────────────────────────────────── */
app.use(express.static(path.join(__dirname, '../frontend/public')));

/* ─── API Routes ─────────────────────────────────────────── */
app.use('/api/auth', authRoutes);

/* ─── Page Routes ────────────────────────────────────────── */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/register.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/login.html'));
});

app.get('/userdashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/dashboard.html'));
});

/* ─── Start Server ───────────────────────────────────────── */
async function start() {
  try {
    await initDB();
    app.listen(PORT, () => {
      console.log(`🚀 Kodbank server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
  }
}

start();