import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  featured_image: string | null;
  published_at: string | null;
}

export const NewsCarouselSection = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const visibleCount = 3;

  useEffect(() => {
    const fetchNews = async () => {
      const { data, error } = await supabase
        .from('news')
        .select('id, title, slug, featured_image, published_at')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(6);

      if (!error && data) {
        setNews(data);
      }
      setLoading(false);
    };

    fetchNews();
  }, []);

  const next = () => {
    if (news.length <= visibleCount) return;
    setStartIndex((prev) => 
      prev + 1 >= news.length - visibleCount + 1 ? 0 : prev + 1
    );
  };

  const prev = () => {
    if (news.length <= visibleCount) return;
    setStartIndex((prev) => 
      prev === 0 ? news.length - visibleCount : prev - 1
    );
  };

  const visibleNews = news.slice(startIndex, startIndex + visibleCount);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Academic's News
            </h2>
          </div>
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading news...</p>
          </div>
        </div>
      </section>
    );
  }

  if (news.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Academic's News
            </h2>
          </div>
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-muted-foreground">No news available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Academic's News
          </h2>
          {news.length > visibleCount && (
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
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {visibleNews.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
            >
              <Link to={`/news/${item.slug}`}>
                <Card className="overflow-hidden group cursor-pointer h-full">
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={item.featured_image || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80'}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <span className="text-white/80 text-sm">
                        {item.published_at ? format(new Date(item.published_at), 'MMM dd, yyyy') : 'N/A'}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Navigation Dots */}
        {news.length > visibleCount && (
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: news.length - visibleCount + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setStartIndex(idx)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  idx === startIndex ? 'bg-gold' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
