/*
  # Fix RLS policies for user_profiles table

  1. Security
    - Update user_profiles policies to allow profile creation during signup
    - Ensure proper INSERT permissions for new user registration

  2. Changes
    - Update "Allow profile creation on signup" policy to be more permissive during registration
*/

-- Update the INSERT policy for user_profiles to allow profile creation
DROP POLICY IF EXISTS "Allow profile creation on signup" ON user_profiles;
CREATE POLICY "Allow profile creation on signup" ON user_profiles
  FOR INSERT WITH CHECK (true);