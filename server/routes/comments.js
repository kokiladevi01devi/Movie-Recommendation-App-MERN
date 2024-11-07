import express from 'express';
import Comment from '../models/Comment.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get comments for a movie
router.get('/:movieId', async (req, res) => {
  try {
    const comments = await Comment.find({ movieId: req.params.movieId })
      .populate('userId', 'username')
      .sort({ createdAt: -1 });

    const formattedComments = comments.map(comment => ({
      id: comment._id,
      movieId: comment.movieId,
      userId: comment.userId._id,
      username: comment.userId.username,
      content: comment.content,
      createdAt: comment.createdAt
    }));

    res.json(formattedComments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new comment
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { movieId, content } = req.body;
    const comment = new Comment({
      movieId,
      userId: req.user.id,
      content
    });

    await comment.save();
    const populatedComment = await Comment.findById(comment._id)
      .populate('userId', 'username');

    res.status(201).json({
      id: comment._id,
      movieId: comment.movieId,
      userId: populatedComment.userId._id,
      username: populatedComment.userId.username,
      content: comment.content,
      createdAt: comment.createdAt
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { router as commentRoutes };