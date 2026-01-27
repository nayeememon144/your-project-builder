// SSTU University Database Types

export type AppRole = 'admin' | 'teacher' | 'student';
export type PublicationType = 'journal' | 'conference' | 'book_chapter' | 'patent' | 'other';
export type ContentStatus = 'draft' | 'pending' | 'published' | 'archived';

export interface Faculty {
  id: string;
  name: string;
  name_bn?: string;
  short_name?: string;
  description?: string;
  description_bn?: string;
  dean_id?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: string;
  faculty_id?: string;
  name: string;
  name_bn?: string;
  short_name?: string;
  code?: string;
  description?: string;
  description_bn?: string;
  vision?: string;
  mission?: string;
  head_id?: string;
  established_year?: number;
  contact_email?: string;
  contact_phone?: string;
  office_location?: string;
  website_url?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Program {
  id: string;
  department_id?: string;
  name: string;
  name_bn?: string;
  degree_type: string;
  duration_years?: number;
  total_credits?: number;
  description?: string;
  admission_requirements?: string;
  career_opportunities?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  full_name_bn?: string;
  email?: string;
  phone?: string;
  profile_photo?: string;
  department_id?: string;
  faculty_id?: string;
  designation?: string;
  employee_id?: string;
  areas_of_interest?: string[];
  academic_background?: string;
  professional_experience?: string;
  google_scholar_url?: string;
  researchgate_url?: string;
  orcid_url?: string;
  student_id?: string;
  batch?: string;
  session?: string;
  semester?: number;
  program_id?: string;
  is_active: boolean;
  is_verified: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export interface NoticeCategory {
  id: string;
  name: string;
  name_bn?: string;
  slug: string;
  description?: string;
  icon?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Notice {
  id: string;
  title: string;
  title_bn?: string;
  description: string;
  description_bn?: string;
  category_id?: string;
  target_audience: string[];
  attachments: any[];
  published_at?: string;
  expires_at?: string;
  is_pinned: boolean;
  is_featured: boolean;
  status: ContentStatus;
  created_by?: string;
  views: number;
  created_at: string;
  updated_at: string;
  category?: NoticeCategory;
}

export interface News {
  id: string;
  title: string;
  title_bn?: string;
  slug: string;
  content: string;
  content_bn?: string;
  excerpt?: string;
  featured_image?: string;
  category?: string;
  tags?: string[];
  published_at?: string;
  is_featured: boolean;
  status: ContentStatus;
  created_by?: string;
  views: number;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  title_bn?: string;
  description?: string;
  description_bn?: string;
  event_date: string;
  end_date?: string;
  venue?: string;
  organizer?: string;
  featured_image?: string;
  attachments: any[];
  is_featured: boolean;
  status: ContentStatus;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ResearchPaper {
  id: string;
  teacher_id: string;
  department_id?: string;
  publication_type: PublicationType;
  title: string;
  authors: string[];
  is_corresponding_author: boolean;
  journal_conference_name?: string;
  publisher?: string;
  publication_date?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi_link?: string;
  google_scholar_link?: string;
  researchgate_link?: string;
  pubmed_link?: string;
  scopus_link?: string;
  abstract?: string;
  keywords?: string[];
  research_areas?: string[];
  citation_count: number;
  indexed_in?: string[];
  impact_factor?: number;
  pdf_url?: string;
  status: ContentStatus;
  reviewed_by?: string;
  review_notes?: string;
  submitted_at: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  title_bn?: string;
  description?: string;
  cover_image?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GalleryImage {
  id: string;
  album_id?: string;
  image_url: string;
  thumbnail_url?: string;
  title?: string;
  description?: string;
  display_order: number;
  created_at: string;
}

export interface SiteSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  setting_type: string;
  description?: string;
  updated_by?: string;
  updated_at: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  title_bn?: string;
  subtitle?: string;
  subtitle_bn?: string;
  image_url: string;
  cta_text?: string;
  cta_link?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface QuickStat {
  id: string;
  label: string;
  label_bn?: string;
  value: number;
  icon?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
