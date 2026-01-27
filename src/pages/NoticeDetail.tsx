import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Download, 
  ArrowLeft,
  Pin,
  Eye,
  Share2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface NoticeDetail {
  id: string;
  title: string;
  title_bn: string | null;
  description: string;
  description_bn: string | null;
  published_at: string;
  is_pinned: boolean;
  is_featured: boolean;
  attachments: any;
  views: number;
  notice_categories: {
    name: string;
    slug: string;
  } | null;
}

const NoticeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [notice, setNotice] = useState<NoticeDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchNotice();
    }
  }, [id]);

  const fetchNotice = async () => {
    setLoading(true);
    
    const { data, error } = await supabase
      .from('notices')
      .select(`
        id,
        title,
        title_bn,
        description,
        description_bn,
        published_at,
        is_pinned,
        is_featured,
        attachments,
        views,
        notice_categories (name, slug)
      `)
      .eq('id', id)
      .eq('status', 'published')
      .maybeSingle();

    if (!error && data) {
      setNotice(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading notice...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!notice) {
    return (
      <MainLayout>
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Notice Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The notice you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/notices">
              <Button>Back to Notices</Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Page Header */}
      <section className="bg-primary py-8">
        <div className="container mx-auto">
          <Link to="/notices" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Notices
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {notice.is_pinned && (
              <Badge className="bg-gold text-primary">
                <Pin className="w-3 h-3 mr-1" />
                Pinned
              </Badge>
            )}
            {notice.notice_categories && (
              <Badge variant="secondary" className="bg-white/20 text-white">
                {notice.notice_categories.name}
              </Badge>
            )}
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-white">
            {notice.title}
          </h1>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-8">
                  {notice.title_bn && (
                    <h2 className="text-xl font-semibold text-foreground mb-6 pb-4 border-b border-border">
                      {notice.title_bn}
                    </h2>
                  )}
                  
                  <div className="prose prose-lg max-w-none">
                    <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                      {notice.description}
                    </p>
                    
                    {notice.description_bn && (
                      <div className="mt-6 pt-6 border-t border-border">
                        <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                          {notice.description_bn}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6 space-y-6">
                  {/* Meta Info */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-4">Notice Details</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Published:</span>
                        <span className="text-foreground font-medium">
                          {format(new Date(notice.published_at), 'MMMM dd, yyyy')}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Eye className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Views:</span>
                        <span className="text-foreground font-medium">
                          {notice.views || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Attachments */}
                  {notice.attachments && notice.attachments.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-foreground mb-4">Attachments</h3>
                      <div className="space-y-2">
                        {notice.attachments.map((attachment: any, idx: number) => (
                          <a
                            key={idx}
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
                          >
                            <Download className="w-4 h-4 text-primary" />
                            <span className="text-sm text-foreground truncate">
                              {attachment.name || `Attachment ${idx + 1}`}
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-4 border-t border-border">
                    <Button variant="outline" className="w-full gap-2">
                      <Share2 className="w-4 h-4" />
                      Share Notice
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default NoticeDetailPage;
