-- ============================================
-- SSTU University Database Schema
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CUSTOM TYPES
-- ============================================

CREATE TYPE public.app_role AS ENUM ('admin', 'teacher', 'student');
CREATE TYPE public.publication_type AS ENUM ('journal', 'conference', 'book_chapter', 'patent', 'other');
CREATE TYPE public.content_status AS ENUM ('draft', 'pending', 'published', 'archived');

-- ============================================
-- USER ROLES TABLE (Security critical - separate from profiles)
-- ============================================

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'student',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- SECURITY DEFINER FUNCTIONS (prevent RLS recursion)
-- ============================================

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

CREATE OR REPLACE FUNCTION public.is_teacher()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'teacher')
$$;

CREATE OR REPLACE FUNCTION public.is_student()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'student')
$$;

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1
$$;

-- ============================================
-- FACULTIES
-- ============================================

CREATE TABLE public.faculties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  name_bn VARCHAR(255),
  short_name VARCHAR(50),
  description TEXT,
  description_bn TEXT,
  dean_id UUID,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.faculties ENABLE ROW LEVEL SECURITY;

-- ============================================
-- DEPARTMENTS
-- ============================================

CREATE TABLE public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_id UUID REFERENCES public.faculties(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  name_bn VARCHAR(255),
  short_name VARCHAR(50),
  code VARCHAR(20),
  description TEXT,
  description_bn TEXT,
  vision TEXT,
  mission TEXT,
  head_id UUID,
  established_year INTEGER,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(20),
  office_location TEXT,
  website_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROGRAMS
-- ============================================

CREATE TABLE public.programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  name_bn VARCHAR(255),
  degree_type VARCHAR(50) NOT NULL DEFAULT 'undergraduate',
  duration_years INTEGER,
  total_credits INTEGER,
  description TEXT,
  admission_requirements TEXT,
  career_opportunities TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES (Extended user info)
-- ============================================

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  full_name_bn VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  profile_photo TEXT,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  faculty_id UUID REFERENCES public.faculties(id) ON DELETE SET NULL,
  -- Teacher specific
  designation VARCHAR(100),
  employee_id VARCHAR(50),
  areas_of_interest TEXT[],
  academic_background TEXT,
  professional_experience TEXT,
  google_scholar_url TEXT,
  researchgate_url TEXT,
  orcid_url TEXT,
  -- Student specific
  student_id VARCHAR(50),
  batch VARCHAR(20),
  session VARCHAR(20),
  semester INTEGER,
  program_id UUID REFERENCES public.programs(id) ON DELETE SET NULL,
  -- Account status
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- NOTICE CATEGORIES
-- ============================================

CREATE TABLE public.notice_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  name_bn VARCHAR(100),
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.notice_categories ENABLE ROW LEVEL SECURITY;

-- ============================================
-- NOTICES
-- ============================================

CREATE TABLE public.notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  title_bn VARCHAR(500),
  description TEXT NOT NULL,
  description_bn TEXT,
  category_id UUID REFERENCES public.notice_categories(id) ON DELETE SET NULL,
  target_audience TEXT[] DEFAULT ARRAY['all'],
  attachments JSONB DEFAULT '[]',
  published_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_pinned BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  status content_status DEFAULT 'draft',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;

-- ============================================
-- NEWS
-- ============================================

CREATE TABLE public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  title_bn VARCHAR(500),
  slug VARCHAR(500) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  content_bn TEXT,
  excerpt TEXT,
  featured_image TEXT,
  category VARCHAR(100),
  tags TEXT[],
  published_at TIMESTAMP WITH TIME ZONE,
  is_featured BOOLEAN DEFAULT false,
  status content_status DEFAULT 'draft',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- ============================================
-- EVENTS
-- ============================================

CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  title_bn VARCHAR(500),
  description TEXT,
  description_bn TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  venue TEXT,
  organizer TEXT,
  featured_image TEXT,
  attachments JSONB DEFAULT '[]',
  is_featured BOOLEAN DEFAULT false,
  status content_status DEFAULT 'published',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RESEARCH PAPERS
-- ============================================

CREATE TABLE public.research_papers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  publication_type publication_type DEFAULT 'journal',
  title TEXT NOT NULL,
  authors TEXT[] NOT NULL,
  is_corresponding_author BOOLEAN DEFAULT false,
  journal_conference_name TEXT,
  publisher TEXT,
  publication_date DATE,
  volume VARCHAR(50),
  issue VARCHAR(50),
  pages VARCHAR(50),
  doi_link TEXT,
  google_scholar_link TEXT,
  researchgate_link TEXT,
  pubmed_link TEXT,
  scopus_link TEXT,
  abstract TEXT,
  keywords TEXT[],
  research_areas TEXT[],
  citation_count INTEGER DEFAULT 0,
  indexed_in TEXT[],
  impact_factor DECIMAL(5,2),
  pdf_url TEXT,
  status content_status DEFAULT 'pending',
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  review_notes TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.research_papers ENABLE ROW LEVEL SECURITY;

-- ============================================
-- GALLERY ALBUMS
-- ============================================

CREATE TABLE public.gallery_albums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  title_bn VARCHAR(255),
  description TEXT,
  cover_image TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery_albums ENABLE ROW LEVEL SECURITY;

-- ============================================
-- GALLERY IMAGES
-- ============================================

CREATE TABLE public.gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id UUID REFERENCES public.gallery_albums(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  title VARCHAR(255),
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- ============================================
-- SITE SETTINGS
-- ============================================

CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  setting_type VARCHAR(50) DEFAULT 'general',
  description TEXT,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- HERO SLIDES
-- ============================================

CREATE TABLE public.hero_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  title_bn VARCHAR(255),
  subtitle TEXT,
  subtitle_bn TEXT,
  image_url TEXT NOT NULL,
  cta_text VARCHAR(100),
  cta_link TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;

-- ============================================
-- QUICK STATS
-- ============================================

CREATE TABLE public.quick_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label VARCHAR(100) NOT NULL,
  label_bn VARCHAR(100),
  value INTEGER NOT NULL,
  icon VARCHAR(50),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.quick_stats ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- User Roles Policies
CREATE POLICY "Admins can manage all user roles" ON public.user_roles
  FOR ALL USING (public.is_admin());

CREATE POLICY "Users can view own role" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Faculties Policies (Public read, admin write)
CREATE POLICY "Anyone can view active faculties" ON public.faculties
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage faculties" ON public.faculties
  FOR ALL USING (public.is_admin());

-- Departments Policies (Public read, admin write)
CREATE POLICY "Anyone can view active departments" ON public.departments
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage departments" ON public.departments
  FOR ALL USING (public.is_admin());

-- Programs Policies
CREATE POLICY "Anyone can view active programs" ON public.programs
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage programs" ON public.programs
  FOR ALL USING (public.is_admin());

-- Profiles Policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all profiles" ON public.profiles
  FOR ALL USING (public.is_admin());

CREATE POLICY "Public can view teacher profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = profiles.user_id AND role = 'teacher'
    ) AND is_active = true
  );

-- Notice Categories Policies
CREATE POLICY "Anyone can view active categories" ON public.notice_categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage categories" ON public.notice_categories
  FOR ALL USING (public.is_admin());

-- Notices Policies
CREATE POLICY "Anyone can view published notices" ON public.notices
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage all notices" ON public.notices
  FOR ALL USING (public.is_admin());

-- News Policies
CREATE POLICY "Anyone can view published news" ON public.news
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage all news" ON public.news
  FOR ALL USING (public.is_admin());

-- Events Policies
CREATE POLICY "Anyone can view published events" ON public.events
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage all events" ON public.events
  FOR ALL USING (public.is_admin());

-- Research Papers Policies
CREATE POLICY "Anyone can view approved research papers" ON public.research_papers
  FOR SELECT USING (status = 'published');

CREATE POLICY "Teachers can manage own papers" ON public.research_papers
  FOR ALL USING (auth.uid() = teacher_id AND public.is_teacher());

CREATE POLICY "Admins can manage all papers" ON public.research_papers
  FOR ALL USING (public.is_admin());

-- Gallery Albums Policies
CREATE POLICY "Anyone can view active albums" ON public.gallery_albums
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage albums" ON public.gallery_albums
  FOR ALL USING (public.is_admin());

-- Gallery Images Policies
CREATE POLICY "Anyone can view gallery images" ON public.gallery_images
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage gallery images" ON public.gallery_images
  FOR ALL USING (public.is_admin());

-- Site Settings Policies
CREATE POLICY "Anyone can view settings" ON public.site_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage settings" ON public.site_settings
  FOR ALL USING (public.is_admin());

-- Hero Slides Policies
CREATE POLICY "Anyone can view active slides" ON public.hero_slides
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage slides" ON public.hero_slides
  FOR ALL USING (public.is_admin());

-- Quick Stats Policies
CREATE POLICY "Anyone can view active stats" ON public.quick_stats
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage stats" ON public.quick_stats
  FOR ALL USING (public.is_admin());

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_department ON public.profiles(department_id);
CREATE INDEX idx_notices_status ON public.notices(status);
CREATE INDEX idx_notices_published ON public.notices(published_at DESC);
CREATE INDEX idx_news_status ON public.news(status);
CREATE INDEX idx_news_published ON public.news(published_at DESC);
CREATE INDEX idx_events_date ON public.events(event_date DESC);
CREATE INDEX idx_research_teacher ON public.research_papers(teacher_id);
CREATE INDEX idx_research_status ON public.research_papers(status);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_faculties_updated_at BEFORE UPDATE ON public.faculties
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON public.departments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON public.programs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notices_updated_at BEFORE UPDATE ON public.notices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON public.news
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_research_papers_updated_at BEFORE UPDATE ON public.research_papers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hero_slides_updated_at BEFORE UPDATE ON public.hero_slides
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quick_stats_updated_at BEFORE UPDATE ON public.quick_stats
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_gallery_albums_updated_at BEFORE UPDATE ON public.gallery_albums
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- FUNCTION TO CREATE USER PROFILE ON SIGNUP
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'), NEW.email);
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'student'));
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();