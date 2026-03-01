# 🔐 Storage Bucket Policies Setup Guide

## What are Storage Policies?

Storage policies in Supabase control **who can do what** with your files:
- **Read**: Who can view/download files
- **Upload**: Who can add new files
- **Update**: Who can modify existing files
- **Delete**: Who can remove files

## Quick Setup (Recommended)

### Step 1: Open Supabase SQL Editor
1. Go to: https://supabase.com/dashboard/project/vjdsijuyzhhlofmlzexe
2. Click **"SQL Editor"** in the left sidebar
3. Click **"New query"**

### Step 2: Run the Policy Script
Copy and paste the entire contents of `setup-storage-policies.sql` into the SQL editor and click **"Run"**.

## Policy Breakdown

### 🖼️ **Event Images Bucket** (`event-images`)
```
✅ Public can view images (for displaying on website)
✅ Authenticated users can upload images
✅ Authenticated users can update images
✅ Authenticated users can delete images
```

### 👤 **Profile Pictures Bucket** (`profile-pictures`)
```
✅ Public can view profile pictures
✅ Authenticated users can upload their own pictures
✅ Authenticated users can update their own pictures
✅ Authenticated users can delete their own pictures
```

### 🎨 **Banners Bucket** (`banners`)
```
✅ Public can view banners
✅ Authenticated users can upload banners
✅ Authenticated users can update banners
✅ Authenticated users can delete banners
```

### 📄 **Documents Bucket** (`documents`)
```
✅ Public can view documents
✅ Authenticated users can upload documents
✅ Authenticated users can update documents
✅ Authenticated users can delete documents
```

## Security Levels

### 🟢 **Basic Security (Current Setup)**
- Anyone can view files (public read)
- Only logged-in users can upload/modify files
- Good for: Public event websites, shared content

### 🟡 **Medium Security (Optional)**
- Public can view files
- Only file owners can modify their files
- Good for: User-specific content

### 🔴 **High Security (Advanced)**
- Only authenticated users can view files
- Only file owners can access their files
- Good for: Private documents, sensitive content

## Common Issues & Solutions

### ❌ **"Permission denied" error**
**Solution**: Run the policy setup script
```sql
-- Enable RLS if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
```

### ❌ **"Policy already exists" error**
**Solution**: Drop existing policies first
```sql
-- Drop all policies for a bucket
DROP POLICY IF EXISTS "Public read access for event images" ON storage.objects;
-- Then run the setup script again
```

### ❌ **Files not showing publicly**
**Solution**: Check if public read policy exists
```sql
-- Verify policies exist
SELECT policyname FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%Public read%';
```

## Testing Your Policies

### 1. Test Public Access
```javascript
// This should work without authentication
const { data } = await supabase.storage
  .from('event-images')
  .getPublicUrl('your-file-path');
console.log(data.publicUrl);
```

### 2. Test Upload (Requires Authentication)
```javascript
// This requires user to be logged in
const { data, error } = await supabase.storage
  .from('event-images')
  .upload('test-file.jpg', file);
```

## Verification Commands

### Check if RLS is enabled:
```sql
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'objects';
```

### List all storage policies:
```sql
SELECT policyname, cmd, roles 
FROM pg_policies 
WHERE tablename = 'objects';
```

### Check specific bucket policies:
```sql
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%event-images%';
```

## Best Practices

1. **Always enable RLS** on storage.objects table
2. **Start with basic policies** and add restrictions as needed
3. **Test thoroughly** after setting up policies
4. **Monitor access logs** in Supabase dashboard
5. **Regularly review** and update policies as needed

## Need Help?

If you encounter issues:
1. Check the Supabase logs in the dashboard
2. Verify your policies with the verification commands above
3. Test with both authenticated and unauthenticated requests
4. Make sure RLS is enabled on the storage.objects table

The policies provided are designed to work with EventEase's requirements while maintaining good security practices! 🚀
