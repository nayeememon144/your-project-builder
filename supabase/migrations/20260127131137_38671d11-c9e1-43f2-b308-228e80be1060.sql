-- Clear existing departments and faculties
DELETE FROM public.departments;
DELETE FROM public.faculties;

-- Insert the correct 2 faculties for SSTU
INSERT INTO public.faculties (name, short_name, description, display_order, is_active) VALUES
('Faculty of Science', 'FoS', 'Faculty dedicated to fundamental sciences including Physics, Chemistry, and Mathematics', 1, true),
('Faculty of Engineering & Technology', 'FoET', 'Faculty focused on engineering and technology disciplines', 2, true);

-- Insert the correct 4 departments for SSTU
INSERT INTO public.departments (name, short_name, code, description, faculty_id, display_order, is_active)
SELECT 'Computer Science & Engineering', 'CSE', 'CSE', 'Department of Computer Science and Engineering', f.id, 1, true
FROM public.faculties f WHERE f.short_name = 'FoET';

INSERT INTO public.departments (name, short_name, code, description, faculty_id, display_order, is_active)
SELECT 'Physics', 'PHY', 'PHY', 'Department of Physics', f.id, 2, true
FROM public.faculties f WHERE f.short_name = 'FoS';

INSERT INTO public.departments (name, short_name, code, description, faculty_id, display_order, is_active)
SELECT 'Chemistry', 'CHEM', 'CHEM', 'Department of Chemistry', f.id, 3, true
FROM public.faculties f WHERE f.short_name = 'FoS';

INSERT INTO public.departments (name, short_name, code, description, faculty_id, display_order, is_active)
SELECT 'Mathematics', 'MATH', 'MATH', 'Department of Mathematics', f.id, 4, true
FROM public.faculties f WHERE f.short_name = 'FoS';