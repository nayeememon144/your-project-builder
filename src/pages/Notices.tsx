import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Calendar, 
  Download, 
  ChevronRight, 
  Filter,
  Pin,
  ChevronLeft
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface Notice {
  id: string;
  title: string;
  title_bn: string | null;
  description: string;
  published_at: string;
  is_pinned: boolean;
  is_featured: boolean;
  category_id: string | null;
  attachments: any;
  notice_categories: {
    name: string;
    slug: string;
  } | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

const ITEMS_PER_PAGE = 10;

const NoticesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const selectedCategory = searchParams.get('category') || '';

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    // Only fetch notices after categories are loaded (or if no category filter is applied)
    if (categories.length > 0 || !selectedCategory) {
      fetchNotices();
    }
  }, [selectedCategory, currentPage, searchQuery, categories]);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('notice_categories')
      .select('id, name, slug')
      .eq('is_active', true)
      .order('display_order');

    if (!error && data) {
      setCategories(data);
    }
  };

  const fetchNotices = async () => {
    setLoading(true);
    
    let query = supabase
      .from('notices')
      .select(`
        id,
        title,
        title_bn,
        description,
        published_at,
        is_pinned,
        is_featured,
        category_id,
        attachments,
        notice_categories (name, slug)
      `, { count: 'exact' })
      .eq('status', 'published')
      .order('is_pinned', { ascending: false })
      .order('published_at', { ascending: false });

    // Filter by category using slug directly from notice_categories
    if (selectedCategory) {
      const category = categories.find(c => c.slug === selectedCategory);
      if (category) {
        query = query.eq('category_id', category.id);
      } else {
        // If category slug doesn't match any known category, show no results
        // This prevents showing all notices when category param is invalid
        setNotices([]);
        setTotalCount(0);
        setLoading(false);
        return;
      }
    }

    // Search filter
    if (searchQuery) {
      query = query.ilike('title', `%${searchQuery}%`);
    }

    // Pagination
    const from = (currentPage - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (!error && data) {
      setNotices(data);
      setTotalCount(count || 0);
    }
    setLoading(false);
  };

  const handleCategoryChange = (slug: string) => {
    if (slug) {
      searchParams.set('category', slug);
    } else {
      searchParams.delete('category');
    }
    setSearchParams(searchParams);
    setCurrentPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchNotices();
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <MainLayout>
      {/* Page Header */}
      <section className="bg-primary py-12">
        <div className="container mx-auto">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
            Notice Board
          </h1>
          <p className="text-white/80">
            Stay updated with the latest announcements and notifications from SSTU
          </p>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar - Filters */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  {/* Search */}
                  <form onSubmit={handleSearch} className="mb-6">
                    <label className="text-sm font-medium text-foreground block mb-2">
                      Search Notices
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </form>

                  {/* Categories */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Filter className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">Categories</span>
                    </div>
                    <div className="space-y-2">
                      <button
                        onClick={() => handleCategoryChange('')}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          !selectedCategory
                            ? 'bg-primary text-white'
                            : 'hover:bg-secondary text-foreground'
                        }`}
                      >
                        All Notices
                      </button>
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => handleCategoryChange(category.slug)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            selectedCategory === category.slug
                              ? 'bg-primary text-white'
                              : 'hover:bg-secondary text-foreground'
                          }`}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Notices List */}
            <div className="lg:col-span-3">
              {/* Results Header */}
              <div className="flex justify-between items-center mb-6">
                <p className="text-muted-foreground">
                  Showing {notices.length} of {totalCount} notices
                </p>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading notices...</p>
                </div>
              ) : notices.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <p className="text-muted-foreground">No notices found.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {notices.map((notice, idx) => (
                    <motion.div
                      key={notice.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                    >
                      <Link to={`/notices/${notice.id}`}>
                        <Card className={`hover:shadow-md transition-shadow ${notice.is_pinned ? 'border-l-4 border-l-gold' : ''}`}>
                          <CardContent className="p-5">
                            <div className="flex items-start gap-4">
                              {/* Date Box */}
                              <div className="flex-shrink-0 w-16 h-16 bg-primary text-white rounded-lg flex flex-col items-center justify-center">
                                <span className="text-xl font-bold leading-none">
                                  {format(new Date(notice.published_at), 'dd')}
                                </span>
                                <span className="text-xs uppercase mt-0.5">
                                  {format(new Date(notice.published_at), 'MMM')}
                                </span>
                                <span className="text-xs">
                                  {format(new Date(notice.published_at), 'yyyy')}
                                </span>
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                  {notice.is_pinned && (
                                    <Badge className="bg-gold text-primary">
                                      <Pin className="w-3 h-3 mr-1" />
                                      Pinned
                                    </Badge>
                                  )}
                                  {notice.notice_categories && (
                                    <Badge variant="outline">
                                      {notice.notice_categories.name}
                                    </Badge>
                                  )}
                                </div>
                                <h3 className="font-semibold text-foreground mb-2 line-clamp-2 hover:text-primary transition-colors">
                                  {notice.title}
                                </h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {notice.description}
                                </p>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-2 flex-shrink-0">
                                {notice.attachments && notice.attachments.length > 0 && (
                                  <Button variant="outline" size="icon" className="h-9 w-9">
                                    <Download className="w-4 h-4" />
                                  </Button>
                                )}
                                <div className="w-9 h-9 rounded-lg bg-gold/20 text-gold flex items-center justify-center">
                                  <ChevronRight className="w-5 h-5" />
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className="w-9"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default NoticesPage;
