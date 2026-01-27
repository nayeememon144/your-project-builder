import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { MapPin, Phone, Mail, Clock, Building2, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().optional(),
  department: z.string().optional(),
  subject: z.string().trim().min(1, "Subject is required").max(200),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000),
});

const contactInfo = [
  {
    icon: MapPin,
    title: 'Address',
    details: ['Sunamgonj Science and Technology University', 'Shantiganj 3000, Sunamganj, Bangladesh'],
  },
  {
    icon: Phone,
    title: 'Phone',
    details: ['+880-831-52012', '+880-831-52013'],
  },
  {
    icon: Mail,
    title: 'Email',
    details: ['info@sstu.ac.bd', 'admission@sstu.ac.bd'],
  },
  {
    icon: Clock,
    title: 'Office Hours',
    details: ['Sunday - Thursday', '9:00 AM - 5:00 PM'],
  },
];

const departmentContacts = [
  {
    name: 'Computer Science & Engineering',
    shortName: 'CSE',
    email: 'cse@sstu.ac.bd',
    phone: '+880-831-52014',
    location: 'Academic Building A, Floor 2',
  },
  {
    name: 'Physics',
    shortName: 'PHY',
    email: 'physics@sstu.ac.bd',
    phone: '+880-831-52015',
    location: 'Science Building, Floor 1',
  },
  {
    name: 'Chemistry',
    shortName: 'CHEM',
    email: 'chemistry@sstu.ac.bd',
    phone: '+880-831-52016',
    location: 'Science Building, Floor 2',
  },
  {
    name: 'Mathematics',
    shortName: 'MATH',
    email: 'math@sstu.ac.bd',
    phone: '+880-831-52017',
    location: 'Academic Building B, Floor 1',
  },
];

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    toast({
      title: "Message Sent!",
      description: "We'll get back to you as soon as possible.",
    });
  };

  // SSTU coordinates from user-provided link
  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3619.1234567890123!2d91.39892961500789!3d24.86621398404831!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x375058ba92ad11f1%3A0xba7d98d1e1b1b1b1!2sSunamganj%20Science%20and%20Technology%20University!5e0!3m2!1sen!2sbd!4v1706370000000!5m2!1sen!2sbd";

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-primary text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Contact Us
          </h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Get in touch with Sunamgonj Science and Technology University. We're here to help with any questions.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-card rounded-xl p-8 border shadow-sm">
              <h2 className="font-display text-2xl font-bold mb-6">Send us a Message</h2>
              
              {isSubmitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
                  <p className="text-muted-foreground mb-6">
                    Your message has been sent successfully. We'll respond within 2-3 business days.
                  </p>
                  <Button onClick={() => {
                    setIsSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', department: '', subject: '', message: '' });
                  }}>
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Name *</label>
                      <Input 
                        placeholder="Your full name" 
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className={errors.name ? 'border-destructive' : ''}
                      />
                      {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email *</label>
                      <Input 
                        type="email" 
                        placeholder="your@email.com" 
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className={errors.email ? 'border-destructive' : ''}
                      />
                      {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone (Optional)</label>
                      <Input 
                        placeholder="+880-XXX-XXXXXXX" 
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Department</label>
                      <Select value={formData.department} onValueChange={(value) => handleChange('department', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="admission">Admission Office</SelectItem>
                          <SelectItem value="cse">Computer Science & Engineering</SelectItem>
                          <SelectItem value="physics">Physics</SelectItem>
                          <SelectItem value="chemistry">Chemistry</SelectItem>
                          <SelectItem value="math">Mathematics</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Subject *</label>
                    <Input 
                      placeholder="What is your inquiry about?" 
                      value={formData.subject}
                      onChange={(e) => handleChange('subject', e.target.value)}
                      className={errors.subject ? 'border-destructive' : ''}
                    />
                    {errors.subject && <p className="text-destructive text-xs mt-1">{errors.subject}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Message *</label>
                    <Textarea 
                      placeholder="Please describe your inquiry in detail..." 
                      rows={5} 
                      value={formData.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      className={errors.message ? 'border-destructive' : ''}
                    />
                    {errors.message && <p className="text-destructive text-xs mt-1">{errors.message}</p>}
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>Sending...</>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>

            {/* Contact Info & Map */}
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-2xl font-bold mb-6">Contact Information</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {contactInfo.map((info, idx) => (
                    <div key={idx} className="flex gap-4 bg-muted/50 rounded-lg p-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                        <info.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm mb-1">{info.title}</h3>
                        {info.details.map((detail, i) => (
                          <p key={i} className="text-muted-foreground text-sm">{detail}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Map */}
              <div>
                <h3 className="font-display text-xl font-bold mb-4">Find Us on Map</h3>
                <div className="rounded-xl overflow-hidden border shadow-sm h-72">
                  <iframe
                    src={mapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="SSTU Location Map"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Department Contacts */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold mb-4">Department Contacts</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Reach out directly to specific departments for academic or administrative inquiries
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {departmentContacts.map((dept, idx) => (
              <div key={idx} className="bg-card rounded-xl p-6 border shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold mb-1">{dept.name}</h3>
                <p className="text-xs text-muted-foreground mb-4">{dept.location}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <a href={`mailto:${dept.email}`} className="text-primary hover:underline">
                      {dept.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{dept.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Contact;
