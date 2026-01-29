import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Building2, Users, GraduationCap, Award, BookOpen, Briefcase } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface StatItem {
  icon: LucideIcon;
  value: number;
  label: string;
  color: string;
}

interface CounterProps {
  end: number;
  duration?: number;
}

const Counter = ({ end, duration = 2000 }: CounterProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView || end === 0) {
      if (end === 0) setCount(0);
      return;
    }

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

  return <span ref={ref}>{count}</span>;
};

export const StatsSection = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  // Fetch dynamic stats from database
  const { data: dynamicStats } = useQuery({
    queryKey: ['public-stats'],
    queryFn: async () => {
      // Fetch basic counts in parallel
      const [
        { count: facultyCount },
        { count: deptCount },
      ] = await Promise.all([
        supabase.from('faculties').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('departments').select('*', { count: 'exact', head: true }).eq('is_active', true),
      ]);

      // Fetch user role counts
      const { data: studentRoles } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'student');
      
      const { data: teacherRoles } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'teacher');

      // Count active verified teachers
      let teacherCount = 0;
      if (teacherRoles && teacherRoles.length > 0) {
        const teacherUserIds = teacherRoles.map(r => r.user_id);
        const { count } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .in('user_id', teacherUserIds)
          .eq('is_active', true)
          .eq('is_verified', true);
        teacherCount = count || 0;
      }

      // Count active students
      let studentCount = 0;
      if (studentRoles && studentRoles.length > 0) {
        const studentUserIds = studentRoles.map(r => r.user_id);
        const { count } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .in('user_id', studentUserIds)
          .eq('is_active', true);
        studentCount = count || 0;
      }

      return {
        faculties: facultyCount || 0,
        departments: deptCount || 0,
        students: studentCount,
        teachers: teacherCount,
        graduates: 0, // Can be managed via site_settings in future
        institutes: 0, // Can be managed via site_settings in future
        staffs: 27, // Can be managed via site_settings in future
      };
    },
  });

  const stats: StatItem[] = [
    { icon: Building2, value: dynamicStats?.faculties || 0, label: 'Faculties', color: 'text-blue-500' },
    { icon: BookOpen, value: dynamicStats?.departments || 0, label: 'Departments', color: 'text-green-500' },
    { icon: GraduationCap, value: dynamicStats?.students || 0, label: 'Students', color: 'text-orange-500' },
    { icon: Award, value: dynamicStats?.graduates || 0, label: 'Graduates', color: 'text-purple-500' },
    { icon: Building2, value: dynamicStats?.institutes || 0, label: 'Institutes', color: 'text-pink-500' },
    { icon: Users, value: dynamicStats?.teachers || 0, label: 'Teachers', color: 'text-cyan-500' },
    { icon: Briefcase, value: dynamicStats?.staffs || 0, label: 'Staffs', color: 'text-amber-500' },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto" ref={containerRef}>
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Description */}
          <div className="lg:col-span-4">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
              SSTU AT A GLANCE
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Sunamgonj Science and Technology University is a prominent 
              university of Bangladesh. It is situated alongside the Chittagong-Sylhet 
              Highway, about 25km away from Sylhet, Bangladesh.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.slice(0, 4).map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center"
                >
                  <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                  <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                    <Counter end={stat.value} />
                  </div>
                  <p className="text-muted-foreground text-sm font-medium">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {stats.slice(4).map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: (idx + 4) * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center"
                >
                  <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                  <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                    <Counter end={stat.value} />
                  </div>
                  <p className="text-muted-foreground text-sm font-medium">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
