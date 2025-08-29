const express = require('express');
const { body, validationResult } = require('express-validator');
const supabase = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all contact messages (admin only)
router.get('/', [authenticateToken, requireAdmin], async (req, res) => {
  try {
    const { data: messages, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch contact messages' });
    }

    const transformedMessages = messages.map(msg => ({
      id: msg.id,
      name: msg.name,
      email: msg.email,
      message: msg.message,
      timestamp: msg.timestamp
    }));

    res.json(transformedMessages);
  } catch (error) {
    console.error('Get contact messages error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Submit contact form
router.post('/', [
  body('name').trim().isLength({ min: 1 }).withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, message } = req.body;

    const { error } = await supabase
      .from('contact_messages')
      .insert([{
        name,
        email,
        message
      }]);

    if (error) {
      return res.status(500).json({ error: 'Failed to submit contact form' });
    }

    res.status(201).json({ message: 'Contact form submitted successfully' });
  } catch (error) {
    console.error('Submit contact form error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete contact message (admin only)
router.delete('/:id', [authenticateToken, requireAdmin], async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(500).json({ error: 'Failed to delete contact message' });
    }

    res.json({ message: 'Contact message deleted successfully' });
  } catch (error) {
    console.error('Delete contact message error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
