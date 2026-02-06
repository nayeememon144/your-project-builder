import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { MainLayout } from '@/components/layout/MainLayout';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Mail, Phone, ExternalLink, Search } from 'lucide-react';

const Teachers = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  useEffect(() => {
    setSearchQuery(initialSearch);
  }, [initialSearch]);

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

  // Filter teachers based on search query
  const filteredTeachers = teachers?.filter(teacher => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      teacher.full_name?.toLowerCase().includes(query) ||
      teacher.designation?.toLowerCase().includes(query) ||
      teacher.email?.toLowerCase().includes(query) ||
      (teacher.departments as any)?.name?.toLowerCase().includes(query)
    );
  });

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-primary text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h1 className="font-formal text-4xl md:text-5xl font-bold mb-4">
            Faculty Members
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mb-6">
            Meet our distinguished faculty members who are dedicated to academic excellence and research
          </p>
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, title, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 pl-12 pr-4 bg-white text-foreground rounded-full border-0 shadow-lg"
            />
          </div>
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
          ) : filteredTeachers && filteredTeachers.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTeachers.map((teacher) => (
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
