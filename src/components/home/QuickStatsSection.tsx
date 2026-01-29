import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { GraduationCap, Users, Building2, BookOpen, Award, Globe } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  GraduationCap,
  Users,
  Building2,
  BookOpen,
  Award,
  Globe,
};

interface CounterProps {
  end: number;
  duration?: number;
}

const Counter = ({ end, duration = 2000 }: CounterProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    const startValue = 0;
    
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(startValue + (end - startValue) * easeOutQuart));
      
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [end, duration, isInView]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
};

export const QuickStatsSection = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  // Fetch dynamic counts
  const { data: counts } = useQuery({
    queryKey: ['dynamic-counts'],
    queryFn: async () => {
      const [
        { count: facultyCount },
        { count: departmentCount },
        { count: programCount },
        { count: teacherCount },
        { count: researchCount },
      ] = await Promise.all([
        supabase.from('faculties').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('departments').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('programs').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('profiles').select('*, user_roles!inner(role)', { count: 'exact', head: true })
          .eq('user_roles.role', 'teacher')
          .eq('is_active', true),
        supabase.from('research_papers').select('*', { count: 'exact', head: true }).eq('status', 'published'),
      ]);

      return {
        faculties: facultyCount || 0,
        departments: departmentCount || 0,
        programs: programCount || 0,
        teachers: teacherCount || 0,
        research: researchCount || 0,
      };
    },
  });

  // Fetch quick stats from database (admin configurable)
  const { data: quickStats } = useQuery({
    queryKey: ['quick-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quick_stats')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  // Merge database stats with dynamic counts
  const stats = quickStats?.map(stat => {
    let value = stat.value;
    
    // Override with dynamic counts for specific labels
    if (stat.label.toLowerCase().includes('department') && counts?.departments) {
      value = counts.departments;
    } else if (stat.label.toLowerCase().includes('facult') && counts?.faculties) {
      value = counts.faculties;
    } else if (stat.label.toLowerCase().includes('program') && counts?.programs) {
      value = counts.programs;
    } else if (stat.label.toLowerCase().includes('teacher') || stat.label.toLowerCase().includes('faculty member')) {
      value = counts?.teachers || stat.value;
    } else if (stat.label.toLowerCase().includes('research')) {
      value = counts?.research || stat.value;
    }

    const IconComponent = stat.icon && iconMap[stat.icon] ? iconMap[stat.icon] : Building2;
    
    return {
      ...stat,
      value,
      icon: IconComponent,
    };
  }) || [
    // Default stats if none configured
    { label: 'Students', value: 8500, icon: GraduationCap },
    { label: 'Faculty Members', value: counts?.teachers || 350, icon: Users },
    { label: 'Departments', value: counts?.departments || 4, icon: Building2 },
    { label: 'Programs', value: counts?.programs || 8, icon: BookOpen },
    { label: 'Research Papers', value: counts?.research || 0, icon: Award },
    { label: 'Faculties', value: counts?.faculties || 2, icon: Globe },
  ];

  return (
    <section className="py-20 bg-primary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto relative z-10" ref={containerRef}>
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            SSTU at a Glance
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto">
            Our commitment to excellence is reflected in our numbers
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map((stat, idx) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="text-center group"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-gold group-hover:scale-110 transition-all duration-300">
                  <IconComponent className="w-8 h-8 text-gold group-hover:text-primary transition-colors" />
                </div>
                <div className="stat-number text-4xl md:text-5xl mb-2">
                  <Counter end={stat.value} />
                  <span className="text-2xl">+</span>
                </div>
                <p className="text-white/80 text-sm font-medium uppercase tracking-wider">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
