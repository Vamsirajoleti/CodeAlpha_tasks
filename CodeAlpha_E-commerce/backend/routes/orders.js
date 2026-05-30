/* ============================================================
   routes/orders.js — Order routes (all require login)
   ============================================================
   POST /api/orders        — place a new order
   GET  /api/orders/mine   — get the current user's orders
   ============================================================ */

const express = require('express');
const Order   = require('../models/Order');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All order routes require a valid JWT token
router.use(protect);


// ── POST /api/orders ─────────────────────────────────────────
// Creates a new order for the logged-in user.
// Expects body: { items: [...], address: "..." }
router.post('/', async (req, res) => {
  try {
    const { items, address } = req.body;

    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    // Validate address
    if (!address || address.trim() === '') {
      return res.status(400).json({ message: 'Shipping address is required' });
    }

    // Validate each item has the required fields
    for (const item of items) {
      if (!item.title || item.price == null || !item.quantity) {
        return res.status(400).json({ message: 'Each item must have title, price, and quantity' });
      }
    }

    // Calculate total server-side (never trust the client's total)
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await Order.create({
      user:    req.user.id,   // from JWT payload (set by protect middleware)
      items,
      address: address.trim(),
      total,
    });

    res.status(201).json(order);

  } catch (err) {
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors).map(e => e.message).join(', ');
      return res.status(400).json({ message });
    }
    res.status(500).json({ message: 'Could not place order' });
  }
});


// ── GET /api/orders/mine ─────────────────────────────────────
// Returns all orders belonging to the currently logged-in user.
// Sorted by newest first.
router.get('/mine', async (req, res) => {
  try {
    const orders = await Order
      .find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (err) {
    res.status(500).json({ message: 'Could not fetch orders' });
  }
});


module.exports = router;
