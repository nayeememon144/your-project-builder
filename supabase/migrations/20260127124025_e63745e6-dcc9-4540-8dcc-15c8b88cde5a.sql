-- First, clear existing data and insert correct SSTU faculties and departments
-- Delete existing departments and faculties
DELETE FROM public.departments;
DELETE FROM public.faculties;

-- Insert SSTU Faculties based on actual university structure
INSERT INTO public.faculties (name, name_bn, short_name, description, display_order, is_active) VALUES
('Faculty of Engineering', 'প্রকৌশল অনুষদ', 'FOE', 'The Faculty of Engineering offers programs in various engineering disciplines', 1, true),
('Faculty of Science', 'বিজ্ঞান অনুষদ', 'FOS', 'The Faculty of Science offers programs in fundamental sciences', 2, true),
('Faculty of Arts & Social Science', 'কলা ও সামাজিক বিজ্ঞান অনুষদ', 'FASS', 'The Faculty of Arts & Social Science offers programs in humanities and social sciences', 3, true),
('Faculty of Business Studies', 'ব্যবসায় শিক্ষা অনুষদ', 'FBS', 'The Faculty of Business Studies offers programs in business and management', 4, true),
('Faculty of Law', 'আইন অনুষদ', 'FOL', 'The Faculty of Law offers programs in legal studies', 5, true),
('Faculty of Life Sciences', 'জীববিজ্ঞান অনুষদ', 'FLS', 'The Faculty of Life Sciences offers programs in biological sciences', 6, true);

-- Insert SSTU Departments based on actual university structure
INSERT INTO public.departments (name, name_bn, short_name, code, faculty_id, description, display_order, is_active)
SELECT 'Computer Science & Engineering', 'কম্পিউটার বিজ্ঞান ও প্রকৌশল', 'CSE', 'CSE', id, 'Department of Computer Science & Engineering', 1, true
FROM public.faculties WHERE short_name = 'FOE';

INSERT INTO public.departments (name, name_bn, short_name, code, faculty_id, description, display_order, is_active)
SELECT 'Electrical & Electronic Engineering', 'তড়িৎ ও ইলেকট্রনিক প্রকৌশল', 'EEE', 'EEE', id, 'Department of Electrical & Electronic Engineering', 2, true
FROM public.faculties WHERE short_name = 'FOE';

INSERT INTO public.departments (name, name_bn, short_name, code, faculty_id, description, display_order, is_active)
SELECT 'Civil Engineering', 'পুরকৌশল', 'CE', 'CE', id, 'Department of Civil Engineering', 3, true
FROM public.faculties WHERE short_name = 'FOE';

INSERT INTO public.departments (name, name_bn, short_name, code, faculty_id, description, display_order, is_active)
SELECT 'Mechanical Engineering', 'যন্ত্র প্রকৌশল', 'ME', 'ME', id, 'Department of Mechanical Engineering', 4, true
FROM public.faculties WHERE short_name = 'FOE';

INSERT INTO public.departments (name, name_bn, short_name, code, faculty_id, description, display_order, is_active)
SELECT 'Mathematics', 'গণিত', 'MATH', 'MATH', id, 'Department of Mathematics', 1, true
FROM public.faculties WHERE short_name = 'FOS';

INSERT INTO public.departments (name, name_bn, short_name, code, faculty_id, description, display_order, is_active)
SELECT 'Physics', 'পদার্থবিজ্ঞান', 'PHY', 'PHY', id, 'Department of Physics', 2, true
FROM public.faculties WHERE short_name = 'FOS';

INSERT INTO public.departments (name, name_bn, short_name, code, faculty_id, description, display_order, is_active)
SELECT 'Chemistry', 'রসায়ন', 'CHEM', 'CHEM', id, 'Department of Chemistry', 3, true
FROM public.faculties WHERE short_name = 'FOS';

INSERT INTO public.departments (name, name_bn, short_name, code, faculty_id, description, display_order, is_active)
SELECT 'Statistics', 'পরিসংখ্যান', 'STAT', 'STAT', id, 'Department of Statistics', 4, true
FROM public.faculties WHERE short_name = 'FOS';

INSERT INTO public.departments (name, name_bn, short_name, code, faculty_id, description, display_order, is_active)
SELECT 'English', 'ইংরেজি', 'ENG', 'ENG', id, 'Department of English', 1, true
FROM public.faculties WHERE short_name = 'FASS';

INSERT INTO public.departments (name, name_bn, short_name, code, faculty_id, description, display_order, is_active)
SELECT 'Economics', 'অর্থনীতি', 'ECO', 'ECO', id, 'Department of Economics', 2, true
FROM public.faculties WHERE short_name = 'FASS';

INSERT INTO public.departments (name, name_bn, short_name, code, faculty_id, description, display_order, is_active)
SELECT 'Accounting', 'হিসাববিজ্ঞান', 'ACC', 'ACC', id, 'Department of Accounting', 1, true
FROM public.faculties WHERE short_name = 'FBS';

INSERT INTO public.departments (name, name_bn, short_name, code, faculty_id, description, display_order, is_active)
SELECT 'Management', 'ব্যবস্থাপনা', 'MGT', 'MGT', id, 'Department of Management', 2, true
FROM public.faculties WHERE short_name = 'FBS';

-- Create storage bucket for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('attachments', 'attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for attachments bucket
CREATE POLICY "Public can view attachments" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'attachments');

CREATE POLICY "Admins can upload attachments" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'attachments' AND public.is_admin());

CREATE POLICY "Admins can update attachments" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'attachments' AND public.is_admin());

CREATE POLICY "Admins can delete attachments" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'attachments' AND public.is_admin());