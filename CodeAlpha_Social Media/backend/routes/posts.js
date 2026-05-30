const router = require('express').Router();
const Post = require('../models/Post');
const protect = require('../middleware/auth');

// GET /api/posts  — public, latest 50 posts
router.get('/', async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).limit(50);
    res.json({ posts });
  } catch (err) {
    next(err);
  }
});

// POST /api/posts  — create post (protected)
router.post('/', protect, async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Post content is required' });
    }
    if (content.trim().length > 2200) {
      return res.status(400).json({ message: 'Post too long (max 2200 chars)' });
    }

    const post = await Post.create({
      user: req.user.id,
      username: req.user.username,
      content: content.trim(),
    });

    res.status(201).json({ post });
  } catch (err) {
    next(err);
  }
});

// PUT /api/posts/like/:id  — toggle like (protected)
router.put('/like/:id', protect, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const userId = req.user.id;
    const idx = post.likes.indexOf(userId);
    if (idx === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(idx, 1);
    }

    await post.save();
    res.json({ likes: post.likes.length, liked: idx === -1 });
  } catch (err) {
    next(err);
  }
});

// POST /api/posts/comment/:id  — add comment (protected)
router.post('/comment/:id', protect, async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment text is required' });
    }
    if (text.trim().length > 500) {
      return res.status(400).json({ message: 'Comment too long (max 500 chars)' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = { user: req.user.id, username: req.user.username, text: text.trim() };
    post.comments.push(comment);
    await post.save();

    const saved = post.comments[post.comments.length - 1];
    res.status(201).json({ comment: saved });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
