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
  category?: {
    name: string;
    slug: string;
  };
}

const sampleNotices: Notice[] = [
  {
    id: '1',
    title: 'বাংলাদেশ বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়ে শিক্ষক নিয়োগ বিজ্ঞপ্তি',
    published_at: new Date().toISOString(),
    is_pinned: true,
    is_featured: true,
    category: { name: 'Recruitment', slug: 'recruitment' }
  },
  {
    id: '2',
    title: 'সকল বিভাগের জন্য ফাইনাল পরীক্ষার সময়সূচী',
    published_at: new Date(Date.now() - 86400000).toISOString(),
    is_pinned: false,
    is_featured: false,
    category: { name: 'Exam', slug: 'exam' }
  },
  {
    id: '3',
    title: 'Scholarship Applications Open for Academic Year 2025-26',
    published_at: new Date(Date.now() - 172800000).toISOString(),
    is_pinned: false,
    is_featured: false,
    category: { name: 'Scholarship', slug: 'scholarship' }
  },
  {
    id: '4',
    title: 'গবেষণা কর্মশালার জন্য নিবন্ধন শুরু',
    published_at: new Date(Date.now() - 259200000).toISOString(),
    is_pinned: false,
    is_featured: false,
    category: { name: 'Workshop', slug: 'workshop' }
  },
  {
    id: '5',
    title: 'Annual Sports Competition Registration Notice',
    published_at: new Date(Date.now() - 345600000).toISOString(),
    is_pinned: false,
    is_featured: false,
    category: { name: 'Sports', slug: 'sports' }
  },
];

export const NoticesSection = () => {
  const [notices, setNotices] = useState<Notice[]>(sampleNotices);

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

      if (!error && data && data.length > 0) {
        setNotices(data.map(n => ({
          ...n,
          category: n.notice_categories
        })));
      }
    };

    fetchNotices();
  }, []);

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
