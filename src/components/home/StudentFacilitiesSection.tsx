import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Library, Stethoscope, Bus, Users, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface Facility {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  color: string;
  bgColor: string;
}

const facilities: Facility[] = [
  {
    icon: Library,
    title: 'Library',
    description: 'Central library has excellent collection of about 3000 books of journals, conference proceedings and general books on science and technology.',
    href: '/facilities/library',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    icon: Stethoscope,
    title: 'Medical',
    description: 'The central medical center provides first-aid and primary healthcare services to all students, faculty members, and staff of the university.',
    href: '/facilities/medical',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    icon: Bus,
    title: 'Transport',
    description: 'University transport service is available for students and staff members for commuting between the campus and various locations.',
    href: '/facilities/transport',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
  {
    icon: Users,
    title: 'Alumni',
    description: 'Our alumni network connects graduates worldwide, fostering professional relationships and supporting current students through mentorship.',
    href: '/about/alumni',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
];

export const StudentFacilitiesSection = () => {
  return (
    <section className="py-16 bg-primary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10S0 14.5 0 20s4.5 10 10 10 10-4.5 10-10zm10 0c0 5.5 4.5 10 10 10s10-4.5 10-10-4.5-10-10-10-10 4.5-10 10z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-10">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">
            Student Facilities
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Comprehensive facilities designed to support student life and academic success on campus
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {facilities.map((facility, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <Link to={facility.href}>
                <Card className="h-full bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-colors group cursor-pointer">
                  <CardContent className="p-6">
                    <div className={`w-14 h-14 rounded-lg ${facility.bgColor} flex items-center justify-center mb-4`}>
                      <facility.icon className={`w-7 h-7 ${facility.color}`} />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-white mb-2">
                      {facility.title}
                    </h3>
                    <p className="text-white/70 text-sm leading-relaxed mb-4 line-clamp-3">
                      {facility.description}
                    </p>
                    <div className="flex items-center text-gold text-sm font-medium group-hover:translate-x-1 transition-transform">
                      Learn More
                      <ChevronRight className="w-4 h-4 ml-1" />
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
