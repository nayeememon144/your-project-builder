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
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const footerLinks = {
  quickLinks: [
    { label: 'About SSTU', href: '/about' },
    { label: 'Academic Programs', href: '/academic' },
    { label: 'Admission', href: '/admission' },
    { label: 'Research', href: '/research' },
    { label: 'Notice Board', href: '/notices' },
    { label: 'Gallery', href: '/gallery' },
  ],
  academics: [
    { label: 'Undergraduate', href: '/academic/undergraduate' },
    { label: 'Postgraduate', href: '/academic/postgraduate' },
    { label: 'Departments', href: '/departments' },
    { label: 'Faculties', href: '/faculties' },
    { label: 'Academic Calendar', href: '/academic/calendar' },
    { label: 'E-Resources', href: '/resources' },
  ],
  resources: [
    { label: 'Library', href: '/facilities/library' },
    { label: 'Student Portal', href: '/student/login' },
    { label: 'Teacher Portal', href: '/teacher/login' },
    { label: 'Downloads', href: '/downloads' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact Us', href: '/contact' },
  ],
};

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
      <div className="container mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* About Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 bg-gold rounded-full flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold">SSTU</h2>
                <p className="text-sm text-primary-foreground/80">
                  Shaikh Burhanuddin Post Graduate College
                </p>
              </div>
            </Link>
            <p className="text-primary-foreground/80 mb-6 leading-relaxed">
              SSTU is a premier institution of higher learning, committed to academic excellence, 
              research innovation, and producing leaders who will shape the future of our nation 
              and beyond.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-5 h-5 text-gold" />
                <span>Sylhet, Bangladesh</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-5 h-5 text-gold" />
                <span>+880-1234-567890</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-5 h-5 text-gold" />
                <span>info@sstu.ac.bd</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-6 text-gold">Quick Links</h3>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link, idx) => (
                <li key={idx}>
                  <Link 
                    to={link.href}
                    className="text-sm text-primary-foreground/80 hover:text-gold transition-colors flex items-center gap-2"
                  >
                    <ArrowRight className="w-3 h-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Academics */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-6 text-gold">Academics</h3>
            <ul className="space-y-3">
              {footerLinks.academics.map((link, idx) => (
                <li key={idx}>
                  <Link 
                    to={link.href}
                    className="text-sm text-primary-foreground/80 hover:text-gold transition-colors flex items-center gap-2"
                  >
                    <ArrowRight className="w-3 h-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-6 text-gold">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, idx) => (
                <li key={idx}>
                  <Link 
                    to={link.href}
                    className="text-sm text-primary-foreground/80 hover:text-gold transition-colors flex items-center gap-2"
                  >
                    <ArrowRight className="w-3 h-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter & Social */}
        <div className="mt-12 pt-12 border-t border-primary-foreground/20">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            {/* Newsletter */}
            <div className="w-full lg:w-auto">
              <h4 className="font-display text-lg font-semibold mb-3">Stay Updated</h4>
              <div className="flex gap-2">
                <Input 
                  type="email" 
                  placeholder="Enter your email"
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 w-64"
                />
                <Button className="btn-golden">
                  Subscribe
                </Button>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-primary-foreground/80">Follow Us:</span>
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-gold hover:text-primary transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-primary/80 py-4">
        <div className="container mx-auto text-center text-sm text-primary-foreground/80">
          <p>
            © {new Date().getFullYear()} Shaikh Burhanuddin Post Graduate College (SSTU). All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
