/* ============================================================
   models/User.js — User schema & model
   ============================================================
   Fields:
     name       — display name
     email      — unique, used to log in
     password   — bcrypt-hashed (never stored as plain text)
     createdAt  — auto timestamp

   The pre-save hook hashes the password automatically so
   routes never need to call bcrypt directly.
   ============================================================ */

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, 'Name is required'],
      trim:     true,
    },

    email: {
      type:      String,
      required:  [true, 'Email is required'],
      unique:    true,
      lowercase: true,
      trim:      true,
    },

    password: {
      type:     String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
  },
  { timestamps: true }
);

// ── Hash password before saving ──────────────────────────────
// Only re-hashes when the password field was actually modified.
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

/**
 * Compares a plain-text password with the stored hash.
 * Used in the login route.
 * @param {string} plain - the password the user typed
 * @returns {Promise<boolean>}
 */
UserSchema.methods.matchPassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('User', UserSchema);
