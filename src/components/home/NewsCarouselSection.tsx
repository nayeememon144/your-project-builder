import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const sampleNews = [
  {
    id: '1',
    title: '58th Syndicate meeting held at SSTU',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&q=80',
    date: 'Jan 25, 2026',
  },
  {
    id: '2',
    title: 'SSTU hosts first inter-university debating competition',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&q=80',
    date: 'Jan 24, 2026',
  },
  {
    id: '3',
    title: 'বাংলাদেশ প্রকৌশল বিশ্ববিদ্যালয়ে প্রযুক্তি মেলা',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&q=80',
    date: 'Jan 23, 2026',
  },
  {
    id: '4',
    title: 'New research lab inaugurated at Engineering Faculty',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=400&q=80',
    date: 'Jan 22, 2026',
  },
];

export const NewsCarouselSection = () => {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 3;

  const next = () => {
    setStartIndex((prev) => 
      prev + 1 >= sampleNews.length - visibleCount + 1 ? 0 : prev + 1
    );
  };

  const prev = () => {
    setStartIndex((prev) => 
      prev === 0 ? sampleNews.length - visibleCount : prev - 1
    );
  };

  const visibleNews = sampleNews.slice(startIndex, startIndex + visibleCount);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Academic's News
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {visibleNews.map((news, idx) => (
            <motion.div
              key={news.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
            >
              <Link to={`/news/${news.id}`}>
                <Card className="overflow-hidden group cursor-pointer h-full">
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={news.image}
                      alt={news.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <span className="text-white/80 text-sm">{news.date}</span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {news.title}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: sampleNews.length - visibleCount + 1 }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setStartIndex(idx)}
              className={`w-3 h-3 rounded-full transition-colors ${
                idx === startIndex ? 'bg-gold' : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
