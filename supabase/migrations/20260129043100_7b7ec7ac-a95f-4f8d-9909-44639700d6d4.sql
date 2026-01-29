-- Allow admins to view all user roles (needed for Teachers Management to join profiles with user_roles)
CREATE POLICY "Admins can view all user roles"
ON public.user_roles
FOR SELECT
USING (public.is_admin());