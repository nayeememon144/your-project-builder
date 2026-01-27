import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Loader2,
  Building,
  Search,
  Upload
} from 'lucide-react';

type Facility = {
  id: string;
  name: string;
  name_bn: string | null;
  short_name: string | null;
  description: string | null;
  description_bn: string | null;
  icon: string | null;
  featured_image: string | null;
  category: string | null;
  location: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  operating_hours: string | null;
  display_order: number | null;
  is_active: boolean | null;
  created_at: string;
  updated_at: string;
};

const facilityCategories = [
  'Academic',
  'Student Services',
  'Health & Wellness',
  'Sports & Recreation',
  'Library',
  'Transport',
  'Accommodation',
  'Research',
  'Other',
];

const FacilitiesManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    name_bn: '',
    short_name: '',
    description: '',
    description_bn: '',
    icon: '',
    featured_image: '',
    category: '',
    location: '',
    contact_phone: '',
    contact_email: '',
    operating_hours: '',
    display_order: 0,
    is_active: true,
  });

  // Fetch facilities
  const { data: facilities = [], isLoading } = useQuery({
    queryKey: ['admin-facilities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('facilities')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as Facility[];
    },
  });

  // Image upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `facility-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('attachments')
      .upload(fileName, file);

    if (uploadError) {
      toast({ title: 'Upload failed', description: uploadError.message, variant: 'destructive' });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('attachments').getPublicUrl(fileName);
    setFormData({ ...formData, featured_image: urlData.publicUrl });
    setUploading(false);
  };

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload = {
        name: data.name,
        name_bn: data.name_bn || null,
        short_name: data.short_name || null,
        description: data.description || null,
        description_bn: data.description_bn || null,
        icon: data.icon || null,
        featured_image: data.featured_image || null,
        category: data.category || null,
        location: data.location || null,
        contact_phone: data.contact_phone || null,
        contact_email: data.contact_email || null,
        operating_hours: data.operating_hours || null,
        display_order: data.display_order,
        is_active: data.is_active,
      };

      if (editingFacility) {
        const { error } = await supabase
          .from('facilities')
          .update(payload)
          .eq('id', editingFacility.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('facilities').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-facilities'] });
      toast({ title: editingFacility ? 'Facility updated!' : 'Facility created!' });
      closeDialog();
    },
    onError: (error) => {
      toast({ title: 'Error', description: String(error), variant: 'destructive' });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('facilities').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-facilities'] });
      toast({ title: 'Facility deleted!' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: String(error), variant: 'destructive' });
    },
  });

  const openCreateDialog = () => {
    setEditingFacility(null);
    setFormData({
      name: '',
      name_bn: '',
      short_name: '',
      description: '',
      description_bn: '',
      icon: '',
      featured_image: '',
      category: '',
      location: '',
      contact_phone: '',
      contact_email: '',
      operating_hours: '',
      display_order: facilities.length,
      is_active: true,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (facility: Facility) => {
    setEditingFacility(facility);
    setFormData({
      name: facility.name,
      name_bn: facility.name_bn || '',
      short_name: facility.short_name || '',
      description: facility.description || '',
      description_bn: facility.description_bn || '',
      icon: facility.icon || '',
      featured_image: facility.featured_image || '',
      category: facility.category || '',
      location: facility.location || '',
      contact_phone: facility.contact_phone || '',
      contact_email: facility.contact_email || '',
      operating_hours: facility.operating_hours || '',
      display_order: facility.display_order || 0,
      is_active: facility.is_active ?? true,
    });
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingFacility(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast({ title: 'Error', description: 'Facility name is required', variant: 'destructive' });
      return;
    }
    saveMutation.mutate(formData);
  };

  const filteredFacilities = facilities.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (f.category?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Facilities</h1>
            <p className="text-muted-foreground">Manage campus facilities like Library, Medical Center, Transport, etc.</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Facility
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingFacility ? 'Edit Facility' : 'Add New Facility'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Facility Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Central Library"
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

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="short_name">Short Name</Label>
                    <Input
                      id="short_name"
                      value={formData.short_name}
                      onChange={(e) => setFormData({ ...formData, short_name: e.target.value })}
                      placeholder="e.g., Library"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {facilityCategories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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

                <div className="space-y-2">
                  <Label>Featured Image</Label>
                  <div className="flex gap-2">
                    <Input
                      value={formData.featured_image}
                      onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                      placeholder="Image URL"
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" asChild disabled={uploading}>
                      <label className="cursor-pointer">
                        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      </label>
                    </Button>
                  </div>
                  {formData.featured_image && (
                    <img src={formData.featured_image} alt="Preview" className="w-32 h-20 object-cover rounded mt-2" />
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g., Academic Building A"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="operating_hours">Operating Hours</Label>
                    <Input
                      id="operating_hours"
                      value={formData.operating_hours}
                      onChange={(e) => setFormData({ ...formData, operating_hours: e.target.value })}
                      placeholder="e.g., 9 AM - 5 PM"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact_phone">Contact Phone</Label>
                    <Input
                      id="contact_phone"
                      value={formData.contact_phone}
                      onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_email">Contact Email</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      value={formData.contact_email}
                      onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="icon">Icon (Lucide name)</Label>
                    <Input
                      id="icon"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      placeholder="e.g., Library, Stethoscope"
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
                    {editingFacility ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search facilities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Facilities List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredFacilities.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Building className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No facilities found. Add your first facility!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredFacilities.map((facility) => (
              <Card key={facility.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {facility.featured_image && (
                      <img
                        src={facility.featured_image}
                        alt={facility.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-lg">{facility.name}</h3>
                        {facility.category && (
                          <Badge variant="outline">{facility.category}</Badge>
                        )}
                        <Badge variant={facility.is_active ? 'default' : 'secondary'}>
                          {facility.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      {facility.location && (
                        <p className="text-sm text-muted-foreground mt-1">📍 {facility.location}</p>
                      )}
                      {facility.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{facility.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => openEditDialog(facility)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                          if (confirm('Delete this facility?')) {
                            deleteMutation.mutate(facility.id);
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

export default FacilitiesManagement;
