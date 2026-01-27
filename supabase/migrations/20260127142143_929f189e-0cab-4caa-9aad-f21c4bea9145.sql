-- Create facilities table for managing campus facilities
CREATE TABLE public.facilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  name_bn VARCHAR(255),
  short_name VARCHAR(50),
  description TEXT,
  description_bn TEXT,
  icon VARCHAR(50),
  featured_image TEXT,
  category VARCHAR(100),
  location TEXT,
  contact_phone VARCHAR(50),
  contact_email VARCHAR(255),
  operating_hours TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can manage facilities" 
ON public.facilities 
FOR ALL 
USING (is_admin());

CREATE POLICY "Anyone can view active facilities" 
ON public.facilities 
FOR SELECT 
USING (is_active = true);

-- Add trigger for updated_at
CREATE TRIGGER update_facilities_updated_at
BEFORE UPDATE ON public.facilities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();