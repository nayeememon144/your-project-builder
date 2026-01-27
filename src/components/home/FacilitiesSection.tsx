import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  FlaskConical, 
  Building, 
  Users, 
  Library, 
  Wifi,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const facilities = [
  {
    icon: Library,
    title: 'Central Library',
    description: 'State-of-the-art library with over 100,000 books and digital resources',
    link: '/facilities/library',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: FlaskConical,
    title: 'Research Labs',
    description: 'Advanced laboratories equipped with cutting-edge technology',
    link: '/facilities/labs',
    color: 'from-green-500 to-emerald-600',
  },
  {
    icon: Building,
    title: 'Hostels',
    description: 'Comfortable accommodation for students from across the country',
    link: '/facilities/hostels',
    color: 'from-orange-500 to-amber-600',
  },
  {
    icon: Wifi,
    title: 'Digital Campus',
    description: 'Campus-wide WiFi and smart classroom facilities',
    link: '/facilities/digital',
    color: 'from-purple-500 to-violet-600',
  },
  {
    icon: Users,
    title: 'Student Clubs',
    description: 'Active student organizations for holistic development',
    link: '/facilities/clubs',
    color: 'from-pink-500 to-rose-600',
  },
  {
    icon: BookOpen,
    title: 'E-Resources',
    description: 'Access to international journals and online learning platforms',
    link: '/facilities/e-resources',
    color: 'from-cyan-500 to-teal-600',
  },
];

export const FacilitiesSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Campus Facilities
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            World-class infrastructure designed to support academic excellence and student well-being
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((facility, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <Link to={facility.link}>
                <Card className="h-full card-hover group cursor-pointer border-2 border-transparent hover:border-accent/20">
                  <CardContent className="p-6">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${facility.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <facility.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                      {facility.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {facility.description}
                    </p>
                    <div className="flex items-center text-accent text-sm font-medium">
                      Learn More
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
