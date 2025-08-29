const express = require('express');
const { body, validationResult } = require('express-validator');
const supabase = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get comments for a post
router.get('/post/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const { status = 'approved' } = req.query;

    const { data: comments, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .eq('status', status)
      .order('timestamp', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch comments' });
    }

    const transformedComments = comments.map(comment => ({
      id: comment.id,
      postId: comment.post_id,
      authorName: comment.author_name,
      authorAvatarUrl: comment.author_avatar_url,
      text: comment.text,
      timestamp: comment.timestamp,
      status: comment.status
    }));

    res.json(transformedComments);
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all comments (admin only)
router.get('/', [authenticateToken, requireAdmin], async (req, res) => {
  try {
    const { status } = req.query;

    let query = supabase
      .from('comments')
      .select('*')
      .order('timestamp', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data: comments, error } = await query;

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch comments' });
    }

    const transformedComments = comments.map(comment => ({
      id: comment.id,
      postId: comment.post_id,
      authorName: comment.author_name,
      authorAvatarUrl: comment.author_avatar_url,
      text: comment.text,
      timestamp: comment.timestamp,
      status: comment.status
    }));

    res.json(transformedComments);
  } catch (error) {
    console.error('Get all comments error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create comment
router.post('/', [
  body('postId').isUUID().withMessage('Valid post ID required'),
  body('authorName').trim().isLength({ min: 1 }).withMessage('Author name is required'),
  body('text').trim().isLength({ min: 1 }).withMessage('Comment text is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { postId, authorName, authorAvatarUrl, text } = req.body;

    const { data: comment, error } = await supabase
      .from('comments')
      .insert([{
        post_id: postId,
        author_name: authorName,
        author_avatar_url: authorAvatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=6366f1&color=fff`,
        text,
        status: 'pending'
      }])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to create comment' });
    }

    res.status(201).json({
      message: 'Comment created successfully',
      comment: {
        id: comment.id,
        postId: comment.post_id,
        authorName: comment.author_name,
        authorAvatarUrl: comment.author_avatar_url,
        text: comment.text,
        timestamp: comment.timestamp,
        status: comment.status
      }
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update comment status (admin only)
router.put('/:id/status', [
  authenticateToken,
  requireAdmin,
  body('status').isIn(['pending', 'approved', 'spam']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status } = req.body;

    const { error } = await supabase
      .from('comments')
      .update({ status })
      .eq('id', id);

    if (error) {
      return res.status(500).json({ error: 'Failed to update comment status' });
    }

    res.json({ message: 'Comment status updated successfully' });
  } catch (error) {
    console.error('Update comment status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete comment (admin only)
router.delete('/:id', [authenticateToken, requireAdmin], async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(500).json({ error: 'Failed to delete comment' });
    }

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
