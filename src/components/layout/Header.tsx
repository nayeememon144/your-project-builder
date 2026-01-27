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
  LogIn,
  ChevronRight
} from 'lucide-react';
import sstuLogo from '@/assets/sstu-logo.png';
import { cn } from '@/lib/utils';

const topBarLinks = [
  { icon: Phone, text: '+880-1234-567890', href: 'tel:+8801234567890' },
  { icon: Mail, text: 'info@sstu.ac.bd', href: 'mailto:info@sstu.ac.bd' },
  { icon: MapPin, text: 'Sylhet, Bangladesh', href: '#contact' },
];

const academicMegaMenuData = {
  academicInfo: {
    title: 'Academic Information',
    items: [
      { label: 'Academic Calendars', href: '/academic/calendar' },
      { label: 'Undergraduate Program', href: '/academic/undergraduate' },
      { label: 'Postgraduate Program', href: '/academic/postgraduate' },
      { label: 'International Students', href: '/academic/international' },
    ]
  },
  faculties: {
    title: 'Faculties',
    items: [
      { label: 'Faculty of Engineering', href: '/faculties/engineering' },
      { label: 'Faculty of Science', href: '/faculties/science' },
      { label: 'Faculty of Arts & Social Science', href: '/faculties/arts' },
      { label: 'Faculty of Business Studies', href: '/faculties/business' },
      { label: 'Faculty of Law', href: '/faculties/law' },
      { label: 'Faculty of Life Sciences', href: '/faculties/life-sciences' },
    ]
  },
  departments: {
    title: 'Departments',
    items: [
      { label: 'Computer Science & Engineering', href: '/departments/cse' },
      { label: 'Electrical & Electronic Engineering', href: '/departments/eee' },
      { label: 'Civil Engineering', href: '/departments/ce' },
      { label: 'Mechanical Engineering', href: '/departments/me' },
      { label: 'Mathematics', href: '/departments/math' },
      { label: 'Physics', href: '/departments/physics' },
      { label: 'Chemistry', href: '/departments/chemistry' },
      { label: 'English', href: '/departments/english' },
      { label: 'Economics', href: '/departments/economics' },
      { label: 'Accounting', href: '/departments/accounting' },
      { label: 'Management', href: '/departments/management' },
      { label: 'Statistics', href: '/departments/statistics' },
    ]
  },
  institutes: {
    title: 'Institutes',
    items: [
      { label: 'IEER', href: '/institutes/ieer' },
      { label: 'IET', href: '/institutes/iet' },
      { label: 'IICT', href: '/institutes/iict' },
      { label: 'IRHES', href: '/institutes/irhes' },
    ]
  },
  centers: {
    title: 'Centers',
    items: [
      { label: 'Research Center', href: '/centers/research' },
      { label: 'IT Center', href: '/centers/it' },
      { label: 'Career Center', href: '/centers/career' },
    ]
  }
};

const facilitiesDropdown = [
  { label: 'DSW', href: '/facilities/dsw' },
  { label: 'Scholarship & Financial Aids', href: '/facilities/scholarship' },
  { label: 'Halls Of Residence', href: '/facilities/halls' },
  { label: 'Student Organizations', href: '/facilities/organizations' },
  { label: 'Undergraduate Program', href: '/facilities/undergraduate' },
  { label: 'Postgraduate Program', href: '/facilities/postgraduate' },
  { label: 'Student Notices', href: '/notices?category=student' },
  { label: 'E-Resources', href: '/facilities/e-resources' },
  { label: 'Library', href: '/facilities/library' },
  { label: 'Events', href: '/events' },
  { label: 'Downloads', href: '/downloads' },
];

const researchDropdown = [
  { label: 'Publication', href: '/research/publications' },
  { label: 'Research Highlights', href: '/research/highlights' },
  { label: 'Research Area', href: '/research/areas' },
  { label: 'Journal Paper', href: '/research/journal' },
  { label: 'Conference Paper', href: '/research/conference' },
  { label: 'Others', href: '/research/others' },
  { label: 'Partnership', href: '/research/partnership' },
  { label: 'MoU', href: '/research/mou' },
];

const noticesDropdown = [
  { label: 'All Notices', href: '/notices' },
  { label: 'Student Notices', href: '/notices?category=student' },
  { label: 'General Notices', href: '/notices?category=general' },
  { label: 'Appointments', href: '/notices?category=appointments' },
  { label: 'Offices Orders/NOC', href: '/notices?category=orders' },
  { label: 'Scholarship & Financial Aids', href: '/notices?category=scholarship' },
  { label: 'Academic Calendar', href: '/academic/calendar' },
  { label: 'Tender/E-Tender', href: '/notices?category=tender' },
  { label: 'Downloads', href: '/downloads' },
];

const aboutDropdown = [
  { label: 'History of SSTU', href: '/about/history' },
  { label: 'About SSTU', href: '/about' },
  { label: 'Vision And Mission', href: '/about/vision-mission' },
  { label: 'Alumni', href: '/about/alumni' },
  { label: 'Previous Vice Chancellors', href: '/about/previous-vc' },
  { label: 'Campus Map', href: '/about/campus-map' },
  { label: 'Photo Gallery', href: '/gallery' },
  { label: 'Contact Us', href: '/contact' },
];

const mainNavItems = [
  { label: 'Home', href: '/' },
  { label: 'Academics', href: '/academic', hasMegaMenu: true },
  { label: 'Admission', href: '/admission' },
  { label: 'Facilities', href: '/facilities', dropdown: facilitiesDropdown },
  { label: 'Research', href: '/research', dropdown: researchDropdown },
  { label: 'Notices', href: '/notices', dropdown: noticesDropdown },
  { label: 'About', href: '/about', dropdown: aboutDropdown },
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
                    className="absolute right-0 top-full mt-2 bg-white text-foreground rounded-lg shadow-xl p-2 min-w-48 z-50"
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
      <nav className="bg-primary border-b border-primary/20">
        <div className="container mx-auto">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-1">
                <img src={sstuLogo} alt="SSTU Logo" className="w-full h-full object-contain" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-serif text-base md:text-lg font-semibold text-white leading-tight tracking-wide">
                  Sunamgonj Science and Technology University
                </h1>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center">
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
                      "flex items-center gap-1 px-4 py-5 text-sm font-medium text-white hover:bg-white/10 transition-colors",
                      activeDropdown === item.label && "bg-white/10 text-gold"
                    )}
                  >
                    {item.label}
                    {(item.dropdown || item.hasMegaMenu) && (
                      <ChevronDown className={cn(
                        "w-4 h-4 transition-transform",
                        activeDropdown === item.label && "rotate-180"
                      )} />
                    )}
                  </Link>

                  {/* Regular Dropdown Menu */}
                  <AnimatePresence>
                    {activeDropdown === item.label && item.dropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 top-full bg-white rounded-b-lg shadow-xl min-w-56 z-50 overflow-hidden"
                      >
                        <div className="py-2">
                          {item.dropdown.map((subItem, idx) => (
                            <Link
                              key={idx}
                              to={subItem.href}
                              className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                            >
                              <ChevronRight className="w-3 h-3 text-gold" />
                              {subItem.label}
                            </Link>
                          ))}
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
              className="lg:hidden p-2 text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Academic Mega Menu - Full Width */}
        <AnimatePresence>
          {activeDropdown === 'Academics' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 right-0 top-full bg-white shadow-2xl z-50 overflow-hidden"
              onMouseEnter={() => setActiveDropdown('Academics')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <div className="container mx-auto py-8">
                <div className="grid grid-cols-12 gap-8">
                  {/* Academic Information */}
                  <div className="col-span-3">
                    <div className="border-l-4 border-gold pl-4 mb-4">
                      <h3 className="font-display font-semibold text-primary text-lg">
                        {academicMegaMenuData.academicInfo.title}
                      </h3>
                    </div>
                    <ul className="space-y-2">
                      {academicMegaMenuData.academicInfo.items.map((item, idx) => (
                        <li key={idx}>
                          <Link
                            to={item.href}
                            className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors py-1"
                          >
                            <ChevronRight className="w-3 h-3 text-gray-400" />
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Faculties */}
                  <div className="col-span-5">
                    <div className="border-l-4 border-gold pl-4 mb-4">
                      <h3 className="font-display font-semibold text-primary text-lg">
                        {academicMegaMenuData.faculties.title}
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                      {academicMegaMenuData.faculties.items.map((item, idx) => (
                        <Link
                          key={idx}
                          to={item.href}
                          className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors py-1"
                        >
                          <ChevronRight className="w-3 h-3 text-gray-400" />
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Institutes & Centers */}
                  <div className="col-span-4">
                    <div className="bg-gray-50 rounded-lg p-5">
                      {/* Institutes */}
                      <div className="mb-6">
                        <h3 className="font-display font-semibold text-gray-800 mb-3">
                          {academicMegaMenuData.institutes.title}
                        </h3>
                        <ul className="space-y-2">
                          {academicMegaMenuData.institutes.items.map((item, idx) => (
                            <li key={idx}>
                              <Link
                                to={item.href}
                                className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
                              >
                                <ChevronRight className="w-3 h-3 text-gray-400" />
                                {item.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {/* Centers */}
                      <div>
                        <h3 className="font-display font-semibold text-gray-800 mb-3">
                          {academicMegaMenuData.centers.title}
                        </h3>
                        <ul className="space-y-2">
                          {academicMegaMenuData.centers.items.map((item, idx) => (
                            <li key={idx}>
                              <Link
                                to={item.href}
                                className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
                              >
                                <ChevronRight className="w-3 h-3 text-gray-400" />
                                {item.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Departments Section */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="border-l-4 border-gold pl-4 mb-4">
                    <h3 className="font-display font-semibold text-primary text-lg">
                      {academicMegaMenuData.departments.title}
                    </h3>
                  </div>
                  <div className="grid grid-cols-4 gap-x-8 gap-y-2">
                    {academicMegaMenuData.departments.items.map((item, idx) => (
                      <Link
                        key={idx}
                        to={item.href}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors py-1"
                      >
                        <ChevronRight className="w-3 h-3 text-gray-400" />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-white/10 overflow-hidden bg-primary"
            >
              <div className="container mx-auto py-4 space-y-1">
                {mainNavItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="block px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="pt-4 border-t border-white/10 space-y-1">
                  {portalLinks.map((link, idx) => (
                    <Link
                      key={idx}
                      to={link.href}
                      className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <link.icon className="w-5 h-5 text-gold" />
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