-- Update the get_public_stats function to count teachers by role OR designation
CREATE OR REPLACE FUNCTION public.get_public_stats()
RETURNS json
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'faculties', (SELECT COUNT(*) FROM faculties WHERE is_active = true),
    'departments', (SELECT COUNT(*) FROM departments WHERE is_active = true),
    'teachers', (
      SELECT COUNT(*) FROM profiles p 
      WHERE p.is_active = true 
        AND p.is_verified = true
        AND (
          -- Count users with teacher role
          EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = p.user_id AND ur.role = 'teacher')
          OR
          -- Count profiles with teacher-like designations
          (p.designation IS NOT NULL AND (
            p.designation ILIKE '%professor%' OR 
            p.designation ILIKE '%lecturer%' OR 
            p.designation ILIKE '%dean%' OR 
            p.designation ILIKE '%chairman%'
          ))
        )
    ),
    'students', (
      SELECT COUNT(*) FROM profiles p 
      JOIN user_roles ur ON ur.user_id = p.user_id 
      WHERE ur.role = 'student' AND p.is_active = true
    ),
    'all_teachers', (
      SELECT COUNT(*) FROM profiles p 
      WHERE p.is_active = true 
        AND (
          EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = p.user_id AND ur.role = 'teacher')
          OR
          (p.designation IS NOT NULL AND (
            p.designation ILIKE '%professor%' OR 
            p.designation ILIKE '%lecturer%' OR 
            p.designation ILIKE '%dean%' OR 
            p.designation ILIKE '%chairman%'
          ))
        )
    )
  ) INTO result;
  
  RETURN result;
END;
$$;