-- Add welcome_text fields to hero_slides table
ALTER TABLE public.hero_slides
ADD COLUMN IF NOT EXISTS welcome_text text,
ADD COLUMN IF NOT EXISTS welcome_text_bn text;