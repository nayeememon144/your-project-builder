import { MainLayout } from '@/components/layout/MainLayout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MapPin, Navigation, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CampusMap = () => {
  const { data: settings } = useQuery({
    queryKey: ['site-settings-about-campus-map'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'about_campus_map')
        .maybeSingle();
      
      if (error) throw error;
      return data?.setting_value as { 
        description?: string; 
        map_embed_url?: string;
        campus_map_image?: string;
        campus_map_pdf?: string;
        google_maps_url?: string;
        latitude?: number;
        longitude?: number;
      } | null;
    },
  });

  const defaultDescription = `Sunamgonj Science and Technology University is located in Shantiganj, Sunamganj, Bangladesh. The campus is situated alongside the Chittagong-Sylhet Highway, about 25km away from the Sylhet city, offering a serene environment conducive to learning and research.`;

  const description = settings?.description || defaultDescription;
  const mapEmbedUrl = settings?.map_embed_url || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3614.847374583!2d91.39!3d25.06!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSunamganj%20Science%20and%20Technology%20University!5e0!3m2!1sen!2sbd!4v1234567890';
  const campusMapImage = settings?.campus_map_image;
  const campusMapPdf = settings?.campus_map_pdf;
  const googleMapsUrl = settings?.google_maps_url || 'https://goo.gl/maps/sunamganj-sstu';

  return (
    <MainLayout>
      <section className="bg-primary text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Campus Map
          </h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Navigate the SSTU campus and find your way around
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{description}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-card border rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Address</h3>
                <p className="text-muted-foreground text-sm">
                  Shantiganj 3000, Sunamganj, Bangladesh
                </p>
              </div>
              <div className="bg-card border rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Navigation className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Distance from Sylhet</h3>
                <p className="text-muted-foreground text-sm">
                  Approximately 25 km via Chittagong-Sylhet Highway
                </p>
              </div>
              <div className="bg-card border rounded-xl p-6 text-center">
                <Button asChild className="w-full">
                  <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                    <Navigation className="w-4 h-4 mr-2" />
                    Get Directions
                  </a>
                </Button>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="bg-card border rounded-xl overflow-hidden mb-8">
              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="SSTU Location Map"
              />
            </div>

            {/* Campus Layout Map */}
            {campusMapImage && (
              <div className="mb-8">
                <h2 className="font-display text-2xl font-bold mb-4 text-center">Campus Layout</h2>
                <div className="bg-card border rounded-xl p-4">
                  <img 
                    src={campusMapImage} 
                    alt="SSTU Campus Layout" 
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              </div>
            )}

            {campusMapPdf && (
              <div className="text-center">
                <Button asChild size="lg">
                  <a href={campusMapPdf} target="_blank" rel="noopener noreferrer">
                    <Download className="w-4 h-4 mr-2" />
                    Download Campus Map PDF
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

export default CampusMap;
