import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
import { AcademicMegaMenu } from './AcademicMegaMenu';

const topBarLinks = [
  { icon: Phone, text: '+880-831-52012', href: 'tel:+880831-52012' },
  { icon: Mail, text: 'info@sstu.ac.bd', href: 'mailto:info@sstu.ac.bd' },
  { icon: MapPin, text: 'Shantiganj 3000, Sunamganj, Bangladesh', href: '#contact' },
];

const facilitiesDropdown = [
  { label: 'DSW', href: '/facilities/dsw' },
  { label: 'Halls Of Residence', href: '/facilities/halls' },
  { label: 'Student Organizations', href: '/facilities/organizations' },
  { label: 'E-Resources', href: '/facilities/e-resources' },
  { label: 'Library', href: '/facilities/library' },
  { label: 'Events', href: '/events' },
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
  { label: 'General Notices', href: '/notices?category=general' },
  { label: 'Exam Notices', href: '/notices?category=exam' },
  { label: 'Scholarship Notices', href: '/notices?category=scholarship' },
  { label: 'Admission Notices', href: '/notices?category=admission' },
  { label: 'Workshop Notices', href: '/notices?category=workshop' },
  { label: 'Recruitment Notices', href: '/notices?category=recruitment' },
  { label: 'Academic Calendar', href: '/academic/calendar' },
];

const aboutDropdown = [
  { label: 'About SSTU', href: '/about' },
  { label: 'At a Glance', href: '/about/at-a-glance' },
  { label: 'SSTU ACT', href: '/about/act' },
  { label: 'SSTU Organogram', href: '/about/organogram' },
  { label: 'SSTU Bulletin', href: '/about/bulletin' },
  { label: 'SSTU Monogram', href: '/about/monogram' },
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
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine if navbar should be transparent (only on homepage and not scrolled)
  const isTransparent = isHomePage && !isScrolled;

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isTransparent ? "bg-transparent" : "bg-primary shadow-lg"
    )}>
      {/* Top Bar - Only show when scrolled or not on homepage */}
      {!isTransparent && (
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
      )}

      {/* Main Navigation */}
      <nav className={cn(
        "border-b transition-all duration-300",
        isTransparent 
          ? "bg-black/20 backdrop-blur-sm border-white/10" 
          : "bg-primary border-primary/20"
      )}>
        <div className="container mx-auto">
        <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 min-w-0">
              <img src={sstuLogo} alt="SSTU Logo" className="w-12 h-12 lg:w-16 lg:h-16 flex-shrink-0 object-contain" />
              <div className="hidden sm:block min-w-0">
                <h1 className="font-serif text-base md:text-lg lg:text-xl font-semibold text-white leading-tight tracking-wide truncate">
                  Sunamgonj Science and Technology University
                </h1>
              </div>
              {/* Mobile-only short name */}
              <div className="sm:hidden min-w-0">
                <h1 className="font-serif text-sm font-semibold text-white leading-tight">
                  SSTU
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
                        className={cn(
                          "absolute top-full bg-white rounded-b-lg shadow-xl min-w-56 z-50",
                          // Position right-aligned dropdowns (About, Notices) to prevent overflow
                          item.label === 'About' || item.label === 'Notices' 
                            ? "right-0" 
                            : "left-0"
                        )}
                      >
                        <div className="py-1">
                          {item.dropdown.map((subItem, idx) => (
                            <Link
                              key={idx}
                              to={subItem.href}
                              className="flex items-center gap-2 px-4 py-1.5 text-sm text-foreground/80 hover:bg-secondary hover:text-primary transition-colors"
                            >
                              <ChevronRight className="w-3 h-3 text-gold" />
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Academic Mega Menu */}
                  <AnimatePresence>
                    {activeDropdown === 'Academics' && item.hasMegaMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 top-full bg-white rounded-b-lg shadow-xl z-50"
                      >
                        <AcademicMegaMenu />
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-3 text-white rounded-lg hover:bg-white/10 active:bg-white/20 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
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
              className="lg:hidden border-t border-white/10 overflow-hidden bg-primary"
            >
              <div className="container mx-auto py-3 space-y-0.5 max-h-[70vh] overflow-y-auto">
                {mainNavItems.map((item) => (
                  <div key={item.label}>
                    <Link
                      to={item.href}
                      className="flex items-center justify-between px-4 py-3.5 text-white hover:bg-white/10 active:bg-white/20 rounded-lg transition-colors font-medium text-sm min-h-[48px]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span>{item.label}</span>
                      {(item.dropdown || item.hasMegaMenu) && (
                        <ChevronRight className="w-4 h-4 text-white/60" />
                      )}
                    </Link>
                    {/* Show first few sub-items inline on mobile */}
                    {item.dropdown && (
                      <div className="pl-4 pb-1 space-y-0.5">
                        {item.dropdown.slice(0, 4).map((sub, idx) => (
                          <Link
                            key={idx}
                            to={sub.href}
                            className="flex items-center gap-2 px-4 py-2.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-xs min-h-[40px]"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <ChevronRight className="w-3 h-3 text-gold/70 flex-shrink-0" />
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div className="pt-3 border-t border-white/10 space-y-0.5">
                  <p className="px-4 py-1 text-xs uppercase tracking-widest text-white/50 font-medium">Portals</p>
                  {portalLinks.map((link, idx) => (
                    <Link
                      key={idx}
                      to={link.href}
                      className="flex items-center gap-3 px-4 py-3.5 text-white hover:bg-white/10 active:bg-white/20 rounded-lg transition-colors min-h-[48px]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <link.icon className="w-5 h-5 text-gold flex-shrink-0" />
                      <span className="text-sm font-medium">{link.label}</span>
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