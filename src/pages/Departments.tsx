import { MainLayout } from '@/components/layout/MainLayout';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Building2, Users, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const Departments = () => {
  const { data: departments, isLoading } = useQuery({
    queryKey: ['departments-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('*, faculties(name)')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-primary text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Departments
          </h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Explore our academic departments and their programs
          </p>
        </div>
      </section>

      {/* Departments Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, idx) => (
                <Skeleton key={idx} className="h-48 rounded-xl" />
              ))}
            </div>
          ) : departments && departments.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {departments.map((dept) => (
                <Link key={dept.id} to={`/departments/${dept.short_name?.toLowerCase() || dept.id}`}>
                  <div className="bg-card rounded-xl p-6 border hover:shadow-lg transition-all group h-full">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Building2 className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-display text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {dept.name}
                    </h3>
                    {dept.name_bn && (
                      <p className="bengali text-muted-foreground text-sm mb-3">
                        {dept.name_bn}
                      </p>
                    )}
                    {dept.faculties && (
                      <p className="text-sm text-muted-foreground mb-4">
                        {(dept.faculties as { name: string }).name}
                      </p>
                    )}
                    <div className="flex items-center text-primary text-sm font-medium">
                      View Department <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Building2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Departments Coming Soon</h3>
              <p className="text-muted-foreground">
                Department information is being updated. Please check back later.
              </p>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default Departments;
