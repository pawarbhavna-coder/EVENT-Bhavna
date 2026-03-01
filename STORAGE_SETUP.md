# Storage Setup Guide for EventEase

## Issue
The application is failing with "Upload failed: Bucket not found" because the required Supabase storage buckets don't exist yet.

## Solution

### Option 1: Manual Setup (Recommended)

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard/project/vjdsijuyzhhlofmlzexe
   - Sign in to your Supabase account

2. **Navigate to Storage**
   - Click on "Storage" in the left sidebar
   - You'll see the storage management interface

3. **Create Required Buckets**
   Create the following buckets (click "New bucket" for each):

   **Bucket 1: event-images**
   - Name: `event-images`
   - Public: ✅ (checked)
   - File size limit: 5MB
   - Allowed MIME types: image/jpeg, image/jpg, image/png, image/gif, image/webp

   **Bucket 2: profile-pictures**
   - Name: `profile-pictures`
   - Public: ✅ (checked)
   - File size limit: 2MB
   - Allowed MIME types: image/jpeg, image/jpg, image/png, image/gif, image/webp

   **Bucket 3: banners**
   - Name: `banners`
   - Public: ✅ (checked)
   - File size limit: 10MB
   - Allowed MIME types: image/jpeg, image/jpg, image/png, image/gif, image/webp

   **Bucket 4: documents**
   - Name: `documents`
   - Public: ✅ (checked)
   - File size limit: 20MB
   - Allowed MIME types: application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document

4. **Set Storage Policies**
   For each bucket, you need to set up Row Level Security (RLS) policies:

   **Public Read Policy:**
   ```sql
   CREATE POLICY "Public read access" ON storage.objects
   FOR SELECT USING (bucket_id = 'bucket-name');
   ```

   **Authenticated Upload Policy:**
   ```sql
   CREATE POLICY "Authenticated upload access" ON storage.objects
   FOR INSERT WITH CHECK (bucket_id = 'bucket-name' AND auth.role() = 'authenticated');
   ```

   **Authenticated Update Policy:**
   ```sql
   CREATE POLICY "Authenticated update access" ON storage.objects
   FOR UPDATE USING (bucket_id = 'bucket-name' AND auth.role() = 'authenticated');
   ```

   **Authenticated Delete Policy:**
   ```sql
   CREATE POLICY "Authenticated delete access" ON storage.objects
   FOR DELETE USING (bucket_id = 'bucket-name' AND auth.role() = 'authenticated');
   ```

### Option 2: Use Supabase CLI (Advanced)

If you have Supabase CLI installed:

```bash
# Install Supabase CLI if you haven't
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref vjdsijuyzhhlofmlzexe

# Create storage buckets
supabase storage create event-images --public
supabase storage create profile-pictures --public
supabase storage create banners --public
supabase storage create documents --public
```

### Option 3: Programmatic Setup (Requires Service Key)

If you have access to the Supabase service key, you can run:

```bash
node setup-storage-buckets.js
```

**Note:** This requires the service key which should be kept secure and not committed to version control.

## Verification

After setting up the buckets, you can verify they exist by running:

```bash
node setup-storage-buckets-simple.js
```

This will check if all required buckets are present and accessible.

## Troubleshooting

### Common Issues:

1. **"Bucket not found" error**
   - Ensure the bucket names match exactly: `event-images`, `profile-pictures`, `banners`, `documents`
   - Check that buckets are marked as public

2. **"Permission denied" error**
   - Verify RLS policies are set correctly
   - Ensure the bucket allows public read access

3. **"File too large" error**
   - Check the file size limits on each bucket
   - Ensure the file being uploaded is within the allowed size

4. **"Invalid MIME type" error**
   - Verify the file type is allowed in the bucket configuration
   - Check the allowed MIME types match the file being uploaded

## Security Notes

- All buckets are set to public for read access (required for displaying images)
- Upload access is restricted to authenticated users only
- Consider implementing additional security measures for production use
- Regularly review and update storage policies as needed

## Next Steps

Once the storage buckets are set up:

1. Test file uploads in the application,
2. Verify images display correctly
3. Test different file types and sizes
4. Monitor storage usage in the Supabase dashboard

The application should now work correctly with file uploads and image management features.
