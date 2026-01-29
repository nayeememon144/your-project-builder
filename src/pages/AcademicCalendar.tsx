import { MainLayout } from '@/components/layout/MainLayout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Calendar, GraduationCap, FileText, TreePalm, ClipboardList, Award, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type CalendarEvent = {
  id: string;
  title: string;
  title_bn: string | null;
  description: string | null;
  event_type: string;
  start_date: string;
  end_date: string | null;
  academic_year: string | null;
  semester: string | null;
};

const eventTypeConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  semester_start: { label: 'Semester Start', icon: GraduationCap, color: 'bg-blue-100 text-blue-700 border-blue-200' },
  semester_end: { label: 'Semester End', icon: GraduationCap, color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  exam: { label: 'Examination', icon: FileText, color: 'bg-red-100 text-red-700 border-red-200' },
  holiday: { label: 'Holiday', icon: TreePalm, color: 'bg-green-100 text-green-700 border-green-200' },
  registration: { label: 'Registration', icon: ClipboardList, color: 'bg-orange-100 text-orange-700 border-orange-200' },
  result: { label: 'Result Publication', icon: Award, color: 'bg-purple-100 text-purple-700 border-purple-200' },
  general: { label: 'General Event', icon: CalendarDays, color: 'bg-gray-100 text-gray-700 border-gray-200' },
};

const AcademicCalendar = () => {
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['public-calendar-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('academic_calendar_events')
        .select('id, title, title_bn, description, event_type, start_date, end_date, academic_year, semester')
        .eq('is_active', true)
        .order('start_date', { ascending: true });
      if (error) throw error;
      return data as CalendarEvent[];
    },
  });

  // Get unique academic years for filter
  const academicYears = [...new Set(events.map(e => e.academic_year).filter(Boolean))] as string[];

  // Filter events
  const filteredEvents = events.filter(event => {
    if (selectedYear !== 'all' && event.academic_year !== selectedYear) return false;
    if (selectedType !== 'all' && event.event_type !== selectedType) return false;
    return true;
  });

  // Group events by month
  const groupedEvents = filteredEvents.reduce((acc, event) => {
    const monthKey = format(new Date(event.start_date), 'MMMM yyyy');
    if (!acc[monthKey]) acc[monthKey] = [];
    acc[monthKey].push(event);
    return acc;
  }, {} as Record<string, CalendarEvent[]>);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-primary text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Calendar className="w-12 h-12" />
            <h1 className="font-display text-4xl md:text-5xl font-bold">
              Academic Calendar
            </h1>
          </div>
          <p className="text-white/80 text-lg max-w-2xl">
            Important dates, schedules, and academic events for the current academic year
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Academic Year:</span>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-40 bg-background">
                  <SelectValue placeholder="All Years" />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={4} className="bg-background z-50">
                  <SelectItem value="all">All Years</SelectItem>
                  {academicYears.map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Event Type:</span>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-44 bg-background">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={4} className="bg-background z-50">
                  <SelectItem value="all">All Types</SelectItem>
                  {Object.entries(eventTypeConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>{config.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Calendar Events */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-16">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Events Found</h3>
              <p className="text-muted-foreground">
                {events.length === 0 
                  ? 'Academic calendar events will be added soon.'
                  : 'No events match your selected filters.'}
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(groupedEvents).map(([month, monthEvents]) => (
                <div key={month}>
                  <h2 className="font-display text-2xl font-bold mb-6 pb-2 border-b">
                    {month}
                  </h2>
                  <div className="space-y-4">
                    {monthEvents.map((event) => {
                      const config = eventTypeConfig[event.event_type] || eventTypeConfig.general;
                      const Icon = config.icon;
                      return (
                        <div
                          key={event.id}
                          className={`flex gap-4 p-4 rounded-lg border ${config.color}`}
                        >
                          <div className="flex-shrink-0 w-16 text-center">
                            <div className="text-2xl font-bold">
                              {format(new Date(event.start_date), 'd')}
                            </div>
                            <div className="text-xs uppercase">
                              {format(new Date(event.start_date), 'EEE')}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start gap-2">
                              <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                              <div>
                                <h3 className="font-semibold">{event.title}</h3>
                                {event.description && (
                                  <p className="text-sm mt-1 opacity-80">{event.description}</p>
                                )}
                                <div className="flex flex-wrap gap-2 mt-2 text-xs">
                                  {event.end_date && event.end_date !== event.start_date && (
                                    <span className="opacity-70">
                                      Until {format(new Date(event.end_date), 'MMM d, yyyy')}
                                    </span>
                                  )}
                                  {event.semester && (
                                    <span className="opacity-70">• {event.semester}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Legend */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <h3 className="font-semibold mb-4">Event Types</h3>
          <div className="flex flex-wrap gap-3">
            {Object.entries(eventTypeConfig).map(([key, config]) => {
              const Icon = config.icon;
              return (
                <div
                  key={key}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border ${config.color}`}
                >
                  <Icon className="w-4 h-4" />
                  {config.label}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default AcademicCalendar;
