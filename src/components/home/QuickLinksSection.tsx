import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  FileText, 
  CalendarDays, 
  HelpCircle,
  Users,
  BookOpen,
  Building2,
  Mail
} from 'lucide-react';

const quickLinks = [
  { icon: GraduationCap, label: 'Admission', href: '/admission', color: 'bg-blue-500' },
  { icon: FileText, label: 'Notices', href: '/notices', color: 'bg-green-500' },
  { icon: CalendarDays, label: 'Calendar', href: '/academic/calendar', color: 'bg-orange-500' },
  { icon: Users, label: 'Faculty', href: '/faculty', color: 'bg-purple-500' },
  { icon: BookOpen, label: 'Programs', href: '/academic', color: 'bg-pink-500' },
  { icon: Building2, label: 'Departments', href: '/departments', color: 'bg-cyan-500' },
  { icon: HelpCircle, label: 'FAQ', href: '/faq', color: 'bg-amber-500' },
  { icon: Mail, label: 'Contact', href: '/contact', color: 'bg-red-500' },
];

export const QuickLinksSection = () => {
  return (
    <section className="py-12 bg-primary">
      <div className="container mx-auto">
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {quickLinks.map((link, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <Link
                to={link.href}
                className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-white/10 transition-colors group"
              >
                <div className={`w-12 h-12 rounded-full ${link.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <link.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-white/90 text-center font-medium">
                  {link.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
