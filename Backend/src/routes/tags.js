const express = require('express');
const supabase = require('../config/database');

const router = express.Router();

// Get all tags
router.get('/', async (req, res) => {
  try {
    const { data: tags, error } = await supabase
      .from('tags')
      .select('*')
      .order('name');

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch tags' });
    }

    res.json(tags);
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single tag
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: tag, error } = await supabase
      .from('tags')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    res.json(tag);
  } catch (error) {
    console.error('Get tag error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
