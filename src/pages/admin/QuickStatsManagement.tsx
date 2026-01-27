import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Loader2,
  GripVertical,
  BarChart3
} from 'lucide-react';

type QuickStat = {
  id: string;
  label: string;
  label_bn: string | null;
  value: number;
  icon: string | null;
  display_order: number | null;
  is_active: boolean | null;
  created_at: string;
  updated_at: string;
};

const QuickStatsManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStat, setEditingStat] = useState<QuickStat | null>(null);
  const [formData, setFormData] = useState({
    label: '',
    label_bn: '',
    value: 0,
    icon: '',
    display_order: 0,
    is_active: true,
  });

  // Fetch stats
  const { data: stats = [], isLoading } = useQuery({
    queryKey: ['admin-quick-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quick_stats')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as QuickStat[];
    },
  });

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (editingStat) {
        const { error } = await supabase
          .from('quick_stats')
          .update({
            label: data.label,
            label_bn: data.label_bn || null,
            value: data.value,
            icon: data.icon || null,
            display_order: data.display_order,
            is_active: data.is_active,
          })
          .eq('id', editingStat.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('quick_stats')
          .insert({
            label: data.label,
            label_bn: data.label_bn || null,
            value: data.value,
            icon: data.icon || null,
            display_order: data.display_order,
            is_active: data.is_active,
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-quick-stats'] });
      toast({ title: editingStat ? 'Stat updated!' : 'Stat created!' });
      closeDialog();
    },
    onError: (error) => {
      toast({ title: 'Error', description: String(error), variant: 'destructive' });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('quick_stats').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-quick-stats'] });
      toast({ title: 'Stat deleted!' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: String(error), variant: 'destructive' });
    },
  });

  const openCreateDialog = () => {
    setEditingStat(null);
    setFormData({
      label: '',
      label_bn: '',
      value: 0,
      icon: '',
      display_order: stats.length,
      is_active: true,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (stat: QuickStat) => {
    setEditingStat(stat);
    setFormData({
      label: stat.label,
      label_bn: stat.label_bn || '',
      value: stat.value,
      icon: stat.icon || '',
      display_order: stat.display_order || 0,
      is_active: stat.is_active ?? true,
    });
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingStat(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.label || formData.value < 0) {
      toast({ title: 'Error', description: 'Please fill required fields', variant: 'destructive' });
      return;
    }
    saveMutation.mutate(formData);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Quick Stats</h1>
            <p className="text-muted-foreground">Manage "SSTU at a Glance" statistics</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Stat
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingStat ? 'Edit Stat' : 'Add New Stat'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="label">Label *</Label>
                  <Input
                    id="label"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    placeholder="e.g., Students"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="label_bn">Label (Bengali)</Label>
                  <Input
                    id="label_bn"
                    value={formData.label_bn}
                    onChange={(e) => setFormData({ ...formData, label_bn: e.target.value })}
                    placeholder="e.g., শিক্ষার্থী"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="value">Value *</Label>
                  <Input
                    id="value"
                    type="number"
                    min="0"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="icon">Icon Name (Lucide)</Label>
                  <Input
                    id="icon"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="e.g., Users, GraduationCap"
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
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label>Active</Label>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={closeDialog} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saveMutation.isPending} className="flex-1">
                    {saveMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {editingStat ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : stats.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No stats found. Add your first stat!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {stats.map((stat) => (
              <Card key={stat.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <GripVertical className="w-5 h-5 text-muted-foreground cursor-move" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{stat.label}</h3>
                        {stat.label_bn && (
                          <span className="text-muted-foreground">({stat.label_bn})</span>
                        )}
                        <Badge variant={stat.is_active ? 'default' : 'secondary'}>
                          {stat.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-2xl font-bold text-primary">{stat.value.toLocaleString()}</p>
                      {stat.icon && (
                        <p className="text-sm text-muted-foreground">Icon: {stat.icon}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => openEditDialog(stat)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                          if (confirm('Delete this stat?')) {
                            deleteMutation.mutate(stat.id);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default QuickStatsManagement;
