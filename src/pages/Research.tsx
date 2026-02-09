import { MainLayout } from '@/components/layout/MainLayout';
import { Link } from 'react-router-dom';
import { FileText, Lightbulb, Globe, Users, BookOpen, Loader2, ExternalLink } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

function Research() {
  // Fetch published research papers
  const { data: papers, isLoading: papersLoading } = useQuery({
    queryKey: ['research-papers-public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('research_papers')
        .select(`
          *,
          department:departments(name, short_name)
        `)
        .eq('status', 'published')
        .order('publication_date', { ascending: false })
        .limit(10);
      if (error) throw error;
      return data;
    },
  });

  // Fetch stats from the database
  const { data: stats } = useQuery({
    queryKey: ['research-stats'],
    queryFn: async () => {
      const [papersCount, departmentsCount] = await Promise.all([
        supabase
          .from('research_papers')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'published'),
        supabase
          .from('departments')
          .select('id', { count: 'exact', head: true })
          .eq('is_active', true),
      ]);
      
      return {
        publications: papersCount.count || 0,
        departments: departmentsCount.count || 0,
      };
    },
  });

  const researchAreas = [
    { icon: FileText, title: 'Publications', href: '/research/publications', count: stats?.publications ? `${stats.publications}+` : '0' },
    { icon: Lightbulb, title: 'Research Areas', href: '/research/areas', count: `${stats?.departments || 0}+` },
    { icon: Globe, title: 'Partnerships', href: '/research/partnership', count: '10+' },
    { icon: Users, title: 'Research Centers', href: '/centers/research', count: '3' },
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Research & Innovation
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl">
            Advancing knowledge through cutting-edge research and scholarly activities
          </p>
        </div>
      </section>

      {/* Research Stats */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {researchAreas.map((area, idx) => (
              <Link key={idx} to={area.href}>
                <div className="bg-card rounded-xl p-6 border hover:shadow-lg transition-all group text-center">
                  <area.icon className="w-10 h-10 mx-auto mb-4 text-primary" />
                  <div className="font-display text-3xl font-bold text-primary mb-2">
                    {area.count}
                  </div>
                  <h3 className="font-semibold">{area.title}</h3>
                </div>
              </Link>
            ))}
          </div>

          {/* Recent Publications */}
          <div className="bg-muted/50 rounded-2xl p-8 md:p-12">
            <h2 className="font-display text-2xl font-bold mb-8 flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-primary" />
              Recent Publications
            </h2>
            
            {papersLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : papers && papers.length > 0 ? (
              <div className="space-y-6">
                {papers.map((paper) => (
                  <div key={paper.id} className="bg-card rounded-lg p-6 border hover:shadow-md transition-shadow">
                    <div className="flex flex-wrap items-start gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {paper.publication_type === 'journal' ? 'Journal Article' : 
                         paper.publication_type === 'conference' ? 'Conference Paper' :
                         paper.publication_type === 'book_chapter' ? 'Book Chapter' :
                         paper.publication_type === 'patent' ? 'Patent' : 'Publication'}
                      </Badge>
                      {paper.department && (
                        <Badge variant="outline" className="text-xs">
                          {paper.department.short_name || paper.department.name}
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{paper.title}</h3>
                    <p className="text-muted-foreground text-sm mb-2">
                      {paper.authors?.join(', ')}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      {paper.journal_conference_name && (
                        <span className="text-primary font-medium">{paper.journal_conference_name}</span>
                      )}
                      {paper.publication_date && (
                        <span className="text-muted-foreground">
                          • {format(new Date(paper.publication_date), 'yyyy')}
                        </span>
                      )}
                      {paper.volume && (
                        <span className="text-muted-foreground">• Vol. {paper.volume}</span>
                      )}
                      {paper.issue && (
                        <span className="text-muted-foreground">({paper.issue})</span>
                      )}
                    </div>
                    
                    {/* Links */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {paper.doi_link && (
                        <a 
                          href={paper.doi_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                        >
                          DOI <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {paper.google_scholar_link && (
                        <a 
                          href={paper.google_scholar_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                        >
                          Google Scholar <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {paper.researchgate_link && (
                        <a 
                          href={paper.researchgate_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                        >
                          ResearchGate <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {paper.pdf_url && (
                        <a 
                          href={paper.pdf_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                        >
                          PDF <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No publications available yet.</p>
                <p className="text-sm mt-1">Research papers will appear here once published.</p>
              </div>
            )}
            
            {papers && papers.length > 0 && (
              <div className="text-center mt-8">
                <Link to="/research/publications" className="text-primary hover:underline font-medium">
                  View All Publications →
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default Research;
