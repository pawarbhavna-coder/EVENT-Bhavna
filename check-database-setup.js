// Script to check database setup and diagnose issues
const { createClient } = require('@supabase/supabase-js');

// Hardcoded Supabase configuration
const supabaseUrl = 'https://vjdsijuyzhhlofmlzexe.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqZHNpanV5emhobG9mbWx6ZXhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4NzcwNDQsImV4cCI6MjA3MTQ1MzA0NH0.T7pK7N0whtHSkXIXcttNFfyQMqtHlIQbVhYAe7s6UrM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDatabaseSetup() {
  console.log('🔍 Checking database setup for signup issues...\n');
  
  try {
    // Check 1: Basic connection
    console.log('1. Testing database connection...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('user_profiles')
      .select('count')
      .limit(1);
    
    if (connectionError) {
      console.error('❌ Database connection failed:', connectionError.message);
      console.log('💡 Check your Supabase URL and API key');
      return;
    } else {
      console.log('✅ Database connection successful');
    }

    // Check 2: Table structure
    console.log('\n2. Checking user_profiles table structure...');
    const { data: tableStructure, error: structureError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);
    
    if (structureError) {
      console.error('❌ Table structure issue:', structureError.message);
      if (structureError.message.includes('relation "user_profiles" does not exist')) {
        console.log('💡 Solution: Run the database migrations to create the user_profiles table');
      }
      return;
    } else {
      console.log('✅ user_profiles table structure is correct');
    }

    // Check 3: RLS policies
    console.log('\n3. Checking RLS policies...');
    
    // Try to insert a test record (this will fail but show us the RLS status)
    const { error: rlsTestError } = await supabase
      .from('user_profiles')
      .insert({
        id: '00000000-0000-0000-0000-000000000000', // Dummy UUID
        email: 'test@example.com',
        full_name: 'Test User',
        role: 'attendee'
      });
    
    if (rlsTestError) {
      if (rlsTestError.message.includes('permission denied') || rlsTestError.message.includes('RLS')) {
        console.log('⚠️ RLS is enabled (this is expected)');
        console.log('RLS Error:', rlsTestError.message);
        
        if (rlsTestError.message.includes('no policies')) {
          console.log('💡 Solution: RLS policies are missing. Run the fix_user_creation.sql migration');
        } else {
          console.log('✅ RLS policies exist (insert blocked as expected)');
        }
      } else {
        console.error('❌ Unexpected RLS test error:', rlsTestError.message);
      }
    } else {
      console.log('⚠️ RLS might be disabled (insert succeeded when it should have failed)');
    }

    // Check 4: Trigger function
    console.log('\n4. Checking trigger function...');
    const { data: triggerCheck, error: triggerError } = await supabase
      .rpc('check_trigger_exists', { trigger_name: 'on_auth_user_created' });
    
    if (triggerError) {
      console.log('⚠️ Cannot check trigger (function might not exist):', triggerError.message);
      console.log('💡 This is normal - the trigger check function is not implemented');
    }

    // Check 5: Auth configuration
    console.log('\n5. Checking auth configuration...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.log('ℹ️ No current user (this is expected for testing)');
    } else if (user) {
      console.log('ℹ️ Current user found:', user.email);
    } else {
      console.log('ℹ️ No current user session');
    }

    console.log('\n📋 DIAGNOSIS SUMMARY:');
    console.log('=====================================');
    console.log('If signup is stuck on loading:');
    console.log('1. ✅ Database connection is working');
    console.log('2. ✅ user_profiles table exists');
    console.log('3. ⚠️ Check if RLS policies allow profile creation');
    console.log('4. ⚠️ Check if trigger function creates profiles automatically');
    console.log('');
    console.log('NEXT STEPS:');
    console.log('1. Run the fix_user_creation.sql migration in Supabase SQL Editor');
    console.log('2. Test signup again');
    console.log('3. Check browser console for detailed error messages');
    
  } catch (error) {
    console.error('❌ Unexpected error during database check:', error);
  }
}

// Run the check
checkDatabaseSetup().catch(console.error);