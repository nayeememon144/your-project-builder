import { MainLayout } from '@/components/layout/MainLayout';
import { Building2, Target, Eye, Award, Users, BookOpen, GraduationCap, Briefcase } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const About = () => {
  // Fetch quick_stats from database (admin-editable values)
  const { data: quickStats } = useQuery({
    queryKey: ['quick-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quick_stats')
        .select('*')
        .eq('is_active', true);
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch dynamic stats from database
  const { data: dynamicStats } = useQuery({
    queryKey: ['public-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_public_stats');
      if (error) throw error;
      return data as {
        faculties: number;
        departments: number;
        teachers: number;
        students: number;
      };
    },
  });

  // Helper to get stat value: prefer quick_stats, then fallback to dynamic
  const getQuickStatValue = (label: string, dynamicValue: number) => {
    const quickStat = quickStats?.find(s => 
      s.label.toLowerCase() === label.toLowerCase()
    );
    return quickStat?.value ?? dynamicValue;
  };

  const stats = [
    { icon: GraduationCap, value: getQuickStatValue('Students', dynamicStats?.students || 0), label: 'Students' },
    { icon: BookOpen, value: dynamicStats?.departments || 0, label: 'Departments' },
    { icon: Building2, value: dynamicStats?.faculties || 0, label: 'Faculties' },
    { icon: Users, value: dynamicStats?.teachers || 0, label: 'Teachers' },
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-primary text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            About SSTU
          </h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Sunamgonj Science and Technology University - A center of excellence in higher education
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="font-display text-3xl font-bold text-foreground mb-6">
                Our History
              </h2>
              <p className="text-muted-foreground mb-4">
                Sunamgonj Science and Technology University (SSTU) was established in 2020 
                with the vision of becoming a leading institution in science and technology 
                education in Bangladesh.
              </p>
              <p className="text-muted-foreground">
                Located in the beautiful district of Sunamgonj, the university is committed 
                to providing quality education and fostering research and innovation.
              </p>
            </div>
            <div className="bg-muted rounded-xl p-8">
              <img 
                src="https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80" 
                alt="SSTU Campus" 
                className="rounded-lg w-full"
              />
            </div>
          </div>

          {/* Vision & Mission */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-card rounded-xl p-8 border">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-muted-foreground">
                To become a world-class university that produces skilled graduates, 
                conducts cutting-edge research, and contributes to the socio-economic 
                development of Bangladesh.
              </p>
            </div>
            <div className="bg-card rounded-xl p-8 border">
              <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-gold" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-muted-foreground">
                To provide quality education, promote research and innovation, 
                develop skilled human resources, and serve the community through 
                knowledge dissemination and outreach programs.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center p-6 bg-muted/50 rounded-xl">
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                <div className="font-display text-3xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default About;
