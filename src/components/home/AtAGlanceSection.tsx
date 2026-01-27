import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const AtAGlanceSection = () => {
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
                src="https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80"
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
            <p className="text-muted-foreground leading-relaxed mb-4">
              Shaikh Burhanuddin Science and Technology University (SSTU) is one of the 
              leading public universities in Bangladesh, established with a vision to 
              provide quality higher education and contribute to the nation's development 
              through research and innovation.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              The university is situated alongside the Chittagong-Sylhet Highway, about 25km away 
              from the Sylhet city. SSTU is taking important initiatives to benefit the 
              development of engineering and allied sciences among the national and 
              international universities.
            </p>
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
