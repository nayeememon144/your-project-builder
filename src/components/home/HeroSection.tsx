import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronDown, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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

  const getOptimizedUrl = useCallback((url: string) => {
    if (url.includes('unsplash.com')) {
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}fm=webp&q=80&fit=crop&w=1920&h=1080`;
    }
    return url;
  }, []);

  useEffect(() => {
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
        backgroundColor: !isLoaded ? 'hsl(var(--primary))' : undefined,
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

interface HeroContent {
  university_name?: string;
  welcome_text?: string;
  tagline?: string;
}

export const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

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

  const { data: heroContent } = useQuery({
    queryKey: ['hero-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'hero_content')
        .maybeSingle();
      if (error) throw error;
      const value = data?.setting_value as Record<string, string> | null;
      return value as HeroContent | null;
    },
  });

  const slides = dbSlides && dbSlides.length > 0 ? dbSlides : defaultSlides;
  const universityName = heroContent?.university_name || 'Sunamgonj Science and Technology University';
  const welcomeText = heroContent?.welcome_text || 'Welcome to SSTU';
  const tagline = heroContent?.tagline || 'Admissions, academics, research, and campus life—everything in one place.';

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/teachers?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <section 
      className="relative h-screen overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Slides */}
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
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
          </div>
        );
      })}

      {/* Hero Content */}
      <div className="relative z-10 h-full container mx-auto flex flex-col items-start justify-center px-4 md:px-8 lg:px-16">
        <div className="text-left max-w-3xl">
          {/* University Name */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-formal text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-wide drop-shadow-lg"
          >
            {universityName}
          </motion.h1>

          {/* Welcome Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 text-3xl md:text-4xl font-semibold text-white drop-shadow-md"
          >
            {welcomeText}
          </motion.p>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-4 text-lg md:text-xl text-white/90 drop-shadow-sm"
          >
            {tagline}
          </motion.p>

          {/* Search Bar */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            onSubmit={handleSearch}
            className="mt-10 flex flex-col sm:flex-row items-start gap-3 max-w-xl"
          >
            <div className="relative flex-1 w-full">
              <Input
                type="text"
                placeholder="Search faculty/staff (name, title, email)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 pl-5 pr-4 text-base bg-white/95 border-0 rounded-full shadow-xl placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="h-14 px-10 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-xl"
            >
              <Search className="w-5 h-5 mr-2" />
              Search
            </Button>
          </motion.form>
        </div>
      </div>

      {/* Navigation Arrows */}
      <AnimatePresence>
        {isHovered && (
          <>
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              onClick={prevSlide}
              className="absolute z-20 left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              onClick={nextSlide}
              className="absolute z-20 right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </>
        )}
      </AnimatePresence>

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

      {/* Scroll Down Button */}
      <motion.button
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        className="absolute z-20 bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/80 hover:text-white transition-colors cursor-pointer"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        aria-label="Scroll down"
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.button>
    </section>
  );
};
