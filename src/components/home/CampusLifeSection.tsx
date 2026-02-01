import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Play, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

// Default settings
const defaultSettings = {
  title: 'The Campus Life',
  description: `SSTU is endowed with a beautiful campus spread over 50 acres of lush green 
    landscape. The campus provides a serene and peaceful environment conducive 
    to learning and research activities.`,
  description_2: `The university offers a vibrant campus life with various cultural, sports, 
    and academic activities. Students can participate in numerous clubs and 
    organizations that cater to diverse interests, from technology and innovation 
    to arts and culture.`,
  video_url: '',
  video_thumbnail: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
  background_image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920&q=80',
};

// Helper to extract YouTube video ID
const getYouTubeId = (url: string): string | null => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export const CampusLifeSection = () => {
  const [videoOpen, setVideoOpen] = useState(false);

  // Fetch campus life settings from database
  const { data: settings } = useQuery({
    queryKey: ['site-settings-campus-life'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'campus_life')
        .maybeSingle();
      
      if (error) throw error;
      return data?.setting_value as typeof defaultSettings | null;
    },
  });

  const content = settings || defaultSettings;
  const videoId = getYouTubeId(content.video_url || '');
  const thumbnail = content.video_thumbnail || 
    (videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : defaultSettings.video_thumbnail);
  const backgroundImage = content.background_image || defaultSettings.background_image;

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
        }}
      />
      <div className="absolute inset-0 bg-primary/80" />

      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Video Thumbnail */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative group cursor-pointer"
            onClick={() => videoId && setVideoOpen(true)}
          >
            <div className="aspect-video rounded-xl overflow-hidden shadow-2xl">
              <img
                src={thumbnail}
                alt="Campus Life Video"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Play Button */}
              {videoId && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                  <div className="w-20 h-20 rounded-full bg-gold flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <Play className="w-8 h-8 text-primary fill-primary ml-1" />
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6">
              {content.title || defaultSettings.title}
            </h2>
            <p className="text-white/90 leading-relaxed mb-4">
              {content.description || defaultSettings.description}
            </p>
            <p className="text-white/80 leading-relaxed mb-6">
              {content.description_2 || defaultSettings.description_2}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/gallery">
                <Button className="bg-gold text-primary hover:bg-gold/90 group font-semibold px-6 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  Photo Gallery
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/about/campus-map">
                <Button className="bg-white/15 backdrop-blur-sm text-white border border-white/30 hover:bg-white hover:text-primary font-semibold px-6 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  Campus Map
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Video Modal */}
      <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
        <DialogContent className="max-w-4xl p-0 bg-black border-none">
          <button
            onClick={() => setVideoOpen(false)}
            className="absolute -top-10 right-0 text-white hover:text-gold transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          {videoId && (
            <div className="aspect-video w-full">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                title="Campus Life Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};
