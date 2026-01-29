import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const defaultContent = {
  image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80',
  text: `Sunamgonj Science and Technology University (SSTU) is one of the 
leading public universities in Bangladesh, established with a vision to 
provide quality higher education and contribute to the nation's development 
through research and innovation.

The university is situated alongside the Chittagong-Sylhet Highway, about 25km away 
from the Sylhet city. SSTU is taking important initiatives to benefit the 
development of engineering and allied sciences among the national and 
international universities.`,
};

export const AtAGlanceSection = () => {
  const { data: settings } = useQuery({
    queryKey: ['site-settings-about'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'about')
        .maybeSingle();
      
      if (error) throw error;
      return data?.setting_value as { glance_image?: string; glance_text?: string } | null;
    },
  });

  const image = settings?.glance_image || defaultContent.image;
  const text = settings?.glance_text || defaultContent.text;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img
                src={image}
                alt="SSTU Campus"
                className="w-full h-80 object-cover"
              />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-sm text-gold font-semibold uppercase tracking-wider mb-2">
              About the University
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              SSTU - At a Glance
            </h2>
            {text.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="text-muted-foreground leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
            <Link to="/about">
              <Button className="bg-primary hover:bg-primary/90 group">
                Read more
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
