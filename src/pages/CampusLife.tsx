import { MainLayout } from '@/components/layout/MainLayout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Play, Users, Home, BookOpen, Music, Trophy, Heart } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const activities = [
  { icon: Users, title: 'Student Clubs', description: 'Join various clubs and organizations to explore your interests and develop leadership skills.' },
  { icon: Home, title: 'Residential Halls', description: 'Modern residential facilities providing a comfortable and secure living environment for students.' },
  { icon: BookOpen, title: 'Library & Study', description: 'Well-equipped library with extensive resources for academic research and study.' },
  { icon: Music, title: 'Cultural Activities', description: 'Participate in cultural events, festivals, and performances throughout the year.' },
  { icon: Trophy, title: 'Sports & Fitness', description: 'Various sports facilities and inter-university competitions for physical development.' },
  { icon: Heart, title: 'Student Welfare', description: 'Comprehensive support services for student health, counseling, and wellbeing.' },
];

function CampusLife() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Fetch campus life settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ['campus-life-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'campus_life')
        .maybeSingle();
      
      if (error) throw error;
      return data?.setting_value as {
        video_url?: string;
        video_thumbnail?: string;
        campus_image?: string;
        title?: string;
        description?: string;
        description_2?: string;
      } | null;
    },
  });

  // Fetch gallery images for campus life
  const { data: galleryImages } = useQuery({
    queryKey: ['campus-life-gallery'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('display_order', { ascending: true })
        .limit(6);
      if (error) throw error;
      return data;
    },
  });

  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return '';
    const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : '';
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            {settings?.title || 'Campus Life'}
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl">
            Experience vibrant student life at SSTU with world-class facilities, cultural activities, and a supportive community.
          </p>
        </div>
      </section>

      {/* Video/Image Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Video/Image Panel */}
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl bg-card">
              {settings?.video_url && isVideoPlaying ? (
                <iframe
                  src={getYouTubeEmbedUrl(settings.video_url)}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Campus Life Video"
                />
              ) : (
                <>
                  {settings?.campus_image || settings?.video_thumbnail ? (
                    <img 
                      src={settings.campus_image || settings.video_thumbnail} 
                      alt="Campus Life" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <Users className="w-24 h-24 text-primary/30" />
                    </div>
                  )}
                  {settings?.video_url && (
                    <button 
                      onClick={() => setIsVideoPlaying(true)}
                      className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors group"
                    >
                      <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" />
                      </div>
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Content Panel */}
            <div className="space-y-6">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                {settings?.title || 'The Campus Life'}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {settings?.description || 
                  'At SSTU, we believe in nurturing well-rounded individuals. Our campus offers a vibrant environment where students can explore their interests, develop new skills, and create lasting memories.'}
              </p>
              {settings?.description_2 && (
                <p className="text-muted-foreground leading-relaxed">
                  {settings.description_2}
                </p>
              )}
              <div className="flex flex-wrap gap-3 pt-4">
                <Link 
                  to="/facilities/halls" 
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  Explore Halls
                </Link>
                <Link 
                  to="/facilities/organizations" 
                  className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-secondary/80 transition-colors"
                >
                  <Users className="w-4 h-4" />
                  Student Organizations
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Activities Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-12">
            What Makes SSTU Special
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activities.map((activity, idx) => (
              <div 
                key={idx} 
                className="bg-card rounded-xl p-6 border hover:shadow-lg transition-all group"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <activity.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">{activity.title}</h3>
                <p className="text-muted-foreground">{activity.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {galleryImages && galleryImages.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-12">
              Campus Gallery
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryImages.map((image) => (
                <div 
                  key={image.id} 
                  className="aspect-video rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                >
                  <img 
                    src={image.image_url} 
                    alt={image.title || 'Campus'} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/gallery" className="text-primary hover:underline font-medium">
                View Full Gallery →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
            Ready to Join Our Community?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Become part of the SSTU family and experience a transformative educational journey.
          </p>
          <Link 
            to="/admission" 
            className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-white/90 transition-colors"
          >
            Apply Now
          </Link>
        </div>
      </section>
    </MainLayout>
  );
}

export default CampusLife;
