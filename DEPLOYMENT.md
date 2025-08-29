# Deployment Guide

This guide covers multiple deployment options for the OwnWrites blog platform.

## Prerequisites

1. **Supabase Setup**
   - Create a Supabase project at [supabase.com](https://supabase.com)
   - Run the SQL migrations from `Backend/src/migrations/schema.sql`
   - Run the sample data from `Backend/src/migrations/sample-data.sql`
   - Create a storage bucket named `blog-images`
   - Note your project URL and service role key

2. **Environment Variables**
   - Copy `Backend/.env.example` to `Backend/.env`
   - Fill in your Supabase credentials and other required values
   - Copy `Frontend/.env.example` to `Frontend/.env`
   - Set `VITE_API_URL` to your backend URL

## Deployment Options

### 1. Docker Deployment (Recommended)

#### Full Stack with Docker Compose
```bash
# Clone the repository
git clone <your-repo-url>
cd blog_site_new

# Set up environment variables
cp Backend/.env.example Backend/.env
# Edit Backend/.env with your values

# Build and run
docker-compose up -d

# Access the application
# Frontend: http://localhost
# Backend: http://localhost:5000
```

#### Individual Services
```bash
# Backend only
cd Backend
docker build -t ownwrites-backend .
docker run -p 5000:5000 --env-file .env ownwrites-backend

# Frontend only
cd Frontend
docker build -t ownwrites-frontend .
docker run -p 80:80 ownwrites-frontend
```

### 2. Railway Deployment

#### Backend on Railway
1. Connect your GitHub repository to Railway
2. Create a new project and select the `Backend` folder
3. Add environment variables in Railway dashboard:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `JWT_SECRET`
   - `FRONTEND_URL` (your frontend domain)
4. Deploy automatically triggers on git push

#### Frontend on Vercel/Netlify
1. Connect repository to Vercel/Netlify
2. Set build directory to `Frontend`
3. Set build command to `npm run build`
4. Set output directory to `dist`
5. Add environment variable `VITE_API_URL` with your Railway backend URL

### 3. Vercel Deployment

#### Backend (Serverless)
1. Install Vercel CLI: `npm i -g vercel`
2. In the Backend directory: `vercel`
3. Configure environment variables in Vercel dashboard
4. The `vercel.json` file is already configured

#### Frontend
1. Connect repository to Vercel
2. Set root directory to `Frontend`
3. Add `VITE_API_URL` environment variable
4. Deploy automatically on git push

### 4. Traditional VPS Deployment

#### Using PM2 (Process Manager)
```bash
# Install PM2 globally
npm install -g pm2

# Backend
cd Backend
npm install
npm run build  # if you have a build step
pm2 start src/server.js --name "ownwrites-backend"

# Frontend
cd Frontend
npm install
npm run build
# Serve with nginx or apache
```

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        root /path/to/Frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Environment Variables Reference

### Backend (.env)
```env
# Supabase
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-url.com/api
```

## Post-Deployment Steps

1. **Test the Application**
   - Visit your frontend URL
   - Try logging in with admin credentials: `admin@ownwrites.com` / `admin123`
   - Test creating posts, categories, and other features

2. **Security Checklist**
   - Change default admin password
   - Verify CORS settings
   - Check Supabase RLS policies
   - Enable HTTPS in production
   - Set up proper backup strategies

3. **Performance Optimization**
   - Enable CDN for static assets
   - Configure caching headers
   - Monitor application performance
   - Set up logging and monitoring

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `FRONTEND_URL` is set correctly in backend
   - Check Supabase CORS settings

2. **Database Connection Issues**
   - Verify Supabase credentials
   - Check network connectivity
   - Ensure database migrations are applied

3. **File Upload Issues**
   - Verify Supabase storage bucket exists
   - Check file size limits
   - Ensure proper permissions

### Logs and Monitoring

- Backend logs: Check your deployment platform's logs
- Frontend errors: Check browser console
- Database issues: Check Supabase dashboard

## Scaling Considerations

- **Database**: Supabase handles scaling automatically
- **Backend**: Use load balancers for multiple instances
- **Frontend**: CDN distribution for global performance
- **Storage**: Supabase storage scales with usage

For additional help, refer to the README files in Backend and Frontend directories.
