/* ============================================================
   config/db.js — MongoDB connection
   ============================================================
   Exports connectDB(uri) which connects Mongoose and logs
   the result. server.js and seed.js both call this.
   ============================================================ */



const mongoose = require('mongoose');

async function connectDB(uri) {
  if (!uri) {
    throw new Error('MONGO_URI is not defined in your .env file');
  }

  await mongoose.connect(uri);

  console.log('✅ MongoDB Connected');
}

module.exports = { connectDB };
