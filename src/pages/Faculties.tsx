import { MainLayout } from '@/components/layout/MainLayout';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Building2, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const Faculties = () => {
  const { data: faculties, isLoading } = useQuery({
    queryKey: ['faculties-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('faculties')
        .select('*')
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
            Faculties
          </h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Our academic faculties offer diverse programs across multiple disciplines
          </p>
        </div>
      </section>

      {/* Faculties Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, idx) => (
                <Skeleton key={idx} className="h-64 rounded-xl" />
              ))}
            </div>
          ) : faculties && faculties.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {faculties.map((faculty) => (
                <Link key={faculty.id} to={`/faculties/${faculty.short_name?.toLowerCase() || faculty.id}`}>
                  <div className="bg-card rounded-xl overflow-hidden border hover:shadow-xl transition-all group h-full">
                    <div className="h-32 bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                      <Building2 className="w-16 h-16 text-white/80" />
                    </div>
                    <div className="p-6">
                      <h3 className="font-display text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {faculty.name}
                      </h3>
                      {faculty.name_bn && (
                        <p className="bengali text-muted-foreground text-sm mb-3">
                          {faculty.name_bn}
                        </p>
                      )}
                      {faculty.description && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {faculty.description}
                        </p>
                      )}
                      <div className="flex items-center text-primary text-sm font-medium">
                        Explore Faculty <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Building2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Faculties Coming Soon</h3>
              <p className="text-muted-foreground">
                Faculty information is being updated. Please check back later.
              </p>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default Faculties;
