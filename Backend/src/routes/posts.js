const express = require('express');
const { body, validationResult } = require('express-validator');
const supabase = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Helper function to generate slug
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
};

// Get all posts with filters
router.get('/', async (req, res) => {
  try {
    const { 
      status = 'published', 
      category, 
      author, 
      featured, 
      limit = 10, 
      offset = 0,
      search 
    } = req.query;

    let query = supabase
      .from('posts')
      .select(`
        *,
        authors (id, name, avatar_url, bio, followers),
        categories (id, name, description, image_url),
        post_tags (tags (id, name))
      `)
      .eq('status', status)
      .order('published_date', { ascending: false });

    if (category) query = query.eq('category_id', category);
    if (author) query = query.eq('author_id', author);
    if (featured === 'true') query = query.eq('featured', true);
    if (search) query = query.ilike('title', `%${search}%`);

    query = query.range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    const { data: posts, error } = await query;

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch posts' });
    }

    // Transform data to match frontend format
    const transformedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      imageUrl: post.image_url,
      author: {
        ...post.authors,
        avatarUrl: post.authors.avatar_url
      },
      category: {
        ...post.categories,
        imageUrl: post.categories.image_url
      },
      tags: post.post_tags.map(pt => pt.tags),
      publishedDate: post.published_date,
      readingTime: post.reading_time,
      likes: post.likes,
      featured: post.featured,
      status: post.status
    }));

    res.json(transformedPosts);
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single post by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const { data: post, error } = await supabase
      .from('posts')
      .select(`
        *,
        authors (id, name, avatar_url, bio, followers),
        categories (id, name, description, image_url),
        post_tags (tags (id, name)),
        post_history (content, timestamp)
      `)
      .eq('slug', slug)
      .single();

    if (error || !post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const transformedPost = {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      imageUrl: post.image_url,
      author: post.authors,
      category: post.categories,
      tags: post.post_tags.map(pt => pt.tags),
      publishedDate: post.published_date,
      readingTime: post.reading_time,
      likes: post.likes,
      featured: post.featured,
      status: post.status,
      history: post.post_history
    };

    res.json(transformedPost);
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new post
router.post('/', [
  authenticateToken,
  requireAdmin,
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('content').trim().isLength({ min: 1 }).withMessage('Content is required'),
  body('authorId').isUUID().withMessage('Valid author ID required'),
  body('categoryId').isUUID().withMessage('Valid category ID required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      excerpt,
      content,
      imageUrl,
      authorId,
      categoryId,
      tags = [],
      readingTime = 0,
      featured = false,
      status = 'draft'
    } = req.body;

    const slug = generateSlug(title);
    const postId = uuidv4();

    // Create post
    const { error: postError } = await supabase
      .from('posts')
      .insert([{
        id: postId,
        title,
        slug,
        excerpt,
        content,
        image_url: imageUrl,
        author_id: authorId,
        category_id: categoryId,
        reading_time: readingTime,
        featured,
        status
      }]);

    if (postError) {
      return res.status(500).json({ error: 'Failed to create post' });
    }

    // Add tags if provided
    if (tags.length > 0) {
      const tagInserts = tags.map(tagId => ({
        post_id: postId,
        tag_id: tagId
      }));

      await supabase.from('post_tags').insert(tagInserts);
    }

    // Add to history
    await supabase.from('post_history').insert([{
      post_id: postId,
      content
    }]);

    res.status(201).json({ message: 'Post created successfully', id: postId });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update post
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
    const {
      title,
      excerpt,
      content,
      imageUrl,
      categoryId,
      tags = [],
      readingTime = 0,
      featured = false,
      status = 'draft'
    } = req.body;

    const slug = generateSlug(title);

    // Update post
    const { error: updateError } = await supabase
      .from('posts')
      .update({
        title,
        slug,
        excerpt,
        content,
        image_url: imageUrl,
        category_id: categoryId,
        reading_time: readingTime,
        featured,
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (updateError) {
      return res.status(500).json({ error: 'Failed to update post' });
    }

    // Update tags
    await supabase.from('post_tags').delete().eq('post_id', id);
    
    if (tags.length > 0) {
      const tagInserts = tags.map(tagId => ({
        post_id: id,
        tag_id: tagId
      }));
      await supabase.from('post_tags').insert(tagInserts);
    }

    // Add to history
    await supabase.from('post_history').insert([{
      post_id: id,
      content
    }]);

    res.json({ message: 'Post updated successfully' });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete post
router.delete('/:id', [authenticateToken, requireAdmin], async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(500).json({ error: 'Failed to delete post' });
    }

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Like post
router.post('/:id/like', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .rpc('increment_post_likes', { post_id: id });

    if (error) {
      return res.status(500).json({ error: 'Failed to like post' });
    }

    res.json({ message: 'Post liked successfully' });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
