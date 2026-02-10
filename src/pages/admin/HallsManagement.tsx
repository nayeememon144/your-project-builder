import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Building2, Loader2 } from 'lucide-react';

interface HallForm {
  name: string;
  name_bn: string;
  short_name: string;
  description: string;
  description_bn: string;
  location: string;
  contact_phone: string;
  contact_email: string;
  operating_hours: string;
  featured_image: string;
  icon: string;
  display_order: number;
  is_active: boolean;
}

const emptyForm: HallForm = {
  name: '', name_bn: '', short_name: '', description: '', description_bn: '',
  location: '', contact_phone: '', contact_email: '', operating_hours: '',
  featured_image: '', icon: '', display_order: 0, is_active: true,
};

const HallsManagement = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<HallForm>(emptyForm);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: halls, isLoading } = useQuery({
    queryKey: ['admin-halls'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('facilities')
        .select('*')
        .eq('category', 'hall')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: HallForm & { id?: string }) => {
      const payload = { ...data, category: 'hall' };
      if (data.id) {
        const { error } = await supabase.from('facilities').update(payload).eq('id', data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('facilities').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-halls'] });
      toast({ title: editingId ? 'Hall updated' : 'Hall added' });
      setDialogOpen(false);
      resetForm();
    },
    onError: (err: any) => toast({ title: 'Error', description: err.message, variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('facilities').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-halls'] });
      toast({ title: 'Hall removed' });
    },
    onError: (err: any) => toast({ title: 'Error', description: err.message, variant: 'destructive' }),
  });

  const resetForm = () => { setForm(emptyForm); setEditingId(null); };

  const openEdit = (hall: any) => {
    setEditingId(hall.id);
    setForm({
      name: hall.name || '', name_bn: hall.name_bn || '', short_name: hall.short_name || '',
      description: hall.description || '', description_bn: hall.description_bn || '',
      location: hall.location || '', contact_phone: hall.contact_phone || '',
      contact_email: hall.contact_email || '', operating_hours: hall.operating_hours || '',
      featured_image: hall.featured_image || '', icon: hall.icon || '',
      display_order: hall.display_order || 0, is_active: hall.is_active ?? true,
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(editingId ? { ...form, id: editingId } : form);
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Halls of Residence</h1>
          <p className="text-muted-foreground">Manage residential halls</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> Add Hall</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Hall' : 'Add New Hall'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name *</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div>
                  <Label>Name (Bangla)</Label>
                  <Input value={form.name_bn} onChange={(e) => setForm({ ...form, name_bn: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Short Name / Type</Label>
                  <Input value={form.short_name} onChange={(e) => setForm({ ...form, short_name: e.target.value })} placeholder="e.g. Male / Female" />
                </div>
                <div>
                  <Label>Display Order</Label>
                  <Input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
              </div>
              <div>
                <Label>Featured Image URL</Label>
                <Input value={form.featured_image} onChange={(e) => setForm({ ...form, featured_image: e.target.value })} placeholder="https://..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Location</Label>
                  <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                </div>
                <div>
                  <Label>Operating Hours</Label>
                  <Input value={form.operating_hours} onChange={(e) => setForm({ ...form, operating_hours: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Contact Phone</Label>
                  <Input value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} />
                </div>
                <div>
                  <Label>Contact Email</Label>
                  <Input value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.is_active} onCheckedChange={(c) => setForm({ ...form, is_active: c })} />
                <Label>Active</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>Cancel</Button>
                <Button type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingId ? 'Update' : 'Add'} Hall
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : halls && halls.length > 0 ? (
        <div className="grid gap-4">
          {halls.map((hall) => (
            <Card key={hall.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <Building2 className="w-8 h-8 text-primary" />
                  <div>
                    <h3 className="font-semibold">{hall.name}</h3>
                    {hall.short_name && <p className="text-sm text-muted-foreground">{hall.short_name}</p>}
                    {hall.location && <p className="text-xs text-muted-foreground">{hall.location}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded ${hall.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {hall.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(hall)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => {
                    if (confirm('Remove this hall?')) deleteMutation.mutate(hall.id);
                  }}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12 text-muted-foreground">
            No halls added yet. Click "Add Hall" to get started.
          </CardContent>
        </Card>
      )}
    </AdminLayout>
  );
};

export default HallsManagement;
