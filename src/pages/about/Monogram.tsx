import { MainLayout } from '@/components/layout/MainLayout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Download, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import sstuLogo from '@/assets/sstu-logo.png';

const Monogram = () => {
  const { data: settings } = useQuery({
    queryKey: ['site-settings-about-monogram'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'about_monogram')
        .maybeSingle();
      
      if (error) throw error;
      return data?.setting_value as { 
        description?: string; 
        logo_meaning?: string;
        color_codes?: Array<{ name: string; hex: string; meaning?: string }>;
        download_urls?: {
          png?: string;
          svg?: string;
          pdf?: string;
        };
      } | null;
    },
  });

  const defaultDescription = `The monogram of Sunamgonj Science and Technology University represents the institution's identity, values, and commitment to excellence in education and research. The design incorporates elements that symbolize knowledge, progress, and the natural beauty of the Sunamganj region.`;

  const defaultLogoMeaning = `The SSTU monogram embodies the university's vision and mission:

• The circular design represents unity and completeness of knowledge
• The central emblem symbolizes the pursuit of science and technology
• The traditional elements reflect the rich cultural heritage of Sunamganj
• The color palette represents growth, wisdom, and academic excellence`;

  const defaultColorCodes = [
    { name: 'SSTU Green', hex: '#2D5A3D', meaning: 'Growth, nature, and sustainability' },
    { name: 'Gold', hex: '#D4AF37', meaning: 'Excellence, achievement, and prestige' },
    { name: 'White', hex: '#FFFFFF', meaning: 'Purity, clarity, and truth' },
  ];

  const description = settings?.description || defaultDescription;
  const logoMeaning = settings?.logo_meaning || defaultLogoMeaning;
  const colorCodes = settings?.color_codes || defaultColorCodes;
  const downloadUrls = settings?.download_urls;

  return (
    <MainLayout>
      <section className="bg-primary text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            SSTU Monogram
          </h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Official logo and visual identity of the university
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div className="bg-muted/50 rounded-xl p-12 flex items-center justify-center">
                <img 
                  src={sstuLogo} 
                  alt="SSTU Monogram" 
                  className="w-64 h-64 object-contain"
                />
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold mb-4">About the Monogram</h2>
                <p className="text-muted-foreground mb-6">{description}</p>
                
                {downloadUrls && (
                  <div className="flex flex-wrap gap-3">
                    {downloadUrls.png && (
                      <Button asChild variant="outline" size="sm">
                        <a href={downloadUrls.png} download>
                          <Download className="w-4 h-4 mr-2" />
                          PNG
                        </a>
                      </Button>
                    )}
                    {downloadUrls.svg && (
                      <Button asChild variant="outline" size="sm">
                        <a href={downloadUrls.svg} download>
                          <Download className="w-4 h-4 mr-2" />
                          SVG
                        </a>
                      </Button>
                    )}
                    {downloadUrls.pdf && (
                      <Button asChild variant="outline" size="sm">
                        <a href={downloadUrls.pdf} download>
                          <Download className="w-4 h-4 mr-2" />
                          PDF
                        </a>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-16">
              <h2 className="font-display text-2xl font-bold mb-4">Symbolism & Meaning</h2>
              <div className="text-muted-foreground whitespace-pre-line">{logoMeaning}</div>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">
                <Palette className="w-6 h-6" />
                Official Color Palette
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {colorCodes.map((color, idx) => (
                  <div key={idx} className="bg-card border rounded-xl overflow-hidden">
                    <div 
                      className="h-24 w-full" 
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="p-4">
                      <h3 className="font-semibold mb-1">{color.name}</h3>
                      <p className="text-sm text-muted-foreground font-mono mb-2">{color.hex}</p>
                      {color.meaning && (
                        <p className="text-sm text-muted-foreground">{color.meaning}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Monogram;
