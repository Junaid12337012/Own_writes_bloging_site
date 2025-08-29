const express = require('express');
const { body, validationResult } = require('express-validator');
const supabase = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get site settings
router.get('/', async (req, res) => {
  try {
    const { data: settings, error } = await supabase
      .from('site_settings')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      return res.status(500).json({ error: 'Failed to fetch settings' });
    }

    // Return default settings if none exist
    const defaultSettings = {
      title: 'Inkwell',
      description: 'A modern blogging platform for creators and readers',
      logo_light_url: '',
      logo_dark_url: '',
      twitter_url: 'https://twitter.com',
      github_url: 'https://github.com'
    };

    res.json(settings || defaultSettings);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update site settings (admin only)
router.put('/', [
  authenticateToken,
  requireAdmin,
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('description').trim().isLength({ min: 1 }).withMessage('Description is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, logoLightUrl, logoDarkUrl, twitterUrl, githubUrl } = req.body;

    // Check if settings exist
    const { data: existingSettings } = await supabase
      .from('site_settings')
      .select('id')
      .single();

    const settingsData = {
      title,
      description,
      logo_light_url: logoLightUrl || '',
      logo_dark_url: logoDarkUrl || '',
      twitter_url: twitterUrl || '',
      github_url: githubUrl || '',
      updated_at: new Date().toISOString()
    };

    let result;
    if (existingSettings) {
      // Update existing settings
      result = await supabase
        .from('site_settings')
        .update(settingsData)
        .eq('id', existingSettings.id)
        .select()
        .single();
    } else {
      // Create new settings
      result = await supabase
        .from('site_settings')
        .insert([{ ...settingsData, created_at: new Date().toISOString() }])
        .select()
        .single();
    }

    if (result.error) {
      return res.status(500).json({ error: 'Failed to save settings' });
    }

    res.json(result.data);
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
