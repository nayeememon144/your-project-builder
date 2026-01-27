import { MainLayout } from '@/components/layout/MainLayout';
import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, Calendar, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

const programs = [
  {
    title: 'Undergraduate Programs',
    description: 'Bachelor degree programs across various disciplines',
    icon: GraduationCap,
    href: '/academic/undergraduate',
  },
  {
    title: 'Postgraduate Programs',
    description: 'Master and PhD programs for advanced studies',
    icon: BookOpen,
    href: '/academic/postgraduate',
  },
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

const Academic = () => {
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
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {programs.map((program, idx) => (
              <Link key={idx} to={program.href}>
                <div className="bg-card rounded-xl p-8 border hover:shadow-lg transition-all group">
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <program.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {program.title}
                  </h3>
                  <p className="text-muted-foreground">{program.description}</p>
                </div>
              </Link>
            ))}
          </div>

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
