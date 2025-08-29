# Google OAuth Setup with Supabase

This guide will help you set up Google OAuth authentication for the Inkwell blog platform using Supabase.

## Prerequisites

- A Supabase project
- A Google Cloud Console account
- The blog platform codebase

## Step 1: Configure Google OAuth in Google Cloud Console

1. **Create a Google Cloud Project** (if you don't have one):
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable Google+ API**:
   - In the Google Cloud Console, go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it

3. **Create OAuth 2.0 Credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application" as the application type
   - Add your authorized redirect URIs:
     - For development: `https://your-supabase-project.supabase.co/auth/v1/callback`
     - For production: `https://your-production-domain.supabase.co/auth/v1/callback`
   - Save the Client ID and Client Secret

## Step 2: Configure Supabase Authentication

1. **Access Supabase Dashboard**:
   - Go to your [Supabase Dashboard](https://app.supabase.com/)
   - Select your project

2. **Enable Google OAuth Provider**:
   - Navigate to "Authentication" > "Providers"
   - Find "Google" in the list and toggle it on
   - Enter your Google OAuth credentials:
     - **Client ID**: From Google Cloud Console
     - **Client Secret**: From Google Cloud Console
   - Set the redirect URL to: `https://your-supabase-project.supabase.co/auth/v1/callback`

3. **Configure Site URL**:
   - In "Authentication" > "Settings"
   - Set your Site URL to your frontend domain:
     - Development: `http://localhost:3000`
     - Production: `https://your-domain.com`

4. **Add Redirect URLs**:
   - Add your auth callback URLs:
     - Development: `http://localhost:3000/auth/callback`
     - Production: `https://your-domain.com/auth/callback`

## Step 3: Update Environment Variables

### Frontend (.env)
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:5000/api
```

### Backend (.env)
```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
FRONTEND_URL=http://localhost:3000
```

## Step 4: Update Database Schema

Run the updated schema migration to support OAuth users:

```sql
-- Add OAuth columns to users table
ALTER TABLE users 
ADD COLUMN oauth_provider VARCHAR(50),
ADD COLUMN oauth_id VARCHAR(255),
ALTER COLUMN password DROP NOT NULL;
```

## Step 5: Install Dependencies

### Frontend
```bash
cd Frontend
npm install @supabase/supabase-js
```

### Backend
```bash
cd Backend
npm install @supabase/supabase-js
```

## Step 6: Test the Integration

1. **Start the Backend**:
   ```bash
   cd Backend
   npm run dev
   ```

2. **Start the Frontend**:
   ```bash
   cd Frontend
   npm run dev
   ```

3. **Test Google Login**:
   - Navigate to the login page
   - Click "Continue with Google"
   - Complete the OAuth flow
   - Verify user creation in Supabase dashboard

## How It Works

1. **User clicks "Continue with Google"** → Triggers `loginWithGoogle()` in AuthContext
2. **Supabase handles OAuth flow** → Redirects to Google for authentication
3. **Google redirects back** → User lands on `/auth/callback` page
4. **AuthContext processes session** → Creates user in database if needed
5. **User is logged in** → Redirected to home page

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI"**:
   - Ensure redirect URIs in Google Cloud Console match Supabase settings
   - Check that URLs don't have trailing slashes

2. **"OAuth provider not enabled"**:
   - Verify Google provider is enabled in Supabase dashboard
   - Check that Client ID and Secret are correctly entered

3. **"User creation failed"**:
   - Ensure database schema includes OAuth columns
   - Check Supabase service role key permissions

4. **"Session not found"**:
   - Verify environment variables are loaded correctly
   - Check that Supabase URL and keys are valid

### Debug Tips

- Check browser console for authentication errors
- Monitor Supabase logs in the dashboard
- Verify network requests in browser dev tools
- Test with different Google accounts

## Security Considerations

- Never expose service role keys in frontend code
- Use environment variables for all sensitive data
- Regularly rotate OAuth credentials
- Monitor authentication logs for suspicious activity
- Implement proper CORS settings for production

## Production Deployment

1. Update redirect URIs in Google Cloud Console
2. Set production environment variables
3. Configure proper CORS settings
4. Test OAuth flow in production environment
5. Monitor authentication metrics

## Support

If you encounter issues:
1. Check Supabase documentation: https://supabase.com/docs/guides/auth
2. Review Google OAuth documentation: https://developers.google.com/identity/protocols/oauth2
3. Check the project's GitHub issues
