-- =====================================================
-- Supabase Storage Policies for EventEase
-- =====================================================
-- Run these commands in your Supabase SQL Editor
-- Go to: https://supabase.com/dashboard/project/vjdsijuyzhhlofmlzexe/sql

-- =====================================================
-- 1. EVENT-IMAGES BUCKET POLICIES
-- =====================================================

-- Allow public read access to event images
CREATE POLICY "Public read access for event images" ON storage.objects
FOR SELECT USING (bucket_id = 'event-images');

-- Allow authenticated users to upload event images
CREATE POLICY "Authenticated upload for event images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'event-images' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update their own event images
CREATE POLICY "Authenticated update for event images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'event-images' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete their own event images
CREATE POLICY "Authenticated delete for event images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'event-images' 
  AND auth.role() = 'authenticated'
);

-- =====================================================
-- 2. PROFILE-PICTURES BUCKET POLICIES
-- =====================================================

-- Allow public read access to profile pictures
CREATE POLICY "Public read access for profile pictures" ON storage.objects
FOR SELECT USING (bucket_id = 'profile-pictures');

-- Allow authenticated users to upload profile pictures
CREATE POLICY "Authenticated upload for profile pictures" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'profile-pictures' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update their own profile pictures
CREATE POLICY "Authenticated update for profile pictures" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'profile-pictures' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete their own profile pictures
CREATE POLICY "Authenticated delete for profile pictures" ON storage.objects
FOR DELETE USING (
  bucket_id = 'profile-pictures' 
  AND auth.role() = 'authenticated'
);

-- =====================================================
-- 3. BANNERS BUCKET POLICIES
-- =====================================================

-- Allow public read access to banners
CREATE POLICY "Public read access for banners" ON storage.objects
FOR SELECT USING (bucket_id = 'banners');

-- Allow authenticated users to upload banners
CREATE POLICY "Authenticated upload for banners" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'banners' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update banners
CREATE POLICY "Authenticated update for banners" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'banners' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete banners
CREATE POLICY "Authenticated delete for banners" ON storage.objects
FOR DELETE USING (
  bucket_id = 'banners' 
  AND auth.role() = 'authenticated'
);

-- =====================================================
-- 4. DOCUMENTS BUCKET POLICIES
-- =====================================================

-- Allow public read access to documents
CREATE POLICY "Public read access for documents" ON storage.objects
FOR SELECT USING (bucket_id = 'documents');

-- Allow authenticated users to upload documents
CREATE POLICY "Authenticated upload for documents" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'documents' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update documents
CREATE POLICY "Authenticated update for documents" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'documents' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete documents
CREATE POLICY "Authenticated delete for documents" ON storage.objects
FOR DELETE USING (
  bucket_id = 'documents' 
  AND auth.role() = 'authenticated'
);

-- =====================================================
-- 5. ADVANCED POLICIES (Optional - More Secure)
-- =====================================================

-- More restrictive policy for event images (only event owners can modify)
-- Uncomment and modify if you want more granular control

/*
-- Allow only event owners to update/delete their event images
CREATE POLICY "Event owner can modify event images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'event-images' 
  AND auth.role() = 'authenticated'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Event owner can delete event images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'event-images' 
  AND auth.role() = 'authenticated'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
*/

-- =====================================================
-- 6. VERIFY POLICIES
-- =====================================================

-- Check if policies were created successfully
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%event%' OR policyname LIKE '%profile%' OR policyname LIKE '%banner%' OR policyname LIKE '%document%'
ORDER BY policyname;

-- =====================================================
-- 7. TROUBLESHOOTING
-- =====================================================

-- If you get errors, you might need to enable RLS first:
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- To drop all policies (if you need to start over):
-- DROP POLICY IF EXISTS "Public read access for event images" ON storage.objects;
-- DROP POLICY IF EXISTS "Authenticated upload for event images" ON storage.objects;
-- DROP POLICY IF EXISTS "Authenticated update for event images" ON storage.objects;
-- DROP POLICY IF EXISTS "Authenticated delete for event images" ON storage.objects;
-- (Repeat for other buckets...)
