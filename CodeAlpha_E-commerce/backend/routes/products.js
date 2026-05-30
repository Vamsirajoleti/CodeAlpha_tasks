/* ============================================================
   routes/products.js — Product routes (public)
   ============================================================
   GET /api/products        — list all products
   GET /api/products/:id    — get a single product by ID
   ============================================================ */

const express = require('express');
const Product = require('../models/Product');

const router = express.Router();


// ── GET /api/products ────────────────────────────────────────
// Returns all products sorted by newest first.
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch products' });
  }
});


// ── GET /api/products/:id ────────────────────────────────────
// Returns a single product. Returns 404 if not found.
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);

  } catch (err) {
    // Malformed MongoDB ID (CastError) → treat as 404
    if (err.name === 'CastError') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: 'Could not fetch product' });
  }
});


module.exports = router;
