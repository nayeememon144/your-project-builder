import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Image as ImageIcon, FolderOpen, Upload, X, GripVertical } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Album {
  id: string;
  title: string;
  title_bn: string | null;
  description: string | null;
  cover_image: string | null;
  display_order: number | null;
  is_active: boolean | null;
  created_at: string;
}

interface GalleryImage {
  id: string;
  album_id: string | null;
  title: string | null;
  description: string | null;
  image_url: string;
  thumbnail_url: string | null;
  display_order: number | null;
}

const GalleryManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [isAlbumDialogOpen, setIsAlbumDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [albumForm, setAlbumForm] = useState({ title: '', title_bn: '', description: '', is_active: true });
  const [imageForm, setImageForm] = useState({ title: '', description: '' });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  // Fetch albums
  const { data: albums, isLoading: albumsLoading } = useQuery({
    queryKey: ['admin-albums'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_albums')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as Album[];
    },
  });

  // Fetch images for selected album
  const { data: images, isLoading: imagesLoading } = useQuery({
    queryKey: ['admin-images', selectedAlbum?.id],
    queryFn: async () => {
      if (!selectedAlbum) return [];
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('album_id', selectedAlbum.id)
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as GalleryImage[];
    },
    enabled: !!selectedAlbum,
  });

  // Create album mutation
  const createAlbumMutation = useMutation({
    mutationFn: async (data: typeof albumForm) => {
      const { error } = await supabase.from('gallery_albums').insert({
        title: data.title,
        title_bn: data.title_bn || null,
        description: data.description || null,
        is_active: data.is_active,
        display_order: (albums?.length || 0) + 1,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-albums'] });
      setIsAlbumDialogOpen(false);
      setAlbumForm({ title: '', title_bn: '', description: '', is_active: true });
      toast({ title: 'Album created successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to create album', variant: 'destructive' });
    },
  });

  // Update album mutation
  const updateAlbumMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof albumForm }) => {
      const { error } = await supabase.from('gallery_albums').update({
        title: data.title,
        title_bn: data.title_bn || null,
        description: data.description || null,
        is_active: data.is_active,
      }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-albums'] });
      setIsAlbumDialogOpen(false);
      setEditingAlbum(null);
      setAlbumForm({ title: '', title_bn: '', description: '', is_active: true });
      toast({ title: 'Album updated successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to update album', variant: 'destructive' });
    },
  });

  // Delete album mutation
  const deleteAlbumMutation = useMutation({
    mutationFn: async (id: string) => {
      // First delete all images in the album
      const { error: imagesError } = await supabase
        .from('gallery_images')
        .delete()
        .eq('album_id', id);
      if (imagesError) throw imagesError;
      
      const { error } = await supabase.from('gallery_albums').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-albums'] });
      if (selectedAlbum?.id === selectedAlbum?.id) {
        setSelectedAlbum(null);
      }
      toast({ title: 'Album deleted successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to delete album', variant: 'destructive' });
    },
  });

  // Delete image mutation
  const deleteImageMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('gallery_images').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-images', selectedAlbum?.id] });
      toast({ title: 'Image deleted successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to delete image', variant: 'destructive' });
    },
  });

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !selectedAlbum) return;
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `gallery/${selectedAlbum.id}/${Date.now()}.${fileExt}`;
    
    setUploadingImage(true);
    
    try {
      const { error: uploadError } = await supabase.storage
        .from('attachments')
        .upload(fileName, file);
      
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('attachments')
        .getPublicUrl(fileName);
      
      const { error: insertError } = await supabase.from('gallery_images').insert({
        album_id: selectedAlbum.id,
        title: imageForm.title || file.name,
        description: imageForm.description || null,
        image_url: publicUrl,
        display_order: (images?.length || 0) + 1,
      });
      
      if (insertError) throw insertError;
      
      queryClient.invalidateQueries({ queryKey: ['admin-images', selectedAlbum.id] });
      setIsImageDialogOpen(false);
      setImageForm({ title: '', description: '' });
      toast({ title: 'Image uploaded successfully' });
    } catch (error) {
      toast({ title: 'Failed to upload image', variant: 'destructive' });
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle cover image upload
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>, albumId: string) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `gallery/covers/${albumId}-${Date.now()}.${fileExt}`;
    
    setUploadingCover(true);
    
    try {
      const { error: uploadError } = await supabase.storage
        .from('attachments')
        .upload(fileName, file);
      
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('attachments')
        .getPublicUrl(fileName);
      
      const { error: updateError } = await supabase.from('gallery_albums')
        .update({ cover_image: publicUrl })
        .eq('id', albumId);
      
      if (updateError) throw updateError;
      
      queryClient.invalidateQueries({ queryKey: ['admin-albums'] });
      toast({ title: 'Cover image updated' });
    } catch (error) {
      toast({ title: 'Failed to upload cover', variant: 'destructive' });
    } finally {
      setUploadingCover(false);
    }
  };

  const openEditDialog = (album: Album) => {
    setEditingAlbum(album);
    setAlbumForm({
      title: album.title,
      title_bn: album.title_bn || '',
      description: album.description || '',
      is_active: album.is_active ?? true,
    });
    setIsAlbumDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Gallery Management</h1>
            <p className="text-muted-foreground">Manage photo albums and images</p>
          </div>
        </div>

        <Tabs defaultValue="albums" className="space-y-6">
          <TabsList>
            <TabsTrigger value="albums" className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4" />
              Albums
            </TabsTrigger>
            <TabsTrigger value="images" className="flex items-center gap-2" disabled={!selectedAlbum}>
              <ImageIcon className="w-4 h-4" />
              Images {selectedAlbum && `(${selectedAlbum.title})`}
            </TabsTrigger>
          </TabsList>

          {/* Albums Tab */}
          <TabsContent value="albums" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={isAlbumDialogOpen} onOpenChange={setIsAlbumDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => { setEditingAlbum(null); setAlbumForm({ title: '', title_bn: '', description: '', is_active: true }); }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Album
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingAlbum ? 'Edit Album' : 'Create Album'}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (editingAlbum) {
                      updateAlbumMutation.mutate({ id: editingAlbum.id, data: albumForm });
                    } else {
                      createAlbumMutation.mutate(albumForm);
                    }
                  }} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Title *</label>
                      <Input
                        value={albumForm.title}
                        onChange={(e) => setAlbumForm({ ...albumForm, title: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Title (Bengali)</label>
                      <Input
                        value={albumForm.title_bn}
                        onChange={(e) => setAlbumForm({ ...albumForm, title_bn: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        value={albumForm.description}
                        onChange={(e) => setAlbumForm({ ...albumForm, description: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={albumForm.is_active}
                        onCheckedChange={(checked) => setAlbumForm({ ...albumForm, is_active: checked })}
                      />
                      <label className="text-sm">Active (visible to public)</label>
                    </div>
                    <Button type="submit" className="w-full" disabled={createAlbumMutation.isPending || updateAlbumMutation.isPending}>
                      {editingAlbum ? 'Update Album' : 'Create Album'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {albumsLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-48 rounded-xl" />
                ))}
              </div>
            ) : albums && albums.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {albums.map((album) => (
                  <Card 
                    key={album.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${selectedAlbum?.id === album.id ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => setSelectedAlbum(album)}
                  >
                    <div className="relative aspect-video bg-muted rounded-t-lg overflow-hidden">
                      {album.cover_image ? (
                        <img src={album.cover_image} alt={album.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <ImageIcon className="w-12 h-12 text-muted-foreground/50" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleCoverUpload(e, album.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <Button size="sm" variant="secondary" className="h-8" onClick={(e) => e.stopPropagation()}>
                            <Upload className="w-3 h-3 mr-1" />
                            Cover
                          </Button>
                        </label>
                      </div>
                      {!album.is_active && (
                        <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                          Hidden
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{album.title}</h3>
                      {album.title_bn && <p className="text-sm text-muted-foreground bengali">{album.title_bn}</p>}
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); openEditDialog(album); }}>
                          <Pencil className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={(e) => { e.stopPropagation(); if (confirm('Delete this album and all its images?')) deleteAlbumMutation.mutate(album.id); }}
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/50 rounded-xl">
                <FolderOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No Albums Yet</h3>
                <p className="text-muted-foreground mb-4">Create your first album to start organizing photos</p>
              </div>
            )}
          </TabsContent>

          {/* Images Tab */}
          <TabsContent value="images" className="space-y-4">
            {selectedAlbum ? (
              <>
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold">{selectedAlbum.title}</h2>
                    <p className="text-sm text-muted-foreground">{images?.length || 0} images</p>
                  </div>
                  <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Image
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Upload Image</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Title (Optional)</label>
                          <Input
                            value={imageForm.title}
                            onChange={(e) => setImageForm({ ...imageForm, title: e.target.value })}
                            placeholder="Image title"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Description (Optional)</label>
                          <Textarea
                            value={imageForm.description}
                            onChange={(e) => setImageForm({ ...imageForm, description: e.target.value })}
                            rows={2}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Select Image *</label>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploadingImage}
                          />
                        </div>
                        {uploadingImage && (
                          <p className="text-sm text-muted-foreground">Uploading...</p>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {imagesLoading ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                      <Skeleton key={i} className="aspect-square rounded-lg" />
                    ))}
                  </div>
                ) : images && images.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image) => (
                      <div key={image.id} className="group relative aspect-square rounded-lg overflow-hidden bg-muted">
                        <img src={image.image_url} alt={image.title || ''} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => { if (confirm('Delete this image?')) deleteImageMutation.mutate(image.id); }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        {image.title && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2">
                            <p className="text-white text-xs truncate">{image.title}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-muted/50 rounded-xl">
                    <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">No Images Yet</h3>
                    <p className="text-muted-foreground mb-4">Upload images to this album</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Select an album from the Albums tab to manage its images</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default GalleryManagement;
