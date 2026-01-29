import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Image as ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface GalleryImage {
  id: string;
  title: string | null;
  image_url: string;
  description: string | null;
  album_id: string | null;
}

interface Album {
  id: string;
  title: string;
  title_bn: string | null;
  cover_image: string | null;
}

const Gallery = () => {
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch active albums
  const { data: albums, isLoading: albumsLoading } = useQuery({
    queryKey: ['gallery-albums'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_albums')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as Album[];
    },
  });

  // Fetch images for selected album or all images
  const { data: images, isLoading: imagesLoading } = useQuery({
    queryKey: ['gallery-images', selectedAlbum],
    queryFn: async () => {
      let query = supabase
        .from('gallery_images')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (selectedAlbum) {
        query = query.eq('album_id', selectedAlbum);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as GalleryImage[];
    },
  });

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = () => {
    if (images && currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const placeholderImages = [
    'https://images.unsplash.com/photo-1562774053-701939374585?w=600&q=80',
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&q=80',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80',
    'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=600&q=80',
    'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=600&q=80',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&q=80',
  ];

  const isLoading = albumsLoading || imagesLoading;
  const hasContent = (albums && albums.length > 0) || (images && images.length > 0);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-primary text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Photo Gallery
          </h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Explore moments captured at Sunamgonj Science and Technology University
          </p>
        </div>
      </section>

      {/* Gallery Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Album Filter */}
          {albums && albums.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              <Button
                variant={selectedAlbum === null ? 'default' : 'outline'}
                onClick={() => setSelectedAlbum(null)}
              >
                All Photos
              </Button>
              {albums.map((album) => (
                <Button
                  key={album.id}
                  variant={selectedAlbum === album.id ? 'default' : 'outline'}
                  onClick={() => setSelectedAlbum(album.id)}
                >
                  {album.title}
                </Button>
              ))}
            </div>
          )}

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, idx) => (
                <Skeleton key={idx} className="h-64 rounded-xl" />
              ))}
            </div>
          ) : images && images.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {images.map((image, idx) => (
                <div 
                  key={image.id} 
                  className="group cursor-pointer"
                  onClick={() => openLightbox(idx)}
                >
                  <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-muted">
                    <img 
                      src={image.image_url} 
                      alt={image.title || 'Gallery image'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    {image.title && (
                      <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <h3 className="text-white font-semibold text-sm">{image.title}</h3>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : hasContent ? (
            <div className="text-center py-12">
              <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No photos in this album</h3>
              <p className="text-muted-foreground">Select another album or check back later</p>
            </div>
          ) : (
            // Show placeholder gallery
            <div>
              <p className="text-center text-muted-foreground mb-8">
                Campus photo gallery coming soon. Here are some sample images.
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {placeholderImages.map((img, idx) => (
                  <div key={idx} className="group cursor-pointer">
                    <div className="relative rounded-xl overflow-hidden aspect-[4/3]">
                      <img 
                        src={img} 
                        alt={`Campus ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-5xl p-0 bg-black/95 border-0">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 z-50 text-white/80 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
          
          {images && images[currentImageIndex] && (
            <div className="relative flex items-center justify-center min-h-[70vh]">
              <img
                src={images[currentImageIndex].image_url}
                alt={images[currentImageIndex].title || 'Gallery image'}
                className="max-h-[80vh] max-w-full object-contain"
              />
              
              {/* Navigation */}
              {currentImageIndex > 0 && (
                <button
                  onClick={prevImage}
                  className="absolute left-4 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}
              {images && currentImageIndex < images.length - 1 && (
                <button
                  onClick={nextImage}
                  className="absolute right-4 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
              
              {/* Caption */}
              {images[currentImageIndex].title && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-white text-center">{images[currentImageIndex].title}</p>
                  {images[currentImageIndex].description && (
                    <p className="text-white/70 text-sm text-center mt-1">
                      {images[currentImageIndex].description}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Gallery;
