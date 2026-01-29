import { useParams, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Clock, BookOpen, GraduationCap, Building2, ChevronLeft, Users, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Program = {
  id: string;
  name: string;
  name_bn: string | null;
  degree_type: string;
  duration_years: number | null;
  total_credits: number | null;
  description: string | null;
  admission_requirements: string | null;
  career_opportunities: string | null;
  department_id: string | null;
};

type Department = {
  id: string;
  name: string;
  short_name: string | null;
};

const ProgramDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: program, isLoading, error } = useQuery({
    queryKey: ['program', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();
      
      if (error) throw error;
      return data as Program;
    },
    enabled: !!id,
  });

  const { data: department } = useQuery({
    queryKey: ['department', program?.department_id],
    queryFn: async () => {
      if (!program?.department_id) return null;
      const { data, error } = await supabase
        .from('departments')
        .select('id, name, short_name')
        .eq('id', program.department_id)
        .single();
      
      if (error) throw error;
      return data as Department;
    },
    enabled: !!program?.department_id,
  });

  const getDegreeLabel = (type: string) => {
    switch (type) {
      case 'undergraduate': return 'Undergraduate';
      case 'postgraduate': return 'Postgraduate';
      case 'doctoral': return 'Doctoral';
      case 'diploma': return 'Diploma';
      case 'certificate': return 'Certificate';
      default: return type;
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (error || !program) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
          <GraduationCap className="w-16 h-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Program Not Found</h1>
          <p className="text-muted-foreground mb-6">The program you're looking for doesn't exist or is no longer active.</p>
          <Link to="/academic">
            <Button>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Academic Programs
            </Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-primary text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Link to="/academic" className="inline-flex items-center text-white/70 hover:text-white mb-6 transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Academic Programs
          </Link>
          
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant="secondary" className="bg-gold text-primary">
              {getDegreeLabel(program.degree_type)}
            </Badge>
            {department && (
              <Badge variant="outline" className="border-white/30 text-white">
                {department.name}
              </Badge>
            )}
          </div>
          
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            {program.name}
          </h1>
          {program.name_bn && (
            <p className="text-white/70 text-xl">{program.name_bn}</p>
          )}
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-8 bg-muted/50 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-semibold">{program.duration_years || 4} Years</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Credits</p>
                <p className="font-semibold">{program.total_credits || 'N/A'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Degree Type</p>
                <p className="font-semibold">{getDegreeLabel(program.degree_type)}</p>
              </div>
            </div>
            
            {department && (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-semibold">{department.short_name || department.name}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {program.description && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-primary" />
                      Program Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-line">{program.description}</p>
                  </CardContent>
                </Card>
              )}

              {program.admission_requirements && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Admission Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-line">{program.admission_requirements}</p>
                  </CardContent>
                </Card>
              )}

              {program.career_opportunities && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-primary" />
                      Career Opportunities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-line">{program.career_opportunities}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="bg-primary text-white">
                <CardContent className="p-6">
                  <h3 className="font-display text-xl font-bold mb-4">Ready to Apply?</h3>
                  <p className="text-white/80 mb-6">
                    Start your journey in {program.name} at SSTU today.
                  </p>
                  <Link to="/admission">
                    <Button className="w-full bg-gold text-primary hover:bg-gold/90">
                      Apply Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {department && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3">Offered By</h3>
                    <Link 
                      to={`/departments/${department.short_name?.toLowerCase() || department.id}`}
                      className="text-primary hover:underline"
                    >
                      {department.name}
                    </Link>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">Need More Information?</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Contact our admissions office for detailed information about this program.
                  </p>
                  <Link to="/contact">
                    <Button variant="outline" className="w-full">
                      Contact Us
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default ProgramDetail;
