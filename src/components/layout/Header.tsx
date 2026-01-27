import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  ChevronDown, 
  Phone, 
  Mail, 
  MapPin,
  GraduationCap,
  BookOpen,
  Users,
  Bell,
  Newspaper,
  Camera,
  LogIn
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const topBarLinks = [
  { icon: Phone, text: '+880-1234-567890', href: 'tel:+8801234567890' },
  { icon: Mail, text: 'info@sstu.ac.bd', href: 'mailto:info@sstu.ac.bd' },
  { icon: MapPin, text: 'Sylhet, Bangladesh', href: '#contact' },
];

const mainNavItems = [
  { 
    label: 'Home', 
    href: '/' 
  },
  { 
    label: 'About',
    href: '/about',
    dropdown: [
      { label: 'History of SSTU', href: '/about/history' },
      { label: 'Vision & Mission', href: '/about/vision-mission' },
      { label: 'Vice Chancellor', href: '/about/vice-chancellor' },
      { label: 'Campus Map', href: '/about/campus-map' },
      { label: 'Contact Us', href: '/contact' },
    ]
  },
  { 
    label: 'Academic',
    href: '/academic',
    megaMenu: true,
    sections: [
      {
        title: 'Academic Info',
        items: [
          { label: 'Academic Calendar', href: '/academic/calendar' },
          { label: 'Undergraduate Program', href: '/academic/undergraduate' },
          { label: 'Postgraduate Program', href: '/academic/postgraduate' },
        ]
      },
      {
        title: 'Faculties',
        items: [
          { label: 'Faculty of Engineering', href: '/faculties/engineering' },
          { label: 'Faculty of Science', href: '/faculties/science' },
          { label: 'Faculty of Arts', href: '/faculties/arts' },
        ]
      },
      {
        title: 'Departments',
        items: [
          { label: 'Computer Science & Engineering', href: '/departments/cse' },
          { label: 'Electrical Engineering', href: '/departments/eee' },
          { label: 'Civil Engineering', href: '/departments/ce' },
          { label: 'View All Departments', href: '/departments' },
        ]
      },
    ]
  },
  { 
    label: 'Research',
    href: '/research',
    dropdown: [
      { label: 'Research Overview', href: '/research' },
      { label: 'Publications', href: '/research/publications' },
      { label: 'Research Areas', href: '/research/areas' },
      { label: 'Faculty Rankings', href: '/research/rankings' },
    ]
  },
  { 
    label: 'Faculty',
    href: '/faculty'
  },
  { 
    label: 'Notices',
    href: '/notices',
    dropdown: [
      { label: 'All Notices', href: '/notices' },
      { label: 'Student Notices', href: '/notices?category=student' },
      { label: 'Exam Notices', href: '/notices?category=exam' },
      { label: 'Scholarships', href: '/notices?category=scholarship' },
    ]
  },
  { 
    label: 'Admission',
    href: '/admission'
  },
  { 
    label: 'Gallery',
    href: '/gallery'
  },
];

const portalLinks = [
  { label: 'Admin Portal', href: '/admin/login', icon: Users },
  { label: 'Teacher Portal', href: '/teacher/login', icon: BookOpen },
  { label: 'Student Portal', href: '/student/login', icon: GraduationCap },
];

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [portalMenuOpen, setPortalMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-2 hidden lg:block">
        <div className="container mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            {topBarLinks.map((link, idx) => (
              <a 
                key={idx} 
                href={link.href}
                className="flex items-center gap-2 hover:text-gold transition-colors"
              >
                <link.icon className="w-4 h-4" />
                <span>{link.text}</span>
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setPortalMenuOpen(!portalMenuOpen)}
                className="flex items-center gap-2 hover:text-gold transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              <AnimatePresence>
                {portalMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-2 bg-white text-foreground rounded-lg shadow-xl p-2 min-w-48"
                  >
                    {portalLinks.map((link, idx) => (
                      <Link
                        key={idx}
                        to={link.href}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-secondary rounded-md transition-colors"
                        onClick={() => setPortalMenuOpen(false)}
                      >
                        <link.icon className="w-4 h-4 text-accent" />
                        <span>{link.label}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container mx-auto">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-gold" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-display text-xl font-bold text-primary leading-tight">
                  SSTU
                </h1>
                <p className="text-xs text-muted-foreground">
                  Shaikh Burhanuddin Post Graduate College
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {mainNavItems.map((item) => (
                <div 
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center gap-1 px-4 py-2 text-sm font-medium text-foreground hover:text-accent transition-colors link-underline",
                      (item.dropdown || item.megaMenu) && "cursor-pointer"
                    )}
                  >
                    {item.label}
                    {(item.dropdown || item.megaMenu) && (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Link>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {activeDropdown === item.label && item.dropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute left-0 top-full pt-2"
                      >
                        <div className="bg-white rounded-lg shadow-xl border border-border p-2 min-w-48 mega-menu-enter">
                          {item.dropdown.map((subItem, idx) => (
                            <Link
                              key={idx}
                              to={subItem.href}
                              className="block px-4 py-2 text-sm hover:bg-secondary rounded-md transition-colors"
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Mega Menu */}
                    {activeDropdown === item.label && item.megaMenu && item.sections && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute left-1/2 -translate-x-1/2 top-full pt-2"
                      >
                        <div className="bg-white rounded-xl shadow-2xl border border-border p-8 min-w-[600px] mega-menu-enter">
                          <div className="grid grid-cols-3 gap-8">
                            {item.sections.map((section, idx) => (
                              <div key={idx}>
                                <h3 className="font-display font-semibold text-primary mb-4 pb-2 border-b border-border">
                                  {section.title}
                                </h3>
                                <ul className="space-y-2">
                                  {section.items.map((subItem, subIdx) => (
                                    <li key={subIdx}>
                                      <Link
                                        to={subItem.href}
                                        className="text-sm text-muted-foreground hover:text-accent transition-colors flex items-center gap-2"
                                      >
                                        <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                                        {subItem.label}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-foreground"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-border overflow-hidden"
            >
              <div className="container mx-auto py-4 space-y-2">
                {mainNavItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="block px-4 py-3 text-foreground hover:bg-secondary rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="pt-4 border-t border-border space-y-2">
                  {portalLinks.map((link, idx) => (
                    <Link
                      key={idx}
                      to={link.href}
                      className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-secondary rounded-lg transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <link.icon className="w-5 h-5 text-accent" />
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};
