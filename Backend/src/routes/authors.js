const express = require('express');
const { body, validationResult } = require('express-validator');
const supabase = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all authors
router.get('/', async (req, res) => {
  try {
    const { data: authors, error } = await supabase
      .from('authors')
      .select('*')
      .order('name');

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch authors' });
    }

    const transformedAuthors = authors.map(author => ({
      id: author.id,
      name: author.name,
      avatarUrl: author.avatar_url,
      bio: author.bio,
      followers: author.followers
    }));

    res.json(transformedAuthors);
  } catch (error) {
    console.error('Get authors error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single author
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: author, error } = await supabase
      .from('authors')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !author) {
      return res.status(404).json({ error: 'Author not found' });
    }

    res.json({
      id: author.id,
      name: author.name,
      avatarUrl: author.avatar_url,
      bio: author.bio,
      followers: author.followers
    });
  } catch (error) {
    console.error('Get author error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create author
router.post('/', [
  authenticateToken,
  requireAdmin,
  body('name').trim().isLength({ min: 1 }).withMessage('Name is required'),
  body('bio').trim().isLength({ min: 1 }).withMessage('Bio is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, avatarUrl, bio, followers = 0 } = req.body;

    const { data: author, error } = await supabase
      .from('authors')
      .insert([{
        name,
        avatar_url: avatarUrl,
        bio,
        followers
      }])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to create author' });
    }

    res.status(201).json({
      message: 'Author created successfully',
      author: {
        id: author.id,
        name: author.name,
        avatarUrl: author.avatar_url,
        bio: author.bio,
        followers: author.followers
      }
    });
  } catch (error) {
    console.error('Create author error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update author
router.put('/:id', [
  authenticateToken,
  requireAdmin,
  body('name').trim().isLength({ min: 1 }).withMessage('Name is required'),
  body('bio').trim().isLength({ min: 1 }).withMessage('Bio is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, avatarUrl, bio, followers } = req.body;

    const { error } = await supabase
      .from('authors')
      .update({
        name,
        avatar_url: avatarUrl,
        bio,
        followers,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      return res.status(500).json({ error: 'Failed to update author' });
    }

    res.json({ message: 'Author updated successfully' });
  } catch (error) {
    console.error('Update author error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete author
router.delete('/:id', [authenticateToken, requireAdmin], async (req, res) => {
  try {
    const { id } = req.params;

    // Check if author has any posts
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('id')
      .eq('author_id', id)
      .limit(1);

    if (postsError) {
      return res.status(500).json({ error: 'Failed to check author dependencies' });
    }

    if (posts && posts.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete author. This author has published posts. Please delete all posts by this author first.',
        code: 'AUTHOR_HAS_POSTS'
      });
    }

    const { error } = await supabase
      .from('authors')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(500).json({ error: 'Failed to delete author' });
    }

    res.json({ message: 'Author deleted successfully' });
  } catch (error) {
    console.error('Delete author error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
