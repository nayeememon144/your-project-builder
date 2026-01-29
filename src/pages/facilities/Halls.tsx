import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, Wifi, UtensilsCrossed, ShieldCheck, Phone } from 'lucide-react';

const Halls = () => {
  const halls = [
    {
      name: 'Shaheed Minar Hall',
      type: 'Male',
      capacity: 200,
      facilities: ['Wi-Fi', 'Reading Room', 'Common Room', 'Dining Hall'],
    },
    {
      name: 'Begum Rokeya Hall',
      type: 'Female',
      capacity: 150,
      facilities: ['Wi-Fi', 'Reading Room', 'Common Room', 'Dining Hall', 'Guest Room'],
    },
    {
      name: 'Bangabandhu Hall',
      type: 'Male',
      capacity: 250,
      facilities: ['Wi-Fi', 'Reading Room', 'Common Room', 'Dining Hall', 'Sports Facilities'],
    },
  ];

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
              <p>
                Each hall is equipped with modern amenities including high-speed internet, 
                reading rooms, common areas, and dining facilities managed by dedicated staff.
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
          <div className="grid md:grid-cols-3 gap-6">
            {halls.map((hall, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="bg-primary/5">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-8 h-8 text-primary" />
                    <div>
                      <CardTitle className="text-lg">{hall.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{hall.type} Hall</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-primary">{hall.capacity}</span>
                    <span className="text-muted-foreground ml-2">seats</span>
                  </div>
                  <div>
                    <p className="font-medium mb-2">Facilities:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {hall.facilities.map((facility, idx) => (
                        <li key={idx}>• {facility}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
