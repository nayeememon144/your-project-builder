-- Add department detail fields for head message and syllabus
ALTER TABLE public.departments
ADD COLUMN IF NOT EXISTS head_message text,
ADD COLUMN IF NOT EXISTS head_message_bn text,
ADD COLUMN IF NOT EXISTS syllabus_content text,
ADD COLUMN IF NOT EXISTS syllabus_content_bn text,
ADD COLUMN IF NOT EXISTS syllabus_pdf_url text;