/* ============================================================
   server.js — Application entry point
   ============================================================
   Starts Express, connects to MongoDB, then mounts all routes.

   Routes:
     POST   /api/auth/register   → register new user
     POST   /api/auth/login      → login, returns JWT

     GET    /api/products        → list all products (public)
     GET    /api/products/:id    → single product (public)

     POST   /api/orders          → place order (auth required)
     GET    /api/orders/mine     → user's own orders (auth required)
   ============================================================ */

require('dotenv').config();

const express = require('express');
const cors    = require('cors');

const { connectDB }     = require('./config/db');
const authRoutes        = require('./routes/auth');
const productRoutes     = require('./routes/products');
const orderRoutes       = require('./routes/orders');

const app = express();

// ── Middleware ───────────────────────────────────────────────
app.use(cors());           // allow cross-origin requests from the frontend
app.use(express.json());   // parse JSON request bodies

// ── Routes ───────────────────────────────────────────────────
app.use('/api/auth',     authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders',   orderRoutes);

// ── 404 handler ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ── Global error handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

// ── Connect to DB then start server ─────────────────────────
const PORT = process.env.PORT || 5000;

connectDB(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  });
