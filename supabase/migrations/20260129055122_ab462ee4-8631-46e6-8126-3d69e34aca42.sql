-- Create a function to get public stats that bypasses RLS
CREATE OR REPLACE FUNCTION public.get_public_stats()
RETURNS json
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'faculties', (SELECT COUNT(*) FROM faculties WHERE is_active = true),
    'departments', (SELECT COUNT(*) FROM departments WHERE is_active = true),
    'teachers', (SELECT COUNT(*) FROM profiles p 
                 JOIN user_roles ur ON ur.user_id = p.user_id 
                 WHERE ur.role = 'teacher' AND p.is_active = true AND p.is_verified = true),
    'students', (SELECT COUNT(*) FROM profiles p 
                 JOIN user_roles ur ON ur.user_id = p.user_id 
                 WHERE ur.role = 'student' AND p.is_active = true),
    'all_teachers', (SELECT COUNT(*) FROM profiles p 
                     JOIN user_roles ur ON ur.user_id = p.user_id 
                     WHERE ur.role = 'teacher' AND p.is_active = true)
  ) INTO result;
  
  RETURN result;
END;
$$;

-- Grant execute permission to anonymous users
GRANT EXECUTE ON FUNCTION public.get_public_stats() TO anon;
GRANT EXECUTE ON FUNCTION public.get_public_stats() TO authenticated;