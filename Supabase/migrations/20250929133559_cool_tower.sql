@@ .. @@
 -- Run the user tables (for future auth)
 \i 003_user_tables.sql
 
+-- Run the profile trigger setup
+\i 004_create_profile_trigger.sql
+
 -- Verify deployment
 SELECT 'Database deployment completed successfully!' as status;