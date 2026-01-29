-- Create academic calendar events table
CREATE TABLE public.academic_calendar_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR NOT NULL,
  title_bn VARCHAR,
  description TEXT,
  event_type VARCHAR NOT NULL DEFAULT 'general', -- semester_start, semester_end, exam, holiday, registration, result, general
  start_date DATE NOT NULL,
  end_date DATE,
  academic_year VARCHAR,
  semester VARCHAR,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.academic_calendar_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can manage calendar events"
ON public.academic_calendar_events
FOR ALL
USING (is_admin());

CREATE POLICY "Anyone can view active calendar events"
ON public.academic_calendar_events
FOR SELECT
USING (is_active = true);

-- Add trigger for updated_at
CREATE TRIGGER update_academic_calendar_events_updated_at
BEFORE UPDATE ON public.academic_calendar_events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();