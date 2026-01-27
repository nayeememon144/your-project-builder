import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import campus1 from '@/assets/campus/campus-1.jpg';
import campus2 from '@/assets/campus/campus-2.jpg';
import campus3 from '@/assets/campus/campus-3.jpg';

const defaultSlides = [
  {
    id: '1',
    image_url: campus1,
  },
  {
    id: '2',
    image_url: campus2,
  },
  {
    id: '3',
    image_url: campus3,
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
    <section className="relative h-[85vh] min-h-[550px] max-h-[750px] overflow-hidden">
      {/* Background Slides - Crossfade without white flash */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ 
            opacity: index === currentSlide ? 1 : 0,
            zIndex: index === currentSlide ? 1 : 0
          }}
        >
          <motion.div
            className="absolute inset-0"
            animate={{ 
              scale: index === currentSlide ? 1.1 : 1 
            }}
            transition={{ 
              duration: 6, 
              ease: "linear" 
            }}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image_url})` }}
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/50 to-primary/70" />
        </div>
      ))}

      {/* Fixed Content Card - Does NOT animate with slides */}
      <div className="relative z-10 h-full container mx-auto flex items-center justify-center">
        <div className="text-center">
          {/* Glass Card with University Name */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-primary/40 backdrop-blur-md rounded-2xl px-8 py-10 md:px-16 md:py-14 border border-white/10 shadow-2xl max-w-5xl mx-4"
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
      <div className="absolute z-20 bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
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
    </section>
  );
};
