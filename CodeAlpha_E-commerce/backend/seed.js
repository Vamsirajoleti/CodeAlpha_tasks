require('dotenv').config();
const { connectDB } = require('./config/db');
const Product       = require('./models/Product');

const sampleProducts = [
  // ── Electronics ──────────────────────────────────────────
  {
    title:       'Wireless Headphones',
    description: 'Over-ear headphones with 30-hour battery and active noise cancellation.',
    price:       1499,
    category:    'Electronics',
    image:       'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    stock:       30,
  },
  {
    title:       'USB-C Charger',
    description: '30W GaN fast charger. Compatible with laptops, phones, and tablets.',
    price:       899,
    category:    'Electronics',
    image:       'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400',
    stock:       50,
  },
  {
    title:       'Mechanical Keyboard',
    description: 'Compact 75% layout with tactile brown switches and RGB backlight.',
    price:       2499,
    category:    'Electronics',
    image:       'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
    stock:       20,
  },
  {
    title:       'Smartwatch',
    description: 'Fitness tracker with heart rate monitor and 7-day battery life.',
    price:       3499,
    category:    'Electronics',
    image:       'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    stock:       25,
  },
  {
    title:       'Bluetooth Speaker',
    description: 'Portable waterproof speaker with 360° sound and 12-hour battery.',
    price:       1299,
    category:    'Electronics',
    image:       'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
    stock:       40,
  },
  {
    title:       'Wireless Mouse',
    description: 'Ergonomic silent wireless mouse with 12-month battery life.',
    price:       599,
    category:    'Electronics',
    image:       'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
    stock:       80,
  },

  // ── Clothing ─────────────────────────────────────────────
  {
    title:       'Classic White T-Shirt',
    description: '100% premium cotton. Comfortable fit for everyday wear.',
    price:       399,
    category:    'Clothing',
    image:       'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    stock:       150,
  },
  {
    title:       'Slim Fit Jeans',
    description: 'Stretchable denim jeans. Available in blue and black.',
    price:       1199,
    category:    'Clothing',
    image:       'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
    stock:       80,
  },
  {
    title:       'Hoodie Sweatshirt',
    description: 'Warm fleece hoodie with kangaroo pocket. Perfect for winters.',
    price:       899,
    category:    'Clothing',
    image:       'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400',
    stock:       60,
  },
  {
    title:       'Running Shoes',
    description: 'Lightweight breathable sneakers with cushioned sole.',
    price:       1999,
    category:    'Clothing',
    image:       'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    stock:       45,
  },

  // ── Accessories ───────────────────────────────────────────
  {
    title:       'Laptop Backpack',
    description: 'Water-resistant 30L bag with USB charging port. Fits 15.6" laptops.',
    price:       999,
    category:    'Accessories',
    image:       'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    stock:       60,
  },
  {
    title:       'Phone Stand',
    description: 'Adjustable aluminium desktop stand. Works with all phone sizes.',
    price:       449,
    category:    'Accessories',
    image:       'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400',
    stock:       75,
  },
  {
    title:       'Leather Wallet',
    description: 'Slim genuine leather bifold wallet with RFID blocking.',
    price:       699,
    category:    'Accessories',
    image:       'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400',
    stock:       90,
  },

  // ── Home ──────────────────────────────────────────────────
  {
    title:       'Coffee Mug',
    description: 'Ceramic 350ml mug. Microwave and dishwasher safe.',
    price:       299,
    category:    'Home',
    image:       'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400',
    stock:       100,
  },
  {
    title:       'Desk Lamp',
    description: 'LED desk lamp with 5 brightness levels and USB charging port.',
    price:       799,
    category:    'Home',
    image:       'https://images.unsplash.com/photo-1534073737927-85f1ebff1f5d?w=400',
    stock:       45,
  },
  {
    title:       'Indoor Plant Pot',
    description: 'Minimalist ceramic pot. Perfect for succulents and small plants.',
    price:       349,
    category:    'Home',
    image:       'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400',
    stock:       55,
  },
];

async function seed() {
  await connectDB(process.env.MONGO_URI);
  await Product.deleteMany({});
  console.log('🗑  Cleared existing products');
  await Product.insertMany(sampleProducts);
  console.log(`✅  Inserted ${sampleProducts.length} products across 4 categories`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
