
-- Update RLS policy to allow viewing public teacher profiles
-- Teachers can now be identified by their designation field containing professor/lecturer titles

DROP POLICY IF EXISTS "Public can view teacher profiles" ON public.profiles;

CREATE POLICY "Public can view teacher profiles" 
ON public.profiles 
FOR SELECT 
USING (
  is_active = true 
  AND is_verified = true
  AND designation IS NOT NULL 
  AND (
    designation ILIKE '%professor%' 
    OR designation ILIKE '%lecturer%'
    OR designation ILIKE '%dean%'
    OR designation ILIKE '%chairman%'
    OR (user_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM user_roles WHERE user_roles.user_id = profiles.user_id AND user_roles.role = 'teacher'
    ))
  )
);
