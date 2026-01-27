import { MainLayout } from '@/components/layout/MainLayout';
import { Link } from 'react-router-dom';
import { FileText, CreditCard, HelpCircle, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const steps = [
  { step: 1, title: 'Check Eligibility', description: 'Review admission requirements for your program' },
  { step: 2, title: 'Prepare Documents', description: 'Gather required certificates and transcripts' },
  { step: 3, title: 'Submit Application', description: 'Complete the online application form' },
  { step: 4, title: 'Admission Test', description: 'Appear for the admission test if required' },
  { step: 5, title: 'Get Admitted', description: 'Complete enrollment and pay fees' },
];

const quickLinks = [
  { icon: FileText, title: 'How to Apply', href: '/admission/apply', description: 'Step-by-step guide' },
  { icon: CreditCard, title: 'Tuition & Fees', href: '/admission/fees', description: 'Fee structure' },
  { icon: Calendar, title: 'Important Dates', href: '/academic/calendar', description: 'Deadlines' },
  { icon: HelpCircle, title: 'FAQs', href: '/faq', description: 'Common questions' },
];

const Admission = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-primary text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Admission
          </h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Join Sunamgonj Science and Technology University and shape your future
          </p>
        </div>
      </section>

      {/* Application Steps */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-center mb-12">
            Application Process
          </h2>
          <div className="grid md:grid-cols-5 gap-6 mb-16">
            {steps.map((item, idx) => (
              <div key={idx} className="relative">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                {idx < steps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-6 -right-3 w-6 h-6 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>

          {/* Quick Links */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {quickLinks.map((link, idx) => (
              <Link key={idx} to={link.href}>
                <div className="bg-card rounded-xl p-6 border hover:shadow-lg transition-all group text-center">
                  <link.icon className="w-10 h-10 mx-auto mb-4 text-primary group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold mb-1">{link.title}</h3>
                  <p className="text-sm text-muted-foreground">{link.description}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="bg-gold/10 border border-gold/30 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="font-display text-3xl font-bold mb-4">Admission Open 2025</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Applications are now being accepted for undergraduate and postgraduate programs.
            </p>
            <Button className="bg-gold text-primary hover:bg-gold/90">
              Start Application
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Admission;
