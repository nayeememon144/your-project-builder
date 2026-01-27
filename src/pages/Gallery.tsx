import { MainLayout } from '@/components/layout/MainLayout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Image as ImageIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const Gallery = () => {
  const { data: albums, isLoading } = useQuery({
    queryKey: ['gallery-albums'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_albums')
        .select('*, gallery_images(count)')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const placeholderImages = [
    'https://images.unsplash.com/photo-1562774053-701939374585?w=600&q=80',
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&q=80',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80',
    'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=600&q=80',
    'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=600&q=80',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&q=80',
  ];

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
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, idx) => (
                <Skeleton key={idx} className="h-64 rounded-xl" />
              ))}
            </div>
          ) : albums && albums.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map((album) => (
                <div key={album.id} className="group cursor-pointer">
                  <div className="relative rounded-xl overflow-hidden aspect-[4/3]">
                    <img 
                      src={album.cover_image || placeholderImages[0]} 
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-bold text-lg">{album.title}</h3>
                      {album.title_bn && (
                        <p className="bengali text-white/80 text-sm">{album.title_bn}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
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
    </MainLayout>
  );
};

export default Gallery;
