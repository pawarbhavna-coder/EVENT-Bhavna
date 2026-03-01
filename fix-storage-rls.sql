-- Fix Storage RLS Policies
-- Run this in Supabase SQL Editor

-- First, disable RLS temporarily to test
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies (if any)
DROP POLICY IF EXISTS "Public read access for event images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated insert for event images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update for event images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete for event images" ON storage.objects;

DROP POLICY IF EXISTS "Public read access for profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated insert for profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update for profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete for profile pictures" ON storage.objects;

DROP POLICY IF EXISTS "Public read access for banners" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated insert for banners" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update for banners" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete for banners" ON storage.objects;

DROP POLICY IF EXISTS "Public read access for documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated insert for documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update for documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete for documents" ON storage.objects;

-- Create simple, permissive policies
CREATE POLICY "Allow public read access" ON storage.objects
FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert" ON storage.objects
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update" ON storage.objects
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete" ON storage.objects
FOR DELETE USING (auth.role() = 'authenticated');

-- Re-enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Test the policies
SELECT 'Storage policies updated successfully' as status;

