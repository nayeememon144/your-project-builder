import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Plus, Pencil, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';

interface HeroSlide {
  id: string;
  title: string;
  title_bn: string | null;
  subtitle: string | null;
  subtitle_bn: string | null;
  image_url: string;
  cta_text: string | null;
  cta_link: string | null;
  display_order: number | null;
  is_active: boolean | null;
}

interface HeroContent {
  university_name: string;
  welcome_text: string;
  tagline: string;
}

const HeroSlidesManagement = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    title_bn: '',
    subtitle: '',
    subtitle_bn: '',
    image_url: '',
    cta_text: '',
    cta_link: '',
    display_order: 0,
    is_active: true,
  });

  const [heroContent, setHeroContent] = useState<HeroContent>({
    university_name: 'Sunamgonj Science and Technology University',
    welcome_text: 'Welcome to SSTU',
    tagline: 'Admissions, academics, research, and campus life—everything in one place.',
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

  const { data: savedHeroContent } = useQuery({
    queryKey: ['hero-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'hero_content')
        .maybeSingle();
      if (error) throw error;
      if (!data?.setting_value) return null;
      const value = data.setting_value as unknown as HeroContent;
      return value;
    },
  });

  useEffect(() => {
    if (savedHeroContent) {
      setHeroContent({
        university_name: savedHeroContent.university_name || 'Sunamgonj Science and Technology University',
        welcome_text: savedHeroContent.welcome_text || 'Welcome to SSTU',
        tagline: savedHeroContent.tagline || 'Admissions, academics, research, and campus life—everything in one place.',
      });
    }
  }, [savedHeroContent]);

  const saveHeroContentMutation = useMutation({
    mutationFn: async (content: HeroContent) => {
      const { data: existing } = await supabase
        .from('site_settings')
        .select('id')
        .eq('setting_key', 'hero_content')
        .maybeSingle();

      // Cast to satisfy the Json type requirement
      const settingValue = JSON.parse(JSON.stringify(content));

      if (existing) {
        const { error } = await supabase
          .from('site_settings')
          .update({ setting_value: settingValue })
          .eq('setting_key', 'hero_content');
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('site_settings')
          .insert([{ setting_key: 'hero_content', setting_value: settingValue }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-content'] });
      toast.success('Hero content saved successfully');
    },
    onError: (error) => {
      toast.error('Failed to save hero content: ' + error.message);
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
      title: '',
      title_bn: '',
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
      title: slide.title,
      title_bn: slide.title_bn || '',
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
          <h1 className="text-2xl font-bold font-formal text-foreground">Hero Section Management</h1>
          <p className="text-muted-foreground">Manage hero slider images and overlay content</p>
        </div>

        <Tabs defaultValue="content" className="space-y-6">
          <TabsList>
            <TabsTrigger value="content">Hero Content</TabsTrigger>
            <TabsTrigger value="slides">Hero Slides</TabsTrigger>
          </TabsList>

          {/* Hero Content Tab */}
          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Hero Overlay Text</CardTitle>
                <CardDescription>
                  This text is displayed on top of the hero slider images
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="university_name">University Name</Label>
                  <Input
                    id="university_name"
                    value={heroContent.university_name}
                    onChange={(e) => setHeroContent({ ...heroContent, university_name: e.target.value })}
                    placeholder="Sunamgonj Science and Technology University"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="welcome_text">Welcome Text</Label>
                  <Input
                    id="welcome_text"
                    value={heroContent.welcome_text}
                    onChange={(e) => setHeroContent({ ...heroContent, welcome_text: e.target.value })}
                    placeholder="Welcome to SSTU"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Textarea
                    id="tagline"
                    value={heroContent.tagline}
                    onChange={(e) => setHeroContent({ ...heroContent, tagline: e.target.value })}
                    placeholder="Admissions, academics, research, and campus life—everything in one place."
                    rows={2}
                  />
                </div>
                <Button 
                  onClick={() => saveHeroContentMutation.mutate(heroContent)}
                  disabled={saveHeroContentMutation.isPending}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saveHeroContentMutation.isPending ? 'Saving...' : 'Save Hero Content'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hero Slides Tab */}
          <TabsContent value="slides">
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
                          <Label htmlFor="title_bn">Title (Bengali)</Label>
                          <Input
                            id="title_bn"
                            value={formData.title_bn}
                            onChange={(e) => setFormData({ ...formData, title_bn: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="subtitle">Subtitle (English)</Label>
                          <Textarea
                            id="subtitle"
                            value={formData.subtitle}
                            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subtitle_bn">Subtitle (Bengali)</Label>
                          <Textarea
                            id="subtitle_bn"
                            value={formData.subtitle_bn}
                            onChange={(e) => setFormData({ ...formData, subtitle_bn: e.target.value })}
                          />
                        </div>
                      </div>

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
                          <Label htmlFor="cta_text">Button Text</Label>
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
                        <TableHead>Title</TableHead>
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
                          <TableCell className="font-medium">{slide.title}</TableCell>
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
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default HeroSlidesManagement;
