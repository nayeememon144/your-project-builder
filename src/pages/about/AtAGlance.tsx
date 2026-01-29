import { MainLayout } from '@/components/layout/MainLayout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Users, BookOpen, Building2, GraduationCap, Award, Briefcase } from 'lucide-react';

const AtAGlance = () => {
  const { data: settings } = useQuery({
    queryKey: ['site-settings-about-glance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'about_glance')
        .maybeSingle();
      
      if (error) throw error;
      return data?.setting_value as { 
        description?: string; 
        image?: string;
        stats?: Array<{ label: string; value: string; icon?: string }>;
      } | null;
    },
  });

  const { data: dbStats } = useQuery({
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

  const defaultDescription = `Sunamgonj Science and Technology University is a prominent institution of higher education located in the picturesque region of Sunamganj, Bangladesh. Nestled in the heart of the country, it offers a unique educational experience that harmonizes academic excellence with the breathtaking beauty of the surrounding haors.

The university is renowned for its commitment to providing quality higher education, fostering intellectual growth, and encouraging research and innovation. With a diverse range of academic programs, SSTU offers students the opportunity to pursue their passion and expand their knowledge in various fields.

Sunamgonj Science and Technology University (SSTU), established in 2020, currently has 4 departments and is continuously enhancing its research capabilities to contribute to national and international academic excellence.`;

  const description = settings?.description || defaultDescription;
  const image = settings?.image || 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80';

  const stats = [
    { icon: Building2, value: dbStats?.faculties?.toString() || '2', label: 'Faculties' },
    { icon: BookOpen, value: dbStats?.departments?.toString() || '4', label: 'Departments' },
    { icon: GraduationCap, value: dbStats?.students?.toString() || '320', label: 'Students' },
    { icon: Users, value: dbStats?.teachers?.toString() || '17', label: 'Teachers' },
    { icon: Award, value: '0', label: 'Graduates' },
    { icon: Briefcase, value: '27', label: 'Staffs' },
  ];

  return (
    <MainLayout>
      <section className="bg-primary text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            SSTU At a Glance
          </h1>
          <p className="text-white/80 text-lg max-w-2xl">
            A comprehensive overview of Sunamgonj Science and Technology University
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-start mb-16">
            <div>
              {description.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="text-muted-foreground mb-4 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="bg-muted rounded-xl overflow-hidden">
              <img 
                src={image} 
                alt="SSTU Campus" 
                className="w-full h-80 object-cover"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center p-6 bg-muted/50 rounded-xl border">
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

export default AtAGlance;
