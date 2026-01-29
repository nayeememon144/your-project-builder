import { MainLayout } from '@/components/layout/MainLayout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Organogram = () => {
  const { data: settings } = useQuery({
    queryKey: ['site-settings-about-organogram'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'about_organogram')
        .maybeSingle();
      
      if (error) throw error;
      return data?.setting_value as { 
        description?: string; 
        image_url?: string;
        pdf_url?: string;
      } | null;
    },
  });

  const defaultDescription = `The organizational structure of Sunamgonj Science and Technology University illustrates the administrative hierarchy and functional relationships between various offices, departments, and bodies within the institution.`;

  const description = settings?.description || defaultDescription;
  const imageUrl = settings?.image_url || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80';
  const pdfUrl = settings?.pdf_url;

  return (
    <MainLayout>
      <section className="bg-primary text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            SSTU Organogram
          </h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Administrative structure and organizational hierarchy
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <p className="text-muted-foreground mb-8 text-center text-lg">{description}</p>

            <div className="bg-card border rounded-xl p-4 mb-8">
              <img 
                src={imageUrl} 
                alt="SSTU Organogram" 
                className="w-full h-auto rounded-lg"
              />
            </div>

            {pdfUrl && (
              <div className="text-center">
                <Button asChild size="lg">
                  <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                    <Download className="w-4 h-4 mr-2" />
                    Download Organogram PDF
                  </a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Organogram;
