import { forwardRef } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Link } from 'react-router-dom';
import { FileText, Lightbulb, Globe, Users, BookOpen } from 'lucide-react';
const researchAreas = [
  { icon: FileText, title: 'Publications', href: '/research/publications', count: '500+' },
  { icon: Lightbulb, title: 'Research Areas', href: '/research/areas', count: '25+' },
  { icon: Globe, title: 'Partnerships', href: '/research/partnership', count: '30+' },
  { icon: Users, title: 'Research Centers', href: '/centers/research', count: '5' },
];

const recentPublications = [
  {
    title: 'Advances in Machine Learning for Agricultural Applications',
    authors: 'Dr. Rahman, Dr. Ahmed',
    journal: 'International Journal of AI',
    year: 2024,
  },
  {
    title: 'Sustainable Energy Solutions for Rural Bangladesh',
    authors: 'Dr. Karim, Dr. Islam',
    journal: 'Energy & Environment',
    year: 2024,
  },
  {
    title: 'Water Quality Assessment in Haor Region',
    authors: 'Dr. Hossain, Dr. Begum',
    journal: 'Environmental Science Journal',
    year: 2023,
  },
];

const Research = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <MainLayout>
      <div ref={ref}>
        {/* Hero Section */}
        <section className="bg-primary text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Research & Innovation
            </h1>
            <p className="text-white/80 text-lg max-w-2xl">
              Advancing knowledge through cutting-edge research and scholarly activities
            </p>
          </div>
        </section>

        {/* Research Stats */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-6 mb-16">
              {researchAreas.map((area, idx) => (
                <Link key={idx} to={area.href}>
                  <div className="bg-card rounded-xl p-6 border hover:shadow-lg transition-all group text-center">
                    <area.icon className="w-10 h-10 mx-auto mb-4 text-primary" />
                    <div className="font-display text-3xl font-bold text-primary mb-2">
                      {area.count}
                    </div>
                    <h3 className="font-semibold">{area.title}</h3>
                  </div>
                </Link>
              ))}
            </div>

            {/* Recent Publications */}
            <div className="bg-muted/50 rounded-2xl p-8 md:p-12">
              <h2 className="font-display text-2xl font-bold mb-8 flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-primary" />
                Recent Publications
              </h2>
              <div className="space-y-6">
                {recentPublications.map((pub, idx) => (
                  <div key={idx} className="bg-card rounded-lg p-6 border">
                    <h3 className="font-semibold text-lg mb-2">{pub.title}</h3>
                    <p className="text-muted-foreground text-sm mb-1">{pub.authors}</p>
                    <p className="text-sm">
                      <span className="text-primary">{pub.journal}</span> • {pub.year}
                    </p>
                  </div>
                ))}
              </div>
              <div className="text-center mt-8">
                <Link to="/research/publications" className="text-primary hover:underline font-medium">
                  View All Publications →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
});

Research.displayName = 'Research';

export default Research;
