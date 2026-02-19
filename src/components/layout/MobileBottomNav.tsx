import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Bell, GraduationCap, Users, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Bell, label: 'Notices', href: '/notices' },
  { icon: GraduationCap, label: 'Academic', href: '/academic' },
  { icon: Users, label: 'Directory', href: '/teachers' },
  { icon: User, label: 'Profile', href: '/student/login' },
];

export const MobileBottomNav = () => {
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-[0_-4px_20px_hsl(var(--foreground)/0.08)]">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              className="flex flex-col items-center justify-center flex-1 h-full gap-1 relative min-w-0"
              aria-label={item.label}
            >
              {active && (
                <motion.div
                  layoutId="mobile-nav-indicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full"
                  transition={{ type: 'spring', damping: 20, stiffness: 180 }}
                />
              )}
              <motion.div
                whileTap={{ scale: 0.85 }}
                transition={{ type: 'spring', damping: 15, stiffness: 400 }}
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-200",
                  active ? "bg-primary/10" : "bg-transparent"
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 transition-colors duration-200",
                    active ? "text-primary" : "text-muted-foreground"
                  )}
                />
              </motion.div>
              <span
                className={cn(
                  "text-[10px] font-medium leading-none transition-colors duration-200 truncate max-w-full px-1",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
      {/* Safe area bottom padding for notched phones */}
      <div className="h-safe-area-inset-bottom bg-card" />
    </nav>
  );
};
