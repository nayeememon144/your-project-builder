import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  FileEdit, 
  Bell, 
  CalendarDays, 
  Library 
} from 'lucide-react';

const quickIcons = [
  { icon: GraduationCap, label: 'Student Portal', href: '/student/login' },
  { icon: FileEdit, label: 'Exam', href: '/notices?category=exam' },
  { icon: Bell, label: 'Notice', href: '/notices' },
  { icon: CalendarDays, label: 'Academic Calendar', href: '/academic/calendar' },
  { icon: Library, label: 'Library', href: '/facilities/library' },
];

export const QuickIconsBar = () => {
  return (
    <section className="bg-white py-4 shadow-md relative z-10">
      <div className="container mx-auto">
        <div className="flex justify-center gap-8 md:gap-16">
          {quickIcons.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
            >
              <Link
                to={item.href}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <item.icon className="w-6 h-6 md:w-7 md:h-7 text-gray-600 group-hover:text-white transition-colors" />
                </div>
                <span className="text-xs md:text-sm text-gray-600 group-hover:text-primary font-medium transition-colors text-center">
                  {item.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
