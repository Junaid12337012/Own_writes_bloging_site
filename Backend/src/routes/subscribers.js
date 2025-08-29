const express = require('express');
const { body, validationResult } = require('express-validator');
const supabase = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all subscribers
router.get('/', [authenticateToken, requireAdmin], async (req, res) => {
  try {
    const { data: subscribers, error } = await supabase
      .from('subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch subscribers' });
    }

    const transformedSubscribers = subscribers.map(sub => ({
      id: sub.id,
      email: sub.email,
      subscribedAt: sub.subscribed_at
    }));

    res.json(transformedSubscribers);
  } catch (error) {
    console.error('Get subscribers error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Subscribe to newsletter
router.post('/subscribe', [
  body('email').isEmail().withMessage('Valid email required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    // Check if already subscribed
    const { data: existing } = await supabase
      .from('subscribers')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      return res.status(400).json({ error: 'Email already subscribed' });
    }

    // Subscribe
    const { error } = await supabase
      .from('subscribers')
      .insert([{ email }]);

    if (error) {
      return res.status(500).json({ error: 'Failed to subscribe' });
    }

    res.status(201).json({ message: 'Successfully subscribed to newsletter' });
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Unsubscribe from newsletter
router.post('/unsubscribe', [
  body('email').isEmail().withMessage('Valid email required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    const { error } = await supabase
      .from('subscribers')
      .delete()
      .eq('email', email);

    if (error) {
      return res.status(500).json({ error: 'Failed to unsubscribe' });
    }

    res.json({ message: 'Successfully unsubscribed from newsletter' });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete subscriber (admin only)
router.delete('/:id', [authenticateToken, requireAdmin], async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('subscribers')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(500).json({ error: 'Failed to delete subscriber' });
    }

    res.json({ message: 'Subscriber deleted successfully' });
  } catch (error) {
    console.error('Delete subscriber error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
