import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  FileEdit, 
  Bell, 
  CalendarDays, 
  Library,
  BookOpen,
  Users,
  Newspaper
} from 'lucide-react';

const quickIcons = [
  { icon: GraduationCap, label: 'Student Portal', href: '/student/login' },
  { icon: FileEdit, label: 'Exam', href: '/notices?category=exam' },
  { icon: Bell, label: 'Notices', href: '/notices' },
  { icon: CalendarDays, label: 'Calendar', href: '/academic/calendar' },
  { icon: Library, label: 'Library', href: '/facilities/library' },
  { icon: BookOpen, label: 'Teacher Portal', href: '/teacher/login' },
  { icon: Users, label: 'Faculty', href: '/teachers' },
  { icon: Newspaper, label: 'News', href: '/events' },
];

export const QuickIconsBar = () => {
  return (
    <section className="bg-card py-4 shadow-md relative z-10 border-b border-border">
      <div className="container mx-auto px-4">
        {/* Mobile: horizontal scroll, Desktop: centered flex */}
        <div className="flex gap-4 md:gap-8 lg:gap-12 overflow-x-auto lg:justify-center scrollbar-none pb-1 -mx-1 px-1">
          {quickIcons.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="flex-shrink-0"
            >
              <Link
                to={item.href}
                className="flex flex-col items-center gap-1.5 group min-w-[60px]"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary group-active:scale-95 group-hover:scale-110 transition-all duration-300 shadow-sm">
                  <item.icon className="w-5 h-5 md:w-6 md:h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <span className="text-[10px] md:text-xs text-muted-foreground group-hover:text-primary font-medium transition-colors text-center leading-tight">
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
