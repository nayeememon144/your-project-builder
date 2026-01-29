import { MainLayout } from '@/components/layout/MainLayout';
import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, Calendar, Globe, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

type Program = {
  id: string;
  name: string;
  degree_type: string;
  description: string | null;
};

// Static academic info items
const staticItems = [
  {
    title: 'Academic Calendar',
    description: 'Important dates, schedules, and academic events',
    icon: Calendar,
    href: '/academic/calendar',
  },
  {
    title: 'International Students',
    description: 'Information for international applicants',
    icon: Globe,
    href: '/academic/international',
  },
];

const getDegreeIcon = (degreeType: string) => {
  switch (degreeType) {
    case 'undergraduate':
      return GraduationCap;
    case 'postgraduate':
      return BookOpen;
    case 'doctoral':
      return BookOpen;
    default:
      return GraduationCap;
  }
};

const Academic = () => {
  const { data: programs = [], isLoading } = useQuery({
    queryKey: ['public-programs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('programs')
        .select('id, name, degree_type, description')
        .eq('is_active', true)
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data as Program[];
    },
  });

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-primary text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Academic Programs
          </h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Explore our diverse range of academic programs designed to prepare you for a successful career
          </p>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {/* Dynamic Programs from Database */}
              {programs.map((program) => {
                const Icon = getDegreeIcon(program.degree_type);
                return (
                  <Link key={program.id} to={`/programs/${program.id}`}>
                    <div className="bg-card rounded-xl p-8 border hover:shadow-lg transition-all group h-full">
                      <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="font-display text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                        {program.name}
                      </h3>
                      <p className="text-muted-foreground">
                        {program.description || `${program.degree_type.charAt(0).toUpperCase() + program.degree_type.slice(1)} program`}
                      </p>
                    </div>
                  </Link>
                );
              })}

              {/* Static Items */}
              {staticItems.map((item, idx) => (
                <Link key={idx} to={item.href}>
                  <div className="bg-card rounded-xl p-8 border hover:shadow-lg transition-all group h-full">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                      <item.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-display text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="bg-muted rounded-2xl p-8 md:p-12 text-center">
            <h2 className="font-display text-3xl font-bold mb-4">Ready to Apply?</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Start your journey at SSTU today. Check admission requirements and apply online.
            </p>
            <Link to="/admission">
              <Button className="bg-gold text-primary hover:bg-gold/90">
                Apply Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Academic;
