const express = require('express');
const { body, validationResult } = require('express-validator');
const supabase = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all pages
router.get('/', async (req, res) => {
  try {
    const { data: pages, error } = await supabase
      .from('pages')
      .select('*')
      .order('title');

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch pages' });
    }

    const transformedPages = pages.map(page => ({
      id: page.id,
      title: page.title,
      slug: page.slug,
      content: page.content,
      isDeletable: page.is_deletable
    }));

    res.json(transformedPages);
  } catch (error) {
    console.error('Get pages error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single page by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const { data: page, error } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    res.json({
      id: page.id,
      title: page.title,
      slug: page.slug,
      content: page.content,
      isDeletable: page.is_deletable
    });
  } catch (error) {
    console.error('Get page error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create page (admin only)
router.post('/', [
  authenticateToken,
  requireAdmin,
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('content').trim().isLength({ min: 1 }).withMessage('Content is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, slug } = req.body;
    const pageSlug = slug || title.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-');

    const { data: page, error } = await supabase
      .from('pages')
      .insert([{
        title,
        slug: pageSlug,
        content,
        is_deletable: true
      }])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to create page' });
    }

    res.status(201).json({
      message: 'Page created successfully',
      page: {
        id: page.id,
        title: page.title,
        slug: page.slug,
        content: page.content,
        isDeletable: page.is_deletable
      }
    });
  } catch (error) {
    console.error('Create page error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update page (admin only)
router.put('/:id', [
  authenticateToken,
  requireAdmin,
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('content').trim().isLength({ min: 1 }).withMessage('Content is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, content } = req.body;

    const { error } = await supabase
      .from('pages')
      .update({
        title,
        content,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      return res.status(500).json({ error: 'Failed to update page' });
    }

    res.json({ message: 'Page updated successfully' });
  } catch (error) {
    console.error('Update page error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete page (admin only)
router.delete('/:id', [authenticateToken, requireAdmin], async (req, res) => {
  try {
    const { id } = req.params;

    // Check if page is deletable
    const { data: page, error: fetchError } = await supabase
      .from('pages')
      .select('is_deletable')
      .eq('id', id)
      .single();

    if (fetchError || !page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    if (!page.is_deletable) {
      return res.status(400).json({ error: 'This page cannot be deleted' });
    }

    const { error } = await supabase
      .from('pages')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(500).json({ error: 'Failed to delete page' });
    }

    res.json({ message: 'Page deleted successfully' });
  } catch (error) {
    console.error('Delete page error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
