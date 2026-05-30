const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    price:       { type: Number, required: true, min: 0 },
    image:       { type: String, default: '' },
    stock:       { type: Number, default: 0, min: 0 },
    category: {
      type:    String,
      enum:    ['Electronics', 'Clothing', 'Accessories', 'Home', 'Other'],
      default: 'Other',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);
