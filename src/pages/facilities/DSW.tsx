import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, Award, HeartHandshake, Phone, Mail, MapPin } from 'lucide-react';

const DSW = () => {
  const services = [
    {
      icon: Award,
      title: 'Scholarships & Financial Aid',
      description: 'Various scholarship programs for meritorious and underprivileged students.',
    },
    {
      icon: HeartHandshake,
      title: 'Counseling Services',
      description: 'Professional counseling support for academic and personal issues.',
    },
    {
      icon: Users,
      title: 'Student Clubs & Organizations',
      description: 'Support and guidance for student-led clubs and organizations.',
    },
    {
      icon: FileText,
      title: 'Character Certificate',
      description: 'Issuance of character and conduct certificates for students.',
    },
  ];

  return (
    <MainLayout>
      <div className="bg-gradient-to-br from-primary/5 to-secondary py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-primary mb-4">
              Directorate of Students' Welfare (DSW)
            </h1>
            <p className="text-lg text-muted-foreground">
              Dedicated to supporting student well-being, activities, and overall development at SSTU
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* About Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-primary">About DSW</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <p>
                The Directorate of Students' Welfare (DSW) at Sunamgonj Science and Technology University 
                is committed to enhancing the overall student experience by providing comprehensive support 
                services, organizing co-curricular activities, and ensuring student welfare throughout their 
                academic journey.
              </p>
              <p>
                DSW serves as the primary liaison between students and the university administration, 
                addressing student concerns and facilitating their personal and professional growth.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Services Grid */}
        <div className="max-w-6xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">Our Services</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <service.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                      <p className="text-muted-foreground">{service.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-primary/5">
            <CardHeader>
              <CardTitle className="text-xl">Contact DSW Office</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <span>+880-831-52012</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <span>dsw@sstu.ac.bd</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>Admin Building, Room 105</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default DSW;
