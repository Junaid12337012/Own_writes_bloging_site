const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const categoryRoutes = require('./routes/categories');
const authorRoutes = require('./routes/authors');
const commentRoutes = require('./routes/comments');
const userRoutes = require('./routes/users');
const subscriberRoutes = require('./routes/subscribers');
const contactRoutes = require('./routes/contact');
const pageRoutes = require('./routes/pages');
const uploadRoutes = require('./routes/upload');
const tagRoutes = require('./routes/tags');
const settingsRoutes = require('./routes/settings');

import { keepAlive } from './keepAlive'; // <-- NEW

const app = express();
const PORT = process.env.PORT || 5001;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5174',
    process.env.FRONTEND_URL || 'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Default route
app.get('/', (_req, res) => {
  res.send('Backend is running ✅');
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subscribers', subscriberRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/settings', settingsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5174'}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Start keep-alive pinging
keepAlive(); // <-- NEW
