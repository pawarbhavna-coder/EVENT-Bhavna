/*
  # Fix RLS policies for user_roles table

  1. Security
    - Add missing INSERT policy for user_roles table
    - Allow users to create their own role entries during registration
    - Allow service role to manage all roles for admin operations

  2. Changes
    - Add "Allow role creation on signup" policy for user_roles
    - Add "Service role can manage roles" policy for admin operations
*/

-- Add missing INSERT policy for user_roles table
CREATE POLICY "Allow role creation on signup" ON user_roles
  FOR INSERT WITH CHECK (true);

-- Allow service role to manage all roles (for admin operations)
CREATE POLICY "Service role can manage roles" ON user_roles
  FOR ALL USING (role() = 'service_role');

-- Update existing policies to use proper user ID checking
DROP POLICY IF EXISTS "Users can view own roles" ON user_roles;
CREATE POLICY "Users can view own roles" ON user_roles
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own roles" ON user_roles;  
CREATE POLICY "Users can update own roles" ON user_roles
  FOR UPDATE USING (auth.uid() = user_id);