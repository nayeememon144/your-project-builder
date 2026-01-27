import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface Notice {
  id: string;
  title: string;
  published_at: string;
  is_pinned: boolean;
  is_featured: boolean;
  notice_categories: {
    name: string;
    slug: string;
  } | null;
}

export const NoticesSection = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      const { data, error } = await supabase
        .from('notices')
        .select(`
          id,
          title,
          published_at,
          is_pinned,
          is_featured,
          notice_categories (name, slug)
        `)
        .eq('status', 'published')
        .order('is_pinned', { ascending: false })
        .order('published_at', { ascending: false })
        .limit(5);

      if (!error && data) {
        setNotices(data);
      }
      setLoading(false);
    };

    fetchNotices();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground uppercase tracking-wide">
              Latest Notices
            </h2>
          </div>
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading notices...</p>
          </div>
        </div>
      </section>
    );
  }

  if (notices.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground uppercase tracking-wide">
              Latest Notices
            </h2>
          </div>
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-muted-foreground">No notices available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground uppercase tracking-wide">
            Latest Notices
          </h2>
          <Link to="/notices">
            <Button variant="link" className="text-primary group p-0">
              View All Notices
              <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
          {notices.map((notice, idx) => (
            <motion.div
              key={notice.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <Link 
                to={`/notices/${notice.id}`}
                className={`flex items-center gap-4 p-4 hover:bg-gray-100 transition-colors group ${
                  idx !== notices.length - 1 ? 'border-b border-gray-200' : ''
                }`}
              >
                {/* Date Box */}
                <div className="flex-shrink-0 w-14 h-14 bg-primary text-white rounded flex flex-col items-center justify-center">
                  <span className="text-lg font-bold leading-none">
                    {format(new Date(notice.published_at), 'dd')}
                  </span>
                  <span className="text-xs uppercase mt-0.5">
                    {format(new Date(notice.published_at), 'MMM')}
                  </span>
                </div>

                {/* Notice Title */}
                <div className="flex-1 min-w-0">
                  <p className="text-foreground font-medium group-hover:text-primary transition-colors line-clamp-2">
                    {notice.title}
                  </p>
                  {notice.notice_categories && (
                    <span className="text-xs text-muted-foreground">
                      {notice.notice_categories.name}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button className="w-8 h-8 rounded bg-gray-200 hover:bg-primary hover:text-white flex items-center justify-center transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                  <div className="w-8 h-8 rounded bg-gold/20 text-gold flex items-center justify-center">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
