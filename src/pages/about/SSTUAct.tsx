import { MainLayout } from '@/components/layout/MainLayout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SSTUAct = () => {
  const { data: settings } = useQuery({
    queryKey: ['site-settings-about-act'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'about_act')
        .maybeSingle();
      
      if (error) throw error;
      return data?.setting_value as { 
        description?: string; 
        pdf_url?: string;
        content?: string;
      } | null;
    },
  });

  const defaultDescription = `The Sunamgonj Science and Technology University Act establishes the legal framework for the governance and operation of the university. This act was passed by the National Parliament of Bangladesh to establish SSTU as a public university.`;

  const defaultContent = `The Sunamgonj Science and Technology University Act, 2020 provides the legal foundation for:

• Establishment and recognition of the university
• Powers and functions of the university
• Constitution of the university bodies
• Academic council and its functions
• Board of governors and their responsibilities
• Financial management and auditing
• Statutes, ordinances, and regulations
• Appointment of officers and staff
• Student admission and discipline
• Degree conferral and academic recognition

The Act ensures that SSTU operates as an autonomous institution of higher learning with the mandate to provide quality education in science and technology fields.`;

  const description = settings?.description || defaultDescription;
  const content = settings?.content || defaultContent;
  const pdfUrl = settings?.pdf_url;

  return (
    <MainLayout>
      <section className="bg-primary text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            SSTU Act
          </h1>
          <p className="text-white/80 text-lg max-w-2xl">
            The legal framework governing Sunamgonj Science and Technology University
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card border rounded-xl p-8 mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold">
                    Sunamgonj Science and Technology University Act, 2020
                  </h2>
                  <p className="text-muted-foreground">Official Government Document</p>
                </div>
              </div>

              <p className="text-muted-foreground mb-6">{description}</p>

              {pdfUrl && (
                <div className="flex gap-4">
                  <Button asChild>
                    <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Online
                    </a>
                  </Button>
                </div>
              )}
            </div>

            <div className="prose prose-lg max-w-none">
              <h3 className="font-display text-xl font-bold mb-4">Key Provisions</h3>
              <div className="text-muted-foreground whitespace-pre-line">
                {content}
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default SSTUAct;
