import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MainLayout } from '@/components/layout/MainLayout';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Mail, Phone, ExternalLink } from 'lucide-react';

const Teachers = () => {
  const { data: teachers, isLoading } = useQuery({
    queryKey: ['public-teachers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          departments(name, short_name),
          faculties(name)
        `)
        .eq('is_active', true)
        .order('full_name', { ascending: true });
      
      if (error) throw error;
      
      // Filter to only get teacher profiles by joining with user_roles
      const { data: teacherRoles } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'teacher');
      
      const teacherUserIds = teacherRoles?.map(r => r.user_id) || [];
      return data?.filter(p => teacherUserIds.includes(p.user_id)) || [];
    },
  });

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-primary text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h1 className="font-formal text-4xl md:text-5xl font-bold mb-4">
            Faculty Members
          </h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Meet our distinguished faculty members who are dedicated to academic excellence and research
          </p>
        </div>
      </section>

      {/* Teachers Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, idx) => (
                <Skeleton key={idx} className="h-64 rounded-xl" />
              ))}
            </div>
          ) : teachers && teachers.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {teachers.map((teacher) => (
                <Link key={teacher.id} to={`/teachers/${teacher.id}`}>
                  <Card className="h-full hover:shadow-lg transition-all group">
                    <CardContent className="p-6 text-center">
                      {/* Profile Photo */}
                      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary/10 border-4 border-gold/30 flex items-center justify-center overflow-hidden group-hover:border-gold transition-colors">
                        {teacher.profile_photo ? (
                          <img 
                            src={teacher.profile_photo} 
                            alt={teacher.full_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-3xl font-bold text-primary">
                            {teacher.full_name?.charAt(0)}
                          </span>
                        )}
                      </div>

                      {/* Name & Designation */}
                      <h3 className="font-formal font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                        {teacher.full_name}
                      </h3>
                      {teacher.designation && (
                        <p className="text-gold text-sm font-medium mt-1">{teacher.designation}</p>
                      )}
                      {teacher.departments && (
                        <p className="text-muted-foreground text-sm mt-1">
                          {(teacher.departments as any).name}
                        </p>
                      )}

                      {/* Contact */}
                      <div className="mt-4 pt-4 border-t flex justify-center gap-4">
                        {teacher.email && (
                          <a
                            href={`mailto:${teacher.email}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                        )}
                        {teacher.phone && (
                          <a
                            href={`tel:${teacher.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                        )}
                        <span className="text-primary">
                          <ExternalLink className="w-4 h-4" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No faculty members found.</p>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default Teachers;
