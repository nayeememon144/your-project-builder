import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
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
import sstuLogo from '@/assets/sstu-logo.png';

const academicsLinks = [
  { label: 'All Departments', href: '/departments' },
  { label: 'Undergraduate', href: '/academic/undergraduate' },
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

// Default contact info
const defaultContact = {
  address: 'Shantiganj 3000, Sunamganj, Bangladesh',
  city: 'Sunamgonj Sadar, Sylhet Division',
  phone1: '+880-831-52012',
  email1: 'info@sstu.ac.bd',
  map_embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3619.1234567890123!2d91.39892961500789!3d24.86621398404831!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x375058ba92ad11f1%3A0xba7d98d1e1b1b1b1!2sSunamganj%20Science%20and%20Technology%20University!5e0!3m2!1sen!2sbd!4v1706370000000!5m2!1sen!2sbd',
};

// Helper function to extract URL from iframe HTML or return URL directly
const extractMapUrl = (input: string | undefined): string => {
  if (!input) return defaultContact.map_embed_url;
  // If input contains iframe tag, extract the src URL
  if (input.includes('<iframe')) {
    const srcMatch = input.match(/src="([^"]+)"/);
    return srcMatch ? srcMatch[1] : defaultContact.map_embed_url;
  }
  // Return as-is if it's already a URL
  return input;
};

export const Footer = () => {
  // Fetch contact settings
  const { data: contactSettings } = useQuery({
    queryKey: ['site-settings-contact'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'contact')
        .maybeSingle();
      
      if (error) throw error;
      return data?.setting_value as typeof defaultContact | null;
    },
  });

  const contact = contactSettings || defaultContact;

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container mx-auto py-8 md:py-12">
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
              <div>
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0 p-1">
                    <img src={sstuLogo} alt="SSTU Logo" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Sunamgonj Science & Technology University</h4>
                    <p className="text-sm text-primary-foreground/70">{contact.address}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-gold" />
                    <span className="text-primary-foreground/80">{contact.city}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-gold" />
                    <span className="text-primary-foreground/80">{contact.phone1}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-gold" />
                    <span className="text-primary-foreground/80">{contact.email1}</span>
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

              {/* Map - SSTU Location */}
              <div className="bg-primary-foreground/10 rounded-lg overflow-hidden h-48">
              <iframe
                  src={extractMapUrl(contact.map_embed_url)}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="SSTU Location - Shantiganj, Sunamganj"
                  className="grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - adds padding for mobile bottom nav */}
      <div className="bg-primary/80 border-t border-primary-foreground/10">
        <div className="container mx-auto py-4 px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-primary-foreground/70">
            <p className="text-center md:text-left text-xs md:text-sm">
              © {new Date().getFullYear()} Sunamgonj Science & Technology University. All rights reserved.
            </p>
            <div className="flex items-center gap-3 text-xs md:text-sm flex-wrap justify-center">
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
