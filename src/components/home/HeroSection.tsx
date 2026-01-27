import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import campus1 from '@/assets/campus/campus-1.jpg';
import campus2 from '@/assets/campus/campus-2.jpg';
import campus3 from '@/assets/campus/campus-3.jpg';

interface HeroSlide {
  id: string;
  image_url: string;
  title?: string;
  subtitle?: string;
}

const defaultSlides: HeroSlide[] = [
  { id: '1', image_url: campus1 },
  { id: '2', image_url: campus2 },
  { id: '3', image_url: campus3 },
];

// Optimized image component with lazy loading
const OptimizedHeroImage = ({ 
  src, 
  alt, 
  isActive, 
  priority = false 
}: { 
  src: string; 
  alt: string; 
  isActive: boolean; 
  priority?: boolean;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');

  // Add optimization parameters for Unsplash images
  const getOptimizedUrl = useCallback((url: string) => {
    if (url.includes('unsplash.com')) {
      // Add WebP format and quality optimization for Unsplash
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}fm=webp&q=80&fit=crop&w=1920&h=1080`;
    }
    return url;
  }, []);

  useEffect(() => {
    // Only load if priority or if becoming active soon
    if (priority || isActive) {
      const optimizedUrl = getOptimizedUrl(src);
      const img = new Image();
      img.src = optimizedUrl;
      img.onload = () => {
        setImageSrc(optimizedUrl);
        setIsLoaded(true);
      };
    }
  }, [src, isActive, priority, getOptimizedUrl]);

  return (
    <div 
      className="absolute inset-0 bg-cover bg-center transition-transform duration-[6000ms] ease-linear"
      style={{ 
        backgroundImage: isLoaded ? `url(${imageSrc})` : undefined,
        backgroundColor: !isLoaded ? '#1a1a2e' : undefined,
        transform: isActive ? 'scale(1.1)' : 'scale(1)'
      }}
    >
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

export const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch hero slides from database
  const { data: dbSlides } = useQuery({
    queryKey: ['hero-slides'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as HeroSlide[];
    },
  });

  // Use database slides if available, otherwise use defaults
  const slides = dbSlides && dbSlides.length > 0 ? dbSlides : defaultSlides;

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Slides - Optimized with lazy loading */}
      {slides.map((slide, index) => {
        const isActive = index === currentSlide;
        const isNext = index === (currentSlide + 1) % slides.length;
        const isPrev = index === (currentSlide - 1 + slides.length) % slides.length;
        
        return (
          <div
            key={slide.id}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{ 
              opacity: isActive ? 1 : 0,
              zIndex: isActive ? 1 : 0
            }}
          >
            <OptimizedHeroImage 
              src={slide.image_url}
              alt={slide.title || `Campus slide ${index + 1}`}
              isActive={isActive}
              priority={index === 0 || isNext || isPrev}
            />
            {/* Subtle dark gradient overlay - keeps image visible */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50" />
          </div>
        );
      })}

      {/* Fixed Content Card - Does NOT animate with slides */}
      <div className="relative z-10 h-full container mx-auto flex items-center justify-center">
        <div className="text-center">
          {/* Glass Card with University Name */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl px-8 py-10 md:px-16 md:py-14 border border-white/20 shadow-[0_0_60px_rgba(255,255,255,0.15),0_0_100px_rgba(34,139,87,0.2)] max-w-5xl mx-4"
          >
            {/* Welcome Text - Smaller */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-white/80 tracking-[0.2em] uppercase text-xs md:text-sm mb-3"
            >
              Welcome To
            </motion.p>

            {/* University Name - Highlighted and Prominent */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="font-formal text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-wide text-center"
            >
              Sunamgonj Science and Technology University
            </motion.h1>
          </motion.div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute z-20 left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute z-20 right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute z-20 bottom-24 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentSlide 
                ? 'w-10 bg-gold' 
                : 'w-2 bg-white/50 hover:bg-white'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Scroll Down Indicator */}
      <motion.button
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        className="absolute z-20 bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/90 hover:text-white transition-colors cursor-pointer"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        aria-label="Scroll down"
      >
        <span className="text-sm font-medium uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-7 h-7" />
        </motion.div>
      </motion.button>
    </section>
  );
};
