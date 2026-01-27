import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO, isSameDay } from 'date-fns';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  CalendarIcon, 
  MapPin, 
  Clock,
  Users,
  Image as ImageIcon,
  Loader2,
  Star,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

type ContentStatus = 'draft' | 'pending' | 'published' | 'archived';

type Event = {
  id: string;
  title: string;
  title_bn: string | null;
  description: string | null;
  description_bn: string | null;
  event_date: string;
  end_date: string | null;
  venue: string | null;
  organizer: string | null;
  featured_image: string | null;
  is_featured: boolean | null;
  status: ContentStatus;
  created_at: string;
};

const EventsManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());
  const [formData, setFormData] = useState({
    title: '',
    title_bn: '',
    description: '',
    description_bn: '',
    event_date: '',
    end_date: '',
    venue: '',
    organizer: '',
    featured_image: '',
    is_featured: false,
    status: 'draft' as ContentStatus,
  });

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['admin-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: false });
      if (error) throw error;
      return data as Event[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<Event, 'id' | 'created_at'>) => {
      const { error } = await supabase.from('events').insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      toast({ title: 'Event created successfully!' });
      resetForm();
    },
    onError: (error) => {
      toast({ title: 'Error creating event', description: error.message, variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Event> & { id: string }) => {
      const { error } = await supabase.from('events').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      toast({ title: 'Event updated successfully!' });
      resetForm();
    },
    onError: (error) => {
      toast({ title: 'Error updating event', description: error.message, variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      toast({ title: 'Event deleted successfully!' });
    },
    onError: (error) => {
      toast({ title: 'Error deleting event', description: error.message, variant: 'destructive' });
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      title_bn: '',
      description: '',
      description_bn: '',
      event_date: '',
      end_date: '',
      venue: '',
      organizer: '',
      featured_image: '',
      is_featured: false,
      status: 'draft',
    });
    setEditingEvent(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      title_bn: event.title_bn || '',
      description: event.description || '',
      description_bn: event.description_bn || '',
      event_date: event.event_date ? format(parseISO(event.event_date), 'yyyy-MM-dd\'T\'HH:mm') : '',
      end_date: event.end_date ? format(parseISO(event.end_date), 'yyyy-MM-dd\'T\'HH:mm') : '',
      venue: event.venue || '',
      organizer: event.organizer || '',
      featured_image: event.featured_image || '',
      is_featured: event.is_featured || false,
      status: event.status,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.event_date) {
      toast({ title: 'Please fill required fields', variant: 'destructive' });
      return;
    }

    const eventData = {
      title: formData.title,
      title_bn: formData.title_bn || null,
      description: formData.description || null,
      description_bn: formData.description_bn || null,
      event_date: formData.event_date,
      end_date: formData.end_date || null,
      venue: formData.venue || null,
      organizer: formData.organizer || null,
      featured_image: formData.featured_image || null,
      is_featured: formData.is_featured,
      status: formData.status,
    };

    if (editingEvent) {
      updateMutation.mutate({ id: editingEvent.id, ...eventData });
    } else {
      createMutation.mutate(eventData as Omit<Event, 'id' | 'created_at'>);
    }
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = parseISO(event.event_date);
      return isSameDay(eventDate, date);
    });
  };

  const eventsForSelectedDate = selectedDate ? getEventsForDate(selectedDate) : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500';
      case 'draft': return 'bg-gray-500';
      case 'pending': return 'bg-yellow-500';
      case 'archived': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">Events Management</h1>
            <p className="text-muted-foreground">Create and manage university events with calendar view</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingEvent ? 'Edit Event' : 'Create New Event'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title (English) *</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Event title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Title (Bengali)</label>
                    <Input
                      value={formData.title_bn}
                      onChange={(e) => setFormData({ ...formData, title_bn: e.target.value })}
                      placeholder="ইভেন্ট শিরোনাম"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Date & Time *</label>
                    <Input
                      type="datetime-local"
                      value={formData.event_date}
                      onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">End Date & Time</label>
                    <Input
                      type="datetime-local"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Venue</label>
                    <Input
                      value={formData.venue}
                      onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                      placeholder="Event location"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Organizer</label>
                    <Input
                      value={formData.organizer}
                      onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                      placeholder="Organizing department/club"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description (English)</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Event description..."
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description (Bengali)</label>
                  <Textarea
                    value={formData.description_bn}
                    onChange={(e) => setFormData({ ...formData, description_bn: e.target.value })}
                    placeholder="ইভেন্ট বিবরণ..."
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Featured Image URL</label>
                  <Input
                    value={formData.featured_image}
                    onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: 'draft' | 'pending' | 'published' | 'archived') =>
                        setFormData({ ...formData, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="is_featured"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <label htmlFor="is_featured" className="text-sm">Mark as Featured Event</label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    {(createMutation.isPending || updateMutation.isPending) && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    {editingEvent ? 'Update Event' : 'Create Event'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar View */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                Event Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                month={calendarMonth}
                onMonthChange={setCalendarMonth}
                className="rounded-md border"
                modifiers={{
                  hasEvent: (date) => getEventsForDate(date).length > 0,
                }}
                modifiersStyles={{
                  hasEvent: { 
                    backgroundColor: 'hsl(var(--primary))', 
                    color: 'hsl(var(--primary-foreground))',
                    fontWeight: 'bold'
                  },
                }}
              />
              
              {selectedDate && (
                <div className="mt-4">
                  <h4 className="font-semibold text-sm mb-2">
                    Events on {format(selectedDate, 'MMM dd, yyyy')}
                  </h4>
                  {eventsForSelectedDate.length > 0 ? (
                    <div className="space-y-2">
                      {eventsForSelectedDate.map(event => (
                        <div 
                          key={event.id} 
                          className="p-2 bg-muted rounded-md text-sm cursor-pointer hover:bg-muted/80"
                          onClick={() => handleEdit(event)}
                        >
                          <p className="font-medium truncate">{event.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(parseISO(event.event_date), 'h:mm a')}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No events scheduled</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Events List */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>All Events ({events.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
              ) : events.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No events yet. Create your first event!</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {events.map((event) => (
                    <div 
                      key={event.id} 
                      className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold truncate">{event.title}</h3>
                            {event.is_featured && (
                              <Star className="w-4 h-4 text-gold fill-gold" />
                            )}
                          </div>
                          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {format(parseISO(event.event_date), 'MMM dd, yyyy h:mm a')}
                            </span>
                            {event.venue && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {event.venue}
                              </span>
                            )}
                            {event.organizer && (
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {event.organizer}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={cn('text-white', getStatusColor(event.status))}>
                            {event.status}
                          </Badge>
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(event)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => deleteMutation.mutate(event.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EventsManagement;
