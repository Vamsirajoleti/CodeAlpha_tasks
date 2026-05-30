/* ============================================================
   models/Order.js — Order schema & model
   ============================================================
   Fields:
     user      — ref to User who placed the order
     items     — array of { productId, title, price, quantity }
     address   — shipping address string
     total     — computed total in ₹
     status    — 'pending' | 'processing' | 'shipped' | 'delivered'
     createdAt — auto timestamp
   ============================================================ */

const mongoose = require('mongoose');

// Sub-schema for each line item in an order
const OrderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  'Product',
    },
    title:    { type: String, required: true },
    price:    { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false } // don't create a separate _id for each item
);

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },

    items: {
      type:     [OrderItemSchema],
      required: true,
      validate: {
        validator: (arr) => arr.length > 0,
        message:   'Order must have at least one item',
      },
    },

    address: {
      type:     String,
      required: [true, 'Shipping address is required'],
      trim:     true,
    },

    total: {
      type: Number,
      required: true,
    },

    status: {
      type:    String,
      enum:    ['pending', 'processing', 'shipped', 'delivered'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
