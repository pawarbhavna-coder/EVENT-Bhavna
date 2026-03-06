-- 1. Create a secure function to check if the current user is an admin
-- SECURITY DEFINER allows it to read user_profiles without triggering infinite recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- 2. Add RLS Policies for user_profiles so Admins can View and Delete all users
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
CREATE POLICY "Admins can view all profiles" 
  ON public.user_profiles
  FOR SELECT 
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete all profiles" ON public.user_profiles;
CREATE POLICY "Admins can delete all profiles" 
  ON public.user_profiles
  FOR DELETE 
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update all profiles" ON public.user_profiles;
CREATE POLICY "Admins can update all profiles" 
  ON public.user_profiles
  FOR UPDATE 
  USING (public.is_admin());

-- 3. Add RLS Policies for events so Admins can View all events (including drafts) and Delete them
DROP POLICY IF EXISTS "Admins can view all events" ON public.events;
CREATE POLICY "Admins can view all events" 
  ON public.events
  FOR SELECT 
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update all events" ON public.events;
CREATE POLICY "Admins can update all events" 
  ON public.events
  FOR UPDATE 
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete all events" ON public.events;
CREATE POLICY "Admins can delete all events" 
  ON public.events
  FOR DELETE 
  USING (public.is_admin());

-- 4. Just in case, grant admins access to all event_tickets, event_schedule, event_speakers, event_sponsors
DROP POLICY IF EXISTS "Admins can view all tickets" ON public.event_tickets;
CREATE POLICY "Admins can view all tickets" ON public.event_tickets FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can view all schedules" ON public.event_schedule;
CREATE POLICY "Admins can view all schedules" ON public.event_schedule FOR SELECT USING (public.is_admin());

-- Verify
SELECT 'Admin RLS policies applied successfully!' as status;
