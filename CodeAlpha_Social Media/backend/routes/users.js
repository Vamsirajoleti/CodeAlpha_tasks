const router = require('express').Router();
const User = require('../models/User');
const protect = require('../middleware/auth');

// GET /api/users/search?q=  — search users by username (protected)
router.get('/search', protect, async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) return res.json({ users: [] });

    const users = await User.find({
      username: { $regex: q, $options: 'i' },
    })
      .select('_id username bio createdAt')
      .limit(20);

    res.json({ users });
  } catch (err) {
    next(err);
  }
});

// GET /api/users/suggestions  — random user suggestions (protected)
router.get('/suggestions', protect, async (req, res, next) => {
  try {
    const users = await User.aggregate([
      { $match: { _id: { $ne: req.user.id } } },
      { $sample: { size: 5 } },
      { $project: { password: 0 } },
    ]);
    res.json({ users });
  } catch (err) {
    next(err);
  }
});

// GET /api/users/:username  — get user profile (protected)
router.get('/:username', protect, async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
