import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CampusLifeSection = () => {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920&q=80')`,
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
          >
            <div className="aspect-video rounded-xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80"
                alt="Campus Life Video"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                <div className="w-20 h-20 rounded-full bg-gold flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <Play className="w-8 h-8 text-primary fill-primary ml-1" />
                </div>
              </div>
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
              The Campus Life
            </h2>
            <p className="text-white/90 leading-relaxed mb-4">
              SSTU is endowed with a beautiful campus spread over 50 acres of lush green 
              landscape. The campus provides a serene and peaceful environment conducive 
              to learning and research activities.
            </p>
            <p className="text-white/80 leading-relaxed mb-6">
              The university offers a vibrant campus life with various cultural, sports, 
              and academic activities. Students can participate in numerous clubs and 
              organizations that cater to diverse interests, from technology and innovation 
              to arts and culture.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/gallery">
                <Button className="bg-gold text-primary hover:bg-gold/90 group font-semibold">
                  Photo Gallery
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/about/campus-map">
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  Campus Map
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
