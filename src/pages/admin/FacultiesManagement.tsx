import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Building2,
  Users
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

interface Faculty {
  id: string;
  name: string;
  name_bn: string | null;
  short_name: string | null;
  description: string | null;
  description_bn: string | null;
  dean_id: string | null;
  is_active: boolean;
  display_order: number | null;
  created_at: string;
}

const FacultiesManagement = () => {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    name_bn: '',
    short_name: '',
    description: '',
    description_bn: '',
    is_active: true,
    display_order: 0,
  });

  useEffect(() => {
    fetchFaculties();
  }, []);

  const fetchFaculties = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('faculties')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      toast.error('Failed to fetch faculties');
    } else {
      setFaculties(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const facultyData = {
      ...formData,
      name_bn: formData.name_bn || null,
      short_name: formData.short_name || null,
      description: formData.description || null,
      description_bn: formData.description_bn || null,
    };

    if (editingFaculty) {
      const { error } = await supabase
        .from('faculties')
        .update(facultyData)
        .eq('id', editingFaculty.id);

      if (error) {
        toast.error('Failed to update faculty');
      } else {
        toast.success('Faculty updated successfully');
        setIsDialogOpen(false);
        fetchFaculties();
      }
    } else {
      const { error } = await supabase
        .from('faculties')
        .insert([facultyData]);

      if (error) {
        toast.error('Failed to create faculty');
      } else {
        toast.success('Faculty created successfully');
        setIsDialogOpen(false);
        fetchFaculties();
      }
    }
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this faculty? This will affect all related departments.')) return;
    
    const { error } = await supabase
      .from('faculties')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete faculty');
    } else {
      toast.success('Faculty deleted successfully');
      fetchFaculties();
    }
  };

  const handleEdit = (faculty: Faculty) => {
    setEditingFaculty(faculty);
    setFormData({
      name: faculty.name,
      name_bn: faculty.name_bn || '',
      short_name: faculty.short_name || '',
      description: faculty.description || '',
      description_bn: faculty.description_bn || '',
      is_active: faculty.is_active,
      display_order: faculty.display_order || 0,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingFaculty(null);
    setFormData({
      name: '',
      name_bn: '',
      short_name: '',
      description: '',
      description_bn: '',
      is_active: true,
      display_order: 0,
    });
  };

  const filteredFaculties = faculties.filter(faculty =>
    faculty.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-display font-bold">Faculties Management</h1>
            <p className="text-muted-foreground">Manage university faculties</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Faculty
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingFaculty ? 'Edit Faculty' : 'Create New Faculty'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name (English)</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name_bn">Name (Bengali)</Label>
                    <Input
                      id="name_bn"
                      value={formData.name_bn}
                      onChange={(e) => setFormData({ ...formData, name_bn: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="short_name">Short Name</Label>
                    <Input
                      id="short_name"
                      value={formData.short_name}
                      onChange={(e) => setFormData({ ...formData, short_name: e.target.value })}
                      placeholder="e.g., FoE"
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

                <div className="space-y-2">
                  <Label htmlFor="description">Description (English)</Label>
                  <Textarea
                    id="description"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description_bn">Description (Bengali)</Label>
                  <Textarea
                    id="description_bn"
                    rows={3}
                    value={formData.description_bn}
                    onChange={(e) => setFormData({ ...formData, description_bn: e.target.value })}
                  />
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
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingFaculty ? 'Update' : 'Create'} Faculty
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search faculties..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Faculties Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center p-8 text-muted-foreground">
              Loading faculties...
            </div>
          ) : filteredFaculties.length === 0 ? (
            <div className="col-span-full text-center p-8 text-muted-foreground">
              No faculties found
            </div>
          ) : (
            filteredFaculties.map((faculty) => (
              <Card key={faculty.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-primary" />
                    </div>
                    <Badge variant={faculty.is_active ? 'default' : 'secondary'}>
                      {faculty.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-1">{faculty.name}</h3>
                  {faculty.short_name && (
                    <p className="text-muted-foreground text-sm mb-2">({faculty.short_name})</p>
                  )}
                  {faculty.description && (
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                      {faculty.description}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEdit(faculty)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => handleDelete(faculty.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default FacultiesManagement;
