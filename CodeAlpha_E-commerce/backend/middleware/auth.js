/* ============================================================
   middleware/auth.js — JWT authentication middleware
   ============================================================
   Usage: add protect as a route middleware to require login.

     router.post('/orders', protect, createOrder);

   What it does:
     1. Reads the Authorization header: "Bearer <token>"
     2. Verifies the JWT with JWT_SECRET from .env
     3. Attaches the decoded user payload to req.user
     4. Calls next() so the route handler can run
     5. Returns 401 if the token is missing or invalid
   ============================================================ */

const jwt = require('jsonwebtoken');

/**
 * Express middleware that protects a route with JWT auth.
 * Attaches `req.user = { id, name, email }` on success.
 */
function protect(req, res, next) {
  const authHeader = req.headers.authorization;

  // Header must be present and start with "Bearer "
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorised — no token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, name, email, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorised — token invalid or expired' });
  }
}

module.exports = { protect };
