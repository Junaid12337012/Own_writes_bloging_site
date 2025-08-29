-- Migration to add OAuth support to users table
-- Run this after the initial schema.sql

-- Make password column nullable for OAuth users
ALTER TABLE users ALTER COLUMN password DROP NOT NULL;

-- Add OAuth provider and ID columns if they don't exist
DO $$ 
BEGIN
    -- Add oauth_provider column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'oauth_provider') THEN
        ALTER TABLE users ADD COLUMN oauth_provider VARCHAR(50);
    END IF;
    
    -- Add oauth_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'oauth_id') THEN
        ALTER TABLE users ADD COLUMN oauth_id VARCHAR(255);
    END IF;
END $$;

-- Add index for OAuth lookups
CREATE INDEX IF NOT EXISTS idx_users_oauth_provider_id ON users(oauth_provider, oauth_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Update existing users to have empty password if null
UPDATE users SET password = '' WHERE password IS NULL;
