import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const VCMessageSection = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-primary via-primary to-primary/95">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* VC Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0"
          >
            <div className="w-48 h-48 md:w-56 md:h-56 rounded-full border-4 border-gold overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80"
                alt="Vice Chancellor"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Message Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1 text-center lg:text-left"
          >
            <h3 className="text-gold text-sm font-semibold uppercase tracking-wider mb-2">
              Message from
            </h3>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">
              MESSAGE FROM VICE-CHANCELLOR
            </h2>
            <p className="text-white/90 leading-relaxed mb-6 max-w-3xl">
              I am delighted to welcome you all to the official website of Sunamgonj 
              Science and Technology University. The university will award you not only academic 
              degrees but will enrich you culturally, professionally, and morally. I am proud to 
              say that SSTU is dedicated to nurturing innovative minds and contributing to the 
              nation's development through quality education and research.
            </p>
            <Link to="/about/vice-chancellor">
              <Button className="bg-gold text-primary hover:bg-gold/90 group font-semibold">
                Read More
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
