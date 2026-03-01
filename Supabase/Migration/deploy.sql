-- Complete deployment script for EventEase database
-- This script combines all migrations for easy deployment

-- Run the initial schema
\i 001_initial_schema.sql

-- Run the sample data
\i 002_sample_data.sql

-- Run the user tables (for future auth)
\i 003_user_tables.sql

-- Verify deployment
SELECT 'Database deployment completed successfully!' as status;
