import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Quote, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const VCMessageSection = () => {
  return (
    <section className="py-20 bg-secondary/50">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80"
                alt="Vice Chancellor"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gold rounded-full opacity-20 blur-2xl" />
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-accent rounded-full opacity-20 blur-3xl" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <Quote className="w-6 h-6 text-gold" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider">Message from</p>
                <h2 className="font-display text-2xl font-bold text-foreground">Vice Chancellor</h2>
              </div>
            </div>

            <blockquote className="text-lg md:text-xl text-foreground leading-relaxed mb-8">
              "SSTU stands as a beacon of academic excellence in Bangladesh. Our commitment to 
              nurturing innovation, fostering research, and developing leaders who will shape 
              the future of our nation remains unwavering. We believe in holistic education that 
              combines traditional values with modern knowledge, preparing our students to excel 
              in an ever-evolving global landscape."
            </blockquote>

            <div className="mb-8">
              <h3 className="font-display text-xl font-bold text-foreground">
                Prof. Dr. Mohammad Abdullah
              </h3>
              <p className="text-muted-foreground">
                Vice Chancellor, SSTU
              </p>
            </div>

            <Link to="/about/vice-chancellor">
              <Button className="bg-primary hover:bg-primary/90 group">
                Read Full Message
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
