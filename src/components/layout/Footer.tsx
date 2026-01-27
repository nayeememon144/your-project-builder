import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Twitter, 
  Youtube,
  Linkedin,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

const academicsLinks = [
  { label: 'All Departments', href: '/departments' },
  { label: 'Undergraduate', href: '/academic/undergraduate' },
  { label: 'Postgraduate', href: '/academic/postgraduate' },
  { label: 'Academic Calendar', href: '/academic/calendar' },
  { label: 'E-Resources', href: '/facilities/e-resources' },
  { label: 'Scholarships', href: '/facilities/scholarship' },
];

const admissionLinks = [
  { label: 'Admission Requirements', href: '/admission' },
  { label: 'How to Apply', href: '/admission/apply' },
  { label: 'Tuition & Fees', href: '/admission/fees' },
  { label: 'International Students', href: '/academic/international' },
];

const importantLinks = [
  { label: 'UGC', href: 'https://ugc.gov.bd', external: true },
  { label: 'Ministry of Education', href: 'https://moedu.gov.bd', external: true },
  { label: 'HEQEP', href: 'https://heqep.gov.bd', external: true },
  { label: 'E-Learning', href: '/facilities/e-resources' },
  { label: 'Notice Board', href: '/notices' },
  { label: 'Downloads', href: '/downloads' },
  { label: 'Research Portal', href: '/research' },
  { label: 'Library', href: '/facilities/library' },
];

const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com/sstu', label: 'Facebook' },
  { icon: Twitter, href: 'https://twitter.com/sstu', label: 'Twitter' },
  { icon: Youtube, href: 'https://youtube.com/sstu', label: 'YouTube' },
  { icon: Linkedin, href: 'https://linkedin.com/school/sstu', label: 'LinkedIn' },
];

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Academics & Admission */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-6 text-gold border-b border-gold/30 pb-2">
              Academics & Admission
            </h3>
            <ul className="space-y-2">
              {academicsLinks.map((link, idx) => (
                <li key={idx}>
                  <Link 
                    to={link.href}
                    className="text-sm text-primary-foreground/80 hover:text-gold transition-colors flex items-center gap-2"
                  >
                    <ChevronRight className="w-3 h-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2 border-t border-primary-foreground/10 mt-2">
                <span className="text-xs text-primary-foreground/50 uppercase tracking-wider">Admission</span>
              </li>
              {admissionLinks.map((link, idx) => (
                <li key={idx}>
                  <Link 
                    to={link.href}
                    className="text-sm text-primary-foreground/80 hover:text-gold transition-colors flex items-center gap-2"
                  >
                    <ChevronRight className="w-3 h-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Important Links */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-6 text-gold border-b border-gold/30 pb-2">
              Important Links
            </h3>
            <ul className="space-y-2">
              {importantLinks.map((link, idx) => (
                <li key={idx}>
                  {link.external ? (
                    <a 
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-foreground/80 hover:text-gold transition-colors flex items-center gap-2"
                    >
                      <ChevronRight className="w-3 h-3" />
                      {link.label}
                      <ExternalLink className="w-3 h-3 ml-auto" />
                    </a>
                  ) : (
                    <Link 
                      to={link.href}
                      className="text-sm text-primary-foreground/80 hover:text-gold transition-colors flex items-center gap-2"
                    >
                      <ChevronRight className="w-3 h-3" />
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-lg font-semibold mb-6 text-gold border-b border-gold/30 pb-2">
              Contact Us
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Contact Info */}
              <div>
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Shaikh Burhanuddin Science & Technology University</h4>
                    <p className="text-sm text-primary-foreground/70">Habiganj, Sylhet, Bangladesh</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-gold" />
                    <span className="text-primary-foreground/80">Habiganj Sadar, Sylhet Division</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-gold" />
                    <span className="text-primary-foreground/80">+880-831-52012</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-gold" />
                    <span className="text-primary-foreground/80">info@sstu.ac.bd</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="mt-6">
                  <p className="text-sm text-primary-foreground/60 mb-3">Find Us @</p>
                  <div className="flex items-center gap-3">
                    {socialLinks.map((social, idx) => (
                      <a
                        key={idx}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-gold hover:text-primary transition-all"
                        aria-label={social.label}
                      >
                        <social.icon className="w-4 h-4" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="bg-primary-foreground/10 rounded-lg overflow-hidden h-48">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3619.0!2d91.4!3d24.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDI0JzAwLjAiTiA5McKwMjQnMDAuMCJF!5e0!3m2!1sen!2sbd!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="SSTU Location"
                  className="grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-primary/80 border-t border-primary-foreground/10">
        <div className="container mx-auto py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/70">
            <p>
              © {new Date().getFullYear()} Shaikh Burhanuddin Science & Technology University. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link to="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link>
              <span>|</span>
              <Link to="/terms" className="hover:text-gold transition-colors">Terms of Use</Link>
              <span>|</span>
              <Link to="/sitemap" className="hover:text-gold transition-colors">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
