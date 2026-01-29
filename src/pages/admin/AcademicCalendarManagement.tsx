import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Loader2, Calendar } from 'lucide-react';
import { format } from 'date-fns';

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
  is_active: boolean;
  display_order: number;
};

const eventTypes = [
  { value: 'semester_start', label: 'Semester Start' },
  { value: 'semester_end', label: 'Semester End' },
  { value: 'exam', label: 'Examination' },
  { value: 'holiday', label: 'Holiday' },
  { value: 'registration', label: 'Registration' },
  { value: 'result', label: 'Result Publication' },
  { value: 'general', label: 'General Event' },
];

const AcademicCalendarManagement = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    title_bn: '',
    description: '',
    event_type: 'general',
    start_date: '',
    end_date: '',
    academic_year: '',
    semester: '',
    is_active: true,
    display_order: 0,
  });

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['admin-calendar-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('academic_calendar_events')
        .select('*')
        .order('start_date', { ascending: true });
      if (error) throw error;
      return data as CalendarEvent[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData & { id?: string }) => {
      if (data.id) {
        const { error } = await supabase
          .from('academic_calendar_events')
          .update({
            title: data.title,
            title_bn: data.title_bn || null,
            description: data.description || null,
            event_type: data.event_type,
            start_date: data.start_date,
            end_date: data.end_date || null,
            academic_year: data.academic_year || null,
            semester: data.semester || null,
            is_active: data.is_active,
            display_order: data.display_order,
          })
          .eq('id', data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('academic_calendar_events')
          .insert({
            title: data.title,
            title_bn: data.title_bn || null,
            description: data.description || null,
            event_type: data.event_type,
            start_date: data.start_date,
            end_date: data.end_date || null,
            academic_year: data.academic_year || null,
            semester: data.semester || null,
            is_active: data.is_active,
            display_order: data.display_order,
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-calendar-events'] });
      toast({ title: editingEvent ? 'Event updated' : 'Event created' });
      handleCloseDialog();
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('academic_calendar_events')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-calendar-events'] });
      toast({ title: 'Event deleted' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const handleOpenDialog = (event?: CalendarEvent) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        title: event.title,
        title_bn: event.title_bn || '',
        description: event.description || '',
        event_type: event.event_type,
        start_date: event.start_date,
        end_date: event.end_date || '',
        academic_year: event.academic_year || '',
        semester: event.semester || '',
        is_active: event.is_active,
        display_order: event.display_order,
      });
    } else {
      setEditingEvent(null);
      setFormData({
        title: '',
        title_bn: '',
        description: '',
        event_type: 'general',
        start_date: '',
        end_date: '',
        academic_year: '',
        semester: '',
        is_active: true,
        display_order: 0,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingEvent(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(editingEvent ? { ...formData, id: editingEvent.id } : formData);
  };

  const getEventTypeLabel = (type: string) => {
    return eventTypes.find(t => t.value === type)?.label || type;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              Academic Calendar
            </h1>
            <p className="text-muted-foreground">Manage academic calendar events</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title (English) *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title_bn">Title (Bangla)</Label>
                    <Input
                      id="title_bn"
                      value={formData.title_bn}
                      onChange={(e) => setFormData({ ...formData, title_bn: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="event_type">Event Type *</Label>
                    <Select
                      value={formData.event_type}
                      onValueChange={(value) => setFormData({ ...formData, event_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {eventTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="academic_year">Academic Year</Label>
                    <Input
                      id="academic_year"
                      value={formData.academic_year}
                      onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
                      placeholder="e.g., 2025-2026"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Start Date *</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_date">End Date</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="semester">Semester</Label>
                    <Input
                      id="semester"
                      value={formData.semester}
                      onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                      placeholder="e.g., Spring 2026"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="display_order">Display Order</Label>
                    <Input
                      id="display_order"
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={handleCloseDialog}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saveMutation.isPending}>
                    {saveMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {editingEvent ? 'Update' : 'Create'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Academic Year</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No calendar events yet. Add your first event.
                    </TableCell>
                  </TableRow>
                ) : (
                  events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.title}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                          {getEventTypeLabel(event.event_type)}
                        </span>
                      </TableCell>
                      <TableCell>{format(new Date(event.start_date), 'MMM d, yyyy')}</TableCell>
                      <TableCell>
                        {event.end_date ? format(new Date(event.end_date), 'MMM d, yyyy') : '-'}
                      </TableCell>
                      <TableCell>{event.academic_year || '-'}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${event.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                          {event.is_active ? 'Yes' : 'No'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(event)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (confirm('Delete this event?')) {
                              deleteMutation.mutate(event.id);
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AcademicCalendarManagement;
