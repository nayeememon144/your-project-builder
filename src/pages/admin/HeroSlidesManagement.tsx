import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface HeroSlide {
  id: string;
  title: string;
  title_bn: string | null;
  subtitle: string | null;
  subtitle_bn: string | null;
  welcome_text: string | null;
  welcome_text_bn: string | null;
  image_url: string;
  cta_text: string | null;
  cta_link: string | null;
  display_order: number | null;
  is_active: boolean | null;
}

const HeroSlidesManagement = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: 'Sunamganj Science and Technology University',
    title_bn: 'সুনামগঞ্জ বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়',
    welcome_text: '',
    welcome_text_bn: '',
    subtitle: '',
    subtitle_bn: '',
    image_url: '',
    cta_text: '',
    cta_link: '',
    display_order: 0,
    is_active: true,
  });

  const { data: slides, isLoading } = useQuery({
    queryKey: ['admin-hero-slides'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as HeroSlide[];
    },
  });


  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `hero-${Date.now()}.${fileExt}`;
    const filePath = `hero-slides/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('attachments')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('attachments').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from('hero_slides').insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-hero-slides'] });
      toast.success('Hero slide created successfully');
      resetForm();
    },
    onError: (error) => {
      toast.error('Failed to create slide: ' + error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase.from('hero_slides').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-hero-slides'] });
      toast.success('Hero slide updated successfully');
      resetForm();
    },
    onError: (error) => {
      toast.error('Failed to update slide: ' + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('hero_slides').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-hero-slides'] });
      toast.success('Hero slide deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete slide: ' + error.message);
    },
  });

  const resetForm = () => {
    setFormData({
      title: 'Sunamganj Science and Technology University',
      title_bn: 'সুনামগঞ্জ বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়',
      welcome_text: '',
      welcome_text_bn: '',
      subtitle: '',
      subtitle_bn: '',
      image_url: '',
      cta_text: '',
      cta_link: '',
      display_order: 0,
      is_active: true,
    });
    setEditingSlide(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title || 'Sunamganj Science and Technology University',
      title_bn: slide.title_bn || 'সুনামগঞ্জ বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়',
      welcome_text: slide.welcome_text || '',
      welcome_text_bn: slide.welcome_text_bn || '',
      subtitle: slide.subtitle || '',
      subtitle_bn: slide.subtitle_bn || '',
      image_url: slide.image_url,
      cta_text: slide.cta_text || '',
      cta_link: slide.cta_link || '',
      display_order: slide.display_order || 0,
      is_active: slide.is_active ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImage(file);
      setFormData({ ...formData, image_url: url });
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      toast.error('Failed to upload image: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.image_url) {
      toast.error('Title and image are required');
      return;
    }

    if (editingSlide) {
      updateMutation.mutate({ id: editingSlide.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-formal text-foreground">Hero Slides Management</h1>
          <p className="text-muted-foreground">Each slide contains its own image and text content that slides together</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Hero Slides</CardTitle>
            <CardDescription>
              Add slides with image and text. All content (title, subtitle, tagline) will animate together when slides change.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-end">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => resetForm()}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Slide
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingSlide ? 'Edit Hero Slide' : 'Add New Hero Slide'}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label>Slide Image *</Label>
                        <div className="flex items-center gap-4">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            disabled={uploading}
                          />
                          {uploading && <span className="text-sm text-muted-foreground">Uploading...</span>}
                        </div>
                        {formData.image_url && (
                          <div className="mt-2">
                            <img src={formData.image_url} alt="Preview" className="w-full max-w-md h-32 object-cover rounded-lg" />
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">University Name (English) *</Label>
                          <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Sunamganj Science and Technology University"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="title_bn">University Name (Bengali)</Label>
                          <Input
                            id="title_bn"
                            value={formData.title_bn}
                            onChange={(e) => setFormData({ ...formData, title_bn: e.target.value })}
                            placeholder="সুনামগঞ্জ বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="welcome_text">Welcome Text (English)</Label>
                          <Input
                            id="welcome_text"
                            value={formData.welcome_text}
                            onChange={(e) => setFormData({ ...formData, welcome_text: e.target.value })}
                            placeholder="e.g., Research & Innovation, Welcome to SSTU"
                          />
                          <p className="text-xs text-muted-foreground">Shown in green below the university name</p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="welcome_text_bn">Welcome Text (Bengali)</Label>
                          <Input
                            id="welcome_text_bn"
                            value={formData.welcome_text_bn}
                            onChange={(e) => setFormData({ ...formData, welcome_text_bn: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="subtitle">Tagline (English)</Label>
                          <Textarea
                            id="subtitle"
                            value={formData.subtitle}
                            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                            placeholder="Admissions, academics, research, and campus life—everything in one place."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subtitle_bn">Tagline (Bengali)</Label>
                          <Textarea
                            id="subtitle_bn"
                            value={formData.subtitle_bn}
                            onChange={(e) => setFormData({ ...formData, subtitle_bn: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="cta_text">Button Text (Optional)</Label>
                          <Input
                            id="cta_text"
                            value={formData.cta_text}
                            onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                            placeholder="e.g., Learn More"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cta_link">Button Link</Label>
                          <Input
                            id="cta_link"
                            value={formData.cta_link}
                            onChange={(e) => setFormData({ ...formData, cta_link: e.target.value })}
                            placeholder="e.g., /about"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="display_order">Display Order</Label>
                          <Input
                            id="display_order"
                            type="number"
                            value={formData.display_order}
                            onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                        <div className="flex items-center space-x-2 pt-8">
                          <Switch
                            id="is_active"
                            checked={formData.is_active}
                            onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                          />
                          <Label htmlFor="is_active">Active</Label>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={resetForm}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                          {editingSlide ? 'Update' : 'Create'} Slide
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {isLoading ? (
                <div className="text-center py-8">Loading...</div>
              ) : (
                <div className="bg-card rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Content</TableHead>
                        <TableHead>Order</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {slides?.map((slide) => (
                        <TableRow key={slide.id}>
                          <TableCell>
                            <img
                              src={slide.image_url}
                              alt={slide.title}
                              className="w-24 h-16 object-cover rounded"
                            />
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="font-medium text-sm line-clamp-1">{slide.title}</p>
                              {slide.welcome_text && (
                                <p className="text-xs text-primary line-clamp-1">{slide.welcome_text}</p>
                              )}
                              {slide.subtitle && (
                                <p className="text-xs text-muted-foreground line-clamp-1">{slide.subtitle}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{slide.display_order}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              slide.is_active ? 'bg-green-100 text-green-800' : 'bg-muted text-muted-foreground'
                            }`}>
                              {slide.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(slide)}>
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteMutation.mutate(slide.id)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {slides?.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            No hero slides found. Add your first slide.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default HeroSlidesManagement;
