import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Play, ArrowRight, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

// Default settings
const defaultSettings = {
  title: 'The Campus Life',
  description: `Campus Life at SSTU is more than just an academic journey; it's a vibrant mosaic of experiences, interactions, and personal growth. From rigorous academic pursuits to extracurricular engagements, the campus thrives with diversity and opportunities for students to flourish. With a rich blend of cultural exchange, innovative initiatives, and a supportive community, SSTU's campus life nurtures not only academic excellence but also the development of well-rounded individuals equipped to thrive in a dynamic world.`,
  description_2: `Every step within our campus resonates with camaraderie, exploration, and the forging of lifelong connections. Establishing clear rules and guidelines at the onset is fundamental to creating a structured and productive environment.`,
  video_url: '',
  video_thumbnail: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
  background_image: '',
  campus_image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&q=80',
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
  const campusImage = (content as any).campus_image || content.video_thumbnail || 
    (videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : defaultSettings.campus_image);

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="grid lg:grid-cols-2 min-h-[600px]">
        {/* Left Side - Image with Play Button */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative group cursor-pointer min-h-[400px] lg:min-h-full"
          onClick={() => videoId && setVideoOpen(true)}
        >
          {/* Campus Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${campusImage}')` }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-black/40" />

          {/* Play Button - Centered */}
          {videoId && (
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                {/* Outer ring with animation */}
                <div className="absolute inset-0 w-24 h-24 rounded-full bg-white/30 animate-ping" style={{ animationDuration: '2s' }} />
                
                {/* Main play button */}
                <div className="relative w-24 h-24 rounded-full bg-white shadow-2xl flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center group-hover:bg-white transition-colors duration-300">
                    <Play className="w-7 h-7 text-white fill-white group-hover:text-primary group-hover:fill-primary ml-1 transition-colors duration-300" />
                  </div>
                </div>
              </motion.div>
            </div>
          )}
          
          {/* No video placeholder */}
          {!videoId && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white/60 text-center">
                <ImageIcon className="w-16 h-16 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Campus Life</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Right Side - Content */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col justify-center px-8 py-12 lg:px-16 lg:py-16 bg-background"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-8">
            {content.title || defaultSettings.title}
          </h2>
          
          <p className="text-muted-foreground leading-relaxed mb-6 text-base lg:text-lg">
            {content.description || defaultSettings.description}
          </p>
          
          <p className="text-muted-foreground/80 leading-relaxed mb-8 text-base lg:text-lg">
            {content.description_2 || defaultSettings.description_2}
          </p>
          
          <div>
            <Link to="/about">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 group font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-base">
                Find out more
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </motion.div>
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
