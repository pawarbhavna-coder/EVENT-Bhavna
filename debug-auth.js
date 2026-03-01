// Debug script to test authentication and database connection
const { createClient } = require('@supabase/supabase-js');

// Hardcoded Supabase configuration
const supabaseUrl = 'https://vjdsijuyzhhlofmlzexe.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqZHNpanV5emhobG9mbWx6ZXhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4NzcwNDQsImV4cCI6MjA3MTQ1MzA0NH0.T7pK7N0whtHSkXIXcttNFfyQMqtHlIQbVhYAe7s6UrM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugAuth() {
  console.log('🔍 Starting authentication debug...\n');
  
  try {
    // Test 1: Check database connection
    console.log('1. Testing database connection...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('user_profiles')
      .select('count')
      .limit(1);
    
    if (connectionError) {
      console.error('❌ Database connection failed:', connectionError.message);
      return;
    } else {
      console.log('✅ Database connection successful');
    }

    // Test 2: Check if user_profiles table exists and has correct structure
    console.log('\n2. Checking user_profiles table structure...');
    const { data: tableInfo, error: tableError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);
    
    if (tableError) {
      console.error('❌ user_profiles table issue:', tableError.message);
      console.log('💡 Solution: Run the fix_user_creation.sql migration');
      return;
    } else {
      console.log('✅ user_profiles table accessible');
    }

    // Test 3: Test user registration
    console.log('\n3. Testing user registration...');
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'testpass123';
    
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: 'Test User',
          role: 'attendee'
        }
      }
    });

    if (signUpError) {
      console.error('❌ Registration failed:', signUpError.message);
      
      // Provide specific solutions based on error type
      if (signUpError.message.includes('relation "user_profiles" does not exist')) {
        console.log('💡 Solution: The user_profiles table is missing. Run the database migration.');
      } else if (signUpError.message.includes('permission denied')) {
        console.log('💡 Solution: RLS policies are blocking user creation. Check the policies.');
      } else if (signUpError.message.includes('trigger')) {
        console.log('💡 Solution: The profile creation trigger is missing or broken.');
      }
      
      return;
    } else {
      console.log('✅ Registration successful for test user');
      console.log('User ID:', signUpData.user?.id);
    }

    // Test 4: Check if profile was created
    console.log('\n4. Checking if user profile was created...');
    if (signUpData.user?.id) {
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', signUpData.user.id)
        .single();
      
      if (profileError) {
        console.error('❌ Profile creation failed:', profileError.message);
        console.log('💡 Solution: The trigger function is not working properly.');
      } else {
        console.log('✅ User profile created successfully');
        console.log('Profile data:', profileData);
      }
    }

    console.log('\n🎉 Debug complete! If you see this message, the basic auth flow is working.');
    
  } catch (error) {
    console.error('❌ Unexpected error during debug:', error);
  }
}

// Run the debug
debugAuth().catch(console.error);