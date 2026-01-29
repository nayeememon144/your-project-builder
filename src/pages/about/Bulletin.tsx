import { MainLayout } from '@/components/layout/MainLayout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Download, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Bulletin = () => {
  const { data: settings } = useQuery({
    queryKey: ['site-settings-about-bulletin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'about_bulletin')
        .maybeSingle();
      
      if (error) throw error;
      return data?.setting_value as { 
        description?: string; 
        bulletins?: Array<{
          title: string;
          year: string;
          pdf_url: string;
          description?: string;
        }>;
      } | null;
    },
  });

  const defaultDescription = `The SSTU Bulletin contains comprehensive information about the university's academic programs, policies, regulations, and guidelines. It serves as an official reference document for students, faculty, and staff.`;

  const defaultBulletins = [
    {
      title: 'SSTU Bulletin 2024-2025',
      year: '2024',
      pdf_url: '',
      description: 'Latest academic bulletin with updated programs and policies'
    },
    {
      title: 'SSTU Bulletin 2023-2024',
      year: '2023',
      pdf_url: '',
      description: 'Academic bulletin for the 2023-2024 session'
    },
  ];

  const description = settings?.description || defaultDescription;
  const bulletins = settings?.bulletins || defaultBulletins;

  return (
    <MainLayout>
      <section className="bg-primary text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            SSTU Bulletin
          </h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Official academic publications and reference documents
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-muted-foreground mb-12 text-center text-lg">{description}</p>

            <div className="space-y-6">
              {bulletins.map((bulletin, idx) => (
                <div key={idx} className="bg-card border rounded-xl p-6 flex items-center gap-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-xl font-bold mb-1">{bulletin.title}</h3>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>Academic Year: {bulletin.year}</span>
                    </div>
                    {bulletin.description && (
                      <p className="text-muted-foreground text-sm">{bulletin.description}</p>
                    )}
                  </div>
                  {bulletin.pdf_url ? (
                    <Button asChild>
                      <a href={bulletin.pdf_url} target="_blank" rel="noopener noreferrer">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </a>
                    </Button>
                  ) : (
                    <Button variant="outline" disabled>
                      Coming Soon
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Bulletin;
