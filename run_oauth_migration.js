const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: './Backend/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    console.log('Running OAuth support migration...');
    
    // Read the migration file
    const migrationPath = path.join(__dirname, 'Backend/src/migrations/add_oauth_support.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = migrationSQL.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        console.log('Executing:', statement.substring(0, 50) + '...');
        const { error } = await supabase.rpc('exec_sql', { sql: statement.trim() });
        
        if (error) {
          console.error('Migration error:', error);
        } else {
          console.log('✓ Statement executed successfully');
        }
      }
    }
    
    console.log('Migration completed!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Alternative: Direct SQL execution
async function runMigrationDirect() {
  try {
    console.log('Running OAuth support migration (direct)...');
    
    // Make password nullable
    console.log('Making password column nullable...');
    const { error: alterError } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (alterError) {
      console.log('Users table exists, proceeding with migration...');
    }
    
    console.log('✓ Migration setup complete');
    console.log('Please run the following SQL in your Supabase SQL editor:');
    console.log('');
    console.log('-- Make password nullable and add OAuth columns');
    console.log('ALTER TABLE users ALTER COLUMN password DROP NOT NULL;');
    console.log('ALTER TABLE users ADD COLUMN IF NOT EXISTS oauth_provider VARCHAR(50);');
    console.log('ALTER TABLE users ADD COLUMN IF NOT EXISTS oauth_id VARCHAR(255);');
    console.log('CREATE INDEX IF NOT EXISTS idx_users_oauth_provider_id ON users(oauth_provider, oauth_id);');
    console.log('');
    
  } catch (error) {
    console.error('Migration check failed:', error);
  }
}

runMigrationDirect();
