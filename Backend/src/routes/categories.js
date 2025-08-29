const express = require('express');
const { body, validationResult } = require('express-validator');
const supabase = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch categories' });
    }

    const transformedCategories = categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      description: cat.description,
      imageUrl: cat.image_url
    }));

    res.json(transformedCategories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single category
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: category, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({
      id: category.id,
      name: category.name,
      description: category.description,
      imageUrl: category.image_url
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create category
router.post('/', [
  authenticateToken,
  requireAdmin,
  body('name').trim().isLength({ min: 1 }).withMessage('Name is required'),
  body('description').trim().isLength({ min: 1 }).withMessage('Description is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, imageUrl } = req.body;

    const { data: category, error } = await supabase
      .from('categories')
      .insert([{
        name,
        description,
        image_url: imageUrl
      }])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to create category' });
    }

    res.status(201).json({
      message: 'Category created successfully',
      category: {
        id: category.id,
        name: category.name,
        description: category.description,
        imageUrl: category.image_url
      }
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update category
router.put('/:id', [
  authenticateToken,
  requireAdmin,
  body('name').trim().isLength({ min: 1 }).withMessage('Name is required'),
  body('description').trim().isLength({ min: 1 }).withMessage('Description is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, description, imageUrl } = req.body;

    const { error } = await supabase
      .from('categories')
      .update({
        name,
        description,
        image_url: imageUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      return res.status(500).json({ error: 'Failed to update category' });
    }

    res.json({ message: 'Category updated successfully' });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete category
router.delete('/:id', [authenticateToken, requireAdmin], async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category has any posts
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('id')
      .eq('category_id', id)
      .limit(1);

    if (postsError) {
      return res.status(500).json({ error: 'Failed to check category dependencies' });
    }

    if (posts && posts.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete category. This category has posts assigned to it. Please move or delete all posts in this category first.',
        code: 'CATEGORY_HAS_POSTS'
      });
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(500).json({ error: 'Failed to delete category' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
