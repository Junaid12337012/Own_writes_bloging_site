# Inkwell Backend API

A complete Node.js/Express backend for the Inkwell blogging platform with Supabase integration.

## Features

- **Authentication**: JWT-based auth with registration, login, and email verification
- **Posts Management**: Full CRUD operations for blog posts with categories and tags
- **User Management**: Admin panel for user administration
- **Comments System**: Comment moderation with approval workflow
- **File Uploads**: Image upload to Supabase Storage
- **Newsletter**: Subscription management
- **Contact Forms**: Message collection and management
- **Static Pages**: Dynamic page management

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT + bcrypt
- **File Storage**: Supabase Storage
- **Validation**: express-validator
- **Security**: helmet, cors, rate limiting

## Setup Instructions

### 1. Install Dependencies

```bash
cd Backend
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required environment variables:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `JWT_SECRET`: Secret key for JWT tokens
- `FRONTEND_URL`: Your frontend URL (for CORS)

### 3. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema:
   ```sql
   -- Copy and paste content from src/migrations/schema.sql
   ```
3. (Optional) Add sample data:
   ```sql
   -- Copy and paste content from src/migrations/sample-data.sql
   ```
4. Create a storage bucket named `blog-images` for file uploads
5. Set up RLS policies as needed

### 4. Database Functions

Add this function to Supabase for post likes:

```sql
CREATE OR REPLACE FUNCTION increment_post_likes(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE posts SET likes = likes + 1 WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;
```

### 5. Start the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-email` - Email verification
- `GET /api/auth/me` - Get current user

### Posts
- `GET /api/posts` - Get all posts (with filters)
- `GET /api/posts/:slug` - Get single post
- `POST /api/posts` - Create post (admin)
- `PUT /api/posts/:id` - Update post (admin)
- `DELETE /api/posts/:id` - Delete post (admin)
- `POST /api/posts/:id/like` - Like a post

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create category (admin)
- `PUT /api/categories/:id` - Update category (admin)
- `DELETE /api/categories/:id` - Delete category (admin)

### Authors
- `GET /api/authors` - Get all authors
- `GET /api/authors/:id` - Get single author
- `POST /api/authors` - Create author (admin)
- `PUT /api/authors/:id` - Update author (admin)
- `DELETE /api/authors/:id` - Delete author (admin)

### Comments
- `GET /api/comments/post/:postId` - Get comments for post
- `GET /api/comments` - Get all comments (admin)
- `POST /api/comments` - Create comment
- `PUT /api/comments/:id/status` - Update comment status (admin)
- `DELETE /api/comments/:id` - Delete comment (admin)

### Users
- `GET /api/users` - Get all users (admin)
- `PUT /api/users/:id` - Update user (admin)
- `DELETE /api/users/:id` - Delete user (admin)

### Subscribers
- `GET /api/subscribers` - Get all subscribers (admin)
- `POST /api/subscribers/subscribe` - Subscribe to newsletter
- `POST /api/subscribers/unsubscribe` - Unsubscribe from newsletter
- `DELETE /api/subscribers/:id` - Delete subscriber (admin)

### Contact
- `GET /api/contact` - Get contact messages (admin)
- `POST /api/contact` - Submit contact form
- `DELETE /api/contact/:id` - Delete contact message (admin)

### Pages
- `GET /api/pages` - Get all pages
- `GET /api/pages/:slug` - Get single page
- `POST /api/pages` - Create page (admin)
- `PUT /api/pages/:id` - Update page (admin)
- `DELETE /api/pages/:id` - Delete page (admin)

### Upload
- `POST /api/upload/image` - Upload image (admin)
- `DELETE /api/upload/image/:filename` - Delete image (admin)

## Default Admin Account

- **Email**: admin@inkwell.com
- **Password**: admin123

## Security Features

- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Helmet security headers
- JWT token authentication
- Input validation and sanitization
- File upload restrictions

## Deployment

1. Set `NODE_ENV=production` in your environment
2. Update `FRONTEND_URL` to your production frontend URL
3. Deploy to your preferred platform (Vercel, Railway, Heroku, etc.)
4. Ensure your Supabase project is configured for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License
