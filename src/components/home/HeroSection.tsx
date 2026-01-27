import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Default hero slides (will be replaced by dynamic data)
const defaultSlides = [
  {
    id: '1',
    title: 'Welcome to SSTU',
    subtitle: 'Empowering Minds, Shaping Futures - A premier institution of higher learning dedicated to academic excellence and innovation.',
    image_url: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1920&q=80',
    cta_text: 'Explore Programs',
    cta_link: '/academic',
  },
  {
    id: '2',
    title: 'World-Class Research',
    subtitle: 'Join our faculty of distinguished researchers pushing the boundaries of knowledge across diverse fields.',
    image_url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920&q=80',
    cta_text: 'View Research',
    cta_link: '/research',
  },
  {
    id: '3',
    title: 'Admission Open 2025',
    subtitle: 'Begin your journey towards excellence. Apply now for undergraduate and postgraduate programs.',
    image_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=80',
    cta_text: 'Apply Now',
    cta_link: '/admission',
  },
];

export const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides] = useState(defaultSlides);

  useEffect(() => {
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
    <section className="relative h-[85vh] min-h-[600px] overflow-hidden">
      {/* Background Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[currentSlide].image_url})` }}
          />
          <div className="absolute inset-0 hero-pattern opacity-90" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative h-full container mx-auto flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl text-white"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '80px' }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="h-1 bg-gold mb-6"
            />
            
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              {slides[currentSlide].title}
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed max-w-2xl">
              {slides[currentSlide].subtitle}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link to={slides[currentSlide].cta_link}>
                <Button className="btn-golden text-lg px-8 py-6 group">
                  {slides[currentSlide].cta_text}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/about">
                <Button 
                  variant="outline" 
                  className="text-lg px-8 py-6 border-white/50 text-white bg-white/10 hover:bg-white hover:text-primary backdrop-blur-sm"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentSlide 
                ? 'w-12 bg-gold' 
                : 'w-2 bg-white/50 hover:bg-white'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
