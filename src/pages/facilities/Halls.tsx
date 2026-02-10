import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Wifi, UtensilsCrossed, ShieldCheck, Users, Phone, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Halls = () => {
  const { data: halls, isLoading } = useQuery({
    queryKey: ['halls-public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('facilities')
        .select('*')
        .eq('category', 'hall')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const amenities = [
    { icon: Wifi, label: 'High-Speed Wi-Fi' },
    { icon: UtensilsCrossed, label: 'Dining Facilities' },
    { icon: ShieldCheck, label: '24/7 Security' },
    { icon: Users, label: 'Common Rooms' },
  ];

  return (
    <MainLayout>
      <div className="bg-gradient-to-br from-primary/5 to-secondary py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-primary mb-4">
              Halls of Residence
            </h1>
            <p className="text-lg text-muted-foreground">
              Comfortable and secure residential facilities for students at SSTU
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* About Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-primary">About Residential Facilities</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <p>
                SSTU provides well-maintained residential halls for both male and female students. 
                Our halls offer a conducive environment for academic excellence while ensuring 
                students' comfort and safety throughout their stay.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Amenities */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">Common Amenities</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {amenities.map((amenity, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <amenity.icon className="w-10 h-10 text-primary mx-auto mb-3" />
                  <p className="font-medium">{amenity.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Halls List */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Our Halls</h2>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : halls && halls.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {halls.map((hall) => (
                <Card key={hall.id} className="hover:shadow-lg transition-shadow">
                  {hall.featured_image && (
                    <div className="h-48 overflow-hidden rounded-t-lg">
                      <img src={hall.featured_image} alt={hall.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <CardHeader className={!hall.featured_image ? "bg-primary/5" : ""}>
                    <div className="flex items-center gap-3">
                      <Building2 className="w-8 h-8 text-primary flex-shrink-0" />
                      <div>
                        <CardTitle className="text-lg">{hall.name}</CardTitle>
                        {hall.name_bn && <p className="text-sm text-muted-foreground">{hall.name_bn}</p>}
                        {hall.short_name && <p className="text-xs text-muted-foreground">{hall.short_name}</p>}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    {hall.description && (
                      <p className="text-sm text-muted-foreground mb-3">{hall.description}</p>
                    )}
                    {hall.location && (
                      <p className="text-sm mb-1"><span className="font-medium">Location:</span> {hall.location}</p>
                    )}
                    {hall.operating_hours && (
                      <p className="text-sm mb-1"><span className="font-medium">Hours:</span> {hall.operating_hours}</p>
                    )}
                    {hall.contact_phone && (
                      <p className="text-sm mb-1"><span className="font-medium">Phone:</span> {hall.contact_phone}</p>
                    )}
                    {hall.contact_email && (
                      <p className="text-sm"><span className="font-medium">Email:</span> {hall.contact_email}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No halls information available at the moment.</p>
          )}
        </div>

        {/* Contact */}
        <div className="max-w-4xl mx-auto mt-12">
          <Card className="bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <span>For hall admission inquiries, contact the Provost Office: +880-831-52012</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Halls;
