import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Bell, Calendar, ArrowRight, Download, Pin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    title: 'Final Exam Schedule for Spring 2025 Semester',
    published_at: new Date().toISOString(),
    is_pinned: true,
    is_featured: true,
    category: { name: 'Exam', slug: 'exam' }
  },
  {
    id: '2',
    title: 'Scholarship Applications Open for Academic Year 2025-26',
    published_at: new Date(Date.now() - 86400000).toISOString(),
    is_pinned: false,
    is_featured: true,
    category: { name: 'Scholarship', slug: 'scholarship' }
  },
  {
    id: '3',
    title: 'Workshop on Research Methodology - Registration Open',
    published_at: new Date(Date.now() - 172800000).toISOString(),
    is_pinned: false,
    is_featured: false,
    category: { name: 'Workshop', slug: 'workshop' }
  },
  {
    id: '4',
    title: 'Library will remain closed on March 26 for maintenance',
    published_at: new Date(Date.now() - 259200000).toISOString(),
    is_pinned: false,
    is_featured: false,
    category: { name: 'General', slug: 'general' }
  },
  {
    id: '5',
    title: 'Call for Papers: International Conference on AI & ML',
    published_at: new Date(Date.now() - 345600000).toISOString(),
    is_pinned: false,
    is_featured: false,
    category: { name: 'Conference', slug: 'conference' }
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
    <section className="py-20 bg-background section-divider">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Bell className="w-8 h-8 text-accent" />
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Latest Notices
              </h2>
            </div>
            <p className="text-muted-foreground">
              Stay updated with the latest announcements and notifications
            </p>
          </div>
          <Link to="/notices">
            <Button variant="outline" className="group">
              View All Notices
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-4">
          {notices.map((notice, idx) => (
            <motion.div
              key={notice.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <Card className={`card-hover ${notice.is_pinned ? 'notice-featured' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {notice.is_pinned && (
                          <Badge variant="secondary" className="bg-gold text-primary">
                            <Pin className="w-3 h-3 mr-1" />
                            Pinned
                          </Badge>
                        )}
                        {notice.category && (
                          <Badge variant="outline">
                            {notice.category.name}
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-medium text-lg text-foreground hover:text-accent transition-colors">
                        <Link to={`/notices/${notice.id}`}>
                          {notice.title}
                        </Link>
                      </h3>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {format(new Date(notice.published_at), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      <Link 
                        to={`/notices/${notice.id}`}
                        className="flex items-center gap-1 text-accent hover:underline"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
