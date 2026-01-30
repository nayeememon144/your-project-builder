
-- Drop the foreign key constraint on research_papers.teacher_id
-- This allows research papers to be linked to public profiles without auth accounts

ALTER TABLE public.research_papers DROP CONSTRAINT IF EXISTS research_papers_teacher_id_fkey;

-- Update RLS policy for research papers to allow viewing by profile id
DROP POLICY IF EXISTS "Anyone can view approved research papers" ON public.research_papers;

CREATE POLICY "Anyone can view approved research papers" 
ON public.research_papers 
FOR SELECT 
USING (status = 'published');
