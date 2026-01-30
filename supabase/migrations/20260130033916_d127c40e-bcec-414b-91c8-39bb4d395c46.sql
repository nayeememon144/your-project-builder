
-- First, we need to drop the foreign key constraint on profiles.user_id
-- to allow inserting public-facing teacher profiles without requiring auth accounts

-- Drop the existing foreign key constraint if it exists
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;

-- Make user_id nullable for public profiles (teachers added by admin don't need auth accounts)
ALTER TABLE public.profiles ALTER COLUMN user_id DROP NOT NULL;

-- Add a check to ensure at least one identifier exists
-- (either user_id for auth users or employee_id for staff)
