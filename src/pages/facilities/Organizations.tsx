import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Music, Palette, Megaphone, BookOpen, Heart, Globe, Camera } from 'lucide-react';

const Organizations = () => {
  const organizations = [
    {
      icon: BookOpen,
      name: 'SSTU Debating Club',
      description: 'Fostering critical thinking and public speaking skills through debates and discussions.',
      members: '50+',
    },
    {
      icon: Music,
      name: 'SSTU Cultural Club',
      description: 'Promoting arts, music, and cultural activities among students.',
      members: '80+',
    },
    {
      icon: Palette,
      name: 'Fine Arts Society',
      description: 'Platform for visual artists, painters, and creative enthusiasts.',
      members: '35+',
    },
    {
      icon: Camera,
      name: 'Photography Club',
      description: 'Capturing moments and teaching photography skills to interested students.',
      members: '40+',
    },
    {
      icon: Globe,
      name: 'SSTU IT Club',
      description: 'Organizing tech events, workshops, and programming competitions.',
      members: '100+',
    },
    {
      icon: Heart,
      name: 'Social Welfare Society',
      description: 'Conducting blood donation camps, charity events, and community service.',
      members: '60+',
    },
    {
      icon: Megaphone,
      name: 'Career Club',
      description: 'Helping students with career guidance, CV workshops, and job preparations.',
      members: '70+',
    },
    {
      icon: Users,
      name: 'Sports Club',
      description: 'Organizing inter-department tournaments and sports activities.',
      members: '90+',
    },
  ];

  return (
    <MainLayout>
      <div className="bg-gradient-to-br from-primary/5 to-secondary py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-primary mb-4">
              Student Organizations
            </h1>
            <p className="text-lg text-muted-foreground">
              Join clubs and societies to develop skills, make friends, and enrich your university experience
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* About Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Student Life at SSTU</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <p>
                SSTU encourages students to participate in various clubs and organizations 
                that complement their academic pursuits. These organizations provide opportunities 
                for leadership development, skill enhancement, and networking with peers who share 
                similar interests.
              </p>
              <p>
                All registered students are eligible to join these organizations. Each club holds 
                regular meetings, events, and annual programs under the supervision of faculty advisors.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Organizations Grid */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Active Organizations</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {organizations.map((org, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow group">
                <CardContent className="p-6 text-center">
                  <div className="p-4 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <org.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{org.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{org.description}</p>
                  <span className="inline-block px-3 py-1 bg-secondary text-xs font-medium rounded-full">
                    {org.members} members
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How to Join */}
        <div className="max-w-4xl mx-auto mt-12">
          <Card className="bg-primary/5">
            <CardHeader>
              <CardTitle className="text-xl">How to Join?</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Visit the DSW office or the respective club's booth during orientation week</li>
                <li>Fill out the membership form with your details</li>
                <li>Pay the nominal membership fee (if applicable)</li>
                <li>Attend the introductory meeting and start participating in activities</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Organizations;
