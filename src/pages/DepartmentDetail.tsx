import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MainLayout } from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Home, 
  BookOpen, 
  Users, 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin,
  FileText,
  Download,
  GraduationCap
} from 'lucide-react';

interface Department {
  id: string;
  name: string;
  name_bn: string | null;
  short_name: string | null;
  description: string | null;
  description_bn: string | null;
  vision: string | null;
  mission: string | null;
  head_id: string | null;
  head_message: string | null;
  head_message_bn: string | null;
  syllabus_content: string | null;
  syllabus_content_bn: string | null;
  syllabus_pdf_url: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  office_location: string | null;
  established_year: number | null;
  faculties: { name: string } | null;
}

interface Teacher {
  id: string;
  user_id: string;
  full_name: string;
  full_name_bn: string | null;
  designation: string | null;
  profile_photo: string | null;
  email: string | null;
  phone: string | null;
  areas_of_interest: string[] | null;
}

const designationOrder = [
  'Professor',
  'Associate Professor',
  'Assistant Professor',
  'Lecturer',
  'Senior Lecturer',
  'Junior Lecturer'
];

const DepartmentDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: department, isLoading: deptLoading } = useQuery({
    queryKey: ['department-detail', slug],
    queryFn: async () => {
      // Try to find by short_name first, then by id
      let query = supabase
        .from('departments')
        .select('*, faculties(name)')
        .eq('is_active', true);

      // Check if slug looks like a UUID
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug || '');
      
      if (isUUID) {
        query = query.eq('id', slug);
      } else {
        query = query.ilike('short_name', slug || '');
      }

      const { data, error } = await query.single();
      if (error) throw error;
      return data as Department;
    },
    enabled: !!slug,
  });

  const { data: teachers, isLoading: teachersLoading } = useQuery({
    queryKey: ['department-teachers', department?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, user_id, full_name, full_name_bn, designation, profile_photo, email, phone, areas_of_interest')
        .eq('department_id', department?.id)
        .eq('is_active', true)
        .eq('is_verified', true);

      if (error) throw error;

      // Filter only teachers by checking user_roles
      const teacherProfiles: Teacher[] = [];
      for (const profile of data || []) {
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', profile.user_id)
          .eq('role', 'teacher')
          .single();

        if (roleData) {
          teacherProfiles.push(profile as Teacher);
        }
      }

      return teacherProfiles;
    },
    enabled: !!department?.id,
  });

  const { data: headTeacher } = useQuery({
    queryKey: ['department-head', department?.head_id],
    queryFn: async () => {
      if (!department?.head_id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('id, user_id, full_name, full_name_bn, designation, profile_photo, email')
        .eq('user_id', department.head_id)
        .single();

      if (error) return null;
      return data;
    },
    enabled: !!department?.head_id,
  });

  // Group teachers by designation
  const groupedTeachers = teachers?.reduce((acc, teacher) => {
    const designation = teacher.designation || 'Other';
    if (!acc[designation]) {
      acc[designation] = [];
    }
    acc[designation].push(teacher);
    return acc;
  }, {} as Record<string, Teacher[]>) || {};

  // Sort designations by order
  const sortedDesignations = Object.keys(groupedTeachers).sort((a, b) => {
    const indexA = designationOrder.findIndex(d => a.toLowerCase().includes(d.toLowerCase()));
    const indexB = designationOrder.findIndex(d => b.toLowerCase().includes(d.toLowerCase()));
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  if (deptLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16">
          <Skeleton className="h-12 w-64 mb-4" />
          <Skeleton className="h-6 w-96 mb-8" />
          <Skeleton className="h-64 w-full" />
        </div>
      </MainLayout>
    );
  }

  if (!department) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Department Not Found</h1>
          <Link to="/departments">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Departments
            </Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-primary text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <Link to="/departments" className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            All Departments
          </Link>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            {department.name}
          </h1>
          {department.name_bn && (
            <p className="bengali text-white/80 text-lg mb-4">{department.name_bn}</p>
          )}
          {department.faculties && (
            <p className="text-white/70">
              <GraduationCap className="inline w-4 h-4 mr-1" />
              {department.faculties.name}
            </p>
          )}
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="home" className="w-full">
            <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-flex mb-8">
              <TabsTrigger value="home" className="gap-2">
                <Home className="w-4 h-4 hidden md:block" />
                Home
              </TabsTrigger>
              <TabsTrigger value="syllabus" className="gap-2">
                <BookOpen className="w-4 h-4 hidden md:block" />
                Syllabus
              </TabsTrigger>
              <TabsTrigger value="faculty" className="gap-2">
                <Users className="w-4 h-4 hidden md:block" />
                Faculty
              </TabsTrigger>
              <TabsTrigger value="back" asChild>
                <Link to="/" className="gap-2">
                  <ArrowLeft className="w-4 h-4 hidden md:block" />
                  Main Home
                </Link>
              </TabsTrigger>
            </TabsList>

            {/* Home Tab */}
            <TabsContent value="home" className="space-y-8">
              {/* Department Head Message */}
              <Card>
                <CardContent className="p-6 md:p-8">
                  <h2 className="font-display text-2xl font-bold mb-6 text-primary">
                    Message from Department Head
                  </h2>
                  
                  <div className="flex flex-col md:flex-row gap-6">
                    {headTeacher ? (
                      <div className="flex-shrink-0 text-center">
                        <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-primary/20">
                          <AvatarImage src={headTeacher.profile_photo || ''} alt={headTeacher.full_name} />
                          <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                            {headTeacher.full_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="font-semibold text-lg">{headTeacher.full_name}</h3>
                        <p className="text-muted-foreground text-sm">{headTeacher.designation}</p>
                        <p className="text-muted-foreground text-sm">Department Head</p>
                      </div>
                    ) : (
                      <div className="flex-shrink-0 text-center">
                        <div className="w-32 h-32 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                          <Users className="w-12 h-12 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground text-sm">Department Head</p>
                      </div>
                    )}

                    <div className="flex-1">
                      {department.head_message ? (
                        <div className="prose prose-sm max-w-none">
                          <p className="text-muted-foreground whitespace-pre-wrap">
                            {department.head_message}
                          </p>
                        </div>
                      ) : (
                        <p className="text-muted-foreground italic">
                          Welcome to the Department of {department.name}. We are committed to excellence in education and research.
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Department Info */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* About */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-display text-xl font-bold mb-4">About the Department</h3>
                    {department.description ? (
                      <p className="text-muted-foreground whitespace-pre-wrap">{department.description}</p>
                    ) : (
                      <p className="text-muted-foreground italic">Department information coming soon.</p>
                    )}
                    
                    {department.established_year && (
                      <p className="mt-4 text-sm">
                        <span className="font-medium">Established:</span> {department.established_year}
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Contact */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-display text-xl font-bold mb-4">Contact Information</h3>
                    <div className="space-y-3">
                      {department.contact_email && (
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-primary" />
                          <a href={`mailto:${department.contact_email}`} className="text-muted-foreground hover:text-primary">
                            {department.contact_email}
                          </a>
                        </div>
                      )}
                      {department.contact_phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-primary" />
                          <span className="text-muted-foreground">{department.contact_phone}</span>
                        </div>
                      )}
                      {department.office_location && (
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-primary" />
                          <span className="text-muted-foreground">{department.office_location}</span>
                        </div>
                      )}
                      {!department.contact_email && !department.contact_phone && !department.office_location && (
                        <p className="text-muted-foreground italic">Contact information not available.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Vision */}
                {department.vision && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-display text-xl font-bold mb-4">Vision</h3>
                      <p className="text-muted-foreground whitespace-pre-wrap">{department.vision}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Mission */}
                {department.mission && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-display text-xl font-bold mb-4">Mission</h3>
                      <p className="text-muted-foreground whitespace-pre-wrap">{department.mission}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Syllabus Tab */}
            <TabsContent value="syllabus" className="space-y-6">
              <Card>
                <CardContent className="p-6 md:p-8">
                  <h2 className="font-display text-2xl font-bold mb-6 text-primary">
                    Academic Syllabus
                  </h2>

                  {department.syllabus_pdf_url && (
                    <div className="mb-6">
                      <a 
                        href={department.syllabus_pdf_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <Button className="gap-2">
                          <Download className="w-4 h-4" />
                          Download Syllabus PDF
                        </Button>
                      </a>
                    </div>
                  )}

                  {department.syllabus_content ? (
                    <div className="prose prose-sm max-w-none">
                      <div className="whitespace-pre-wrap text-muted-foreground">
                        {department.syllabus_content}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Syllabus Coming Soon</h3>
                      <p className="text-muted-foreground">
                        The academic syllabus for this department is being updated. Please check back later.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Faculty Tab */}
            <TabsContent value="faculty" className="space-y-8">
              {teachersLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, idx) => (
                    <Skeleton key={idx} className="h-48" />
                  ))}
                </div>
              ) : sortedDesignations.length > 0 ? (
                sortedDesignations.map((designation) => (
                  <div key={designation}>
                    <h3 className="font-display text-xl font-bold mb-4 text-primary border-b pb-2">
                      {designation}s
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {groupedTeachers[designation].map((teacher) => (
                        <Link key={teacher.id} to={`/teachers/${teacher.user_id}`}>
                          <Card className="hover:shadow-lg transition-all group h-full">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-4">
                                <Avatar className="w-16 h-16 border-2 border-primary/20">
                                  <AvatarImage src={teacher.profile_photo || ''} alt={teacher.full_name} />
                                  <AvatarFallback className="bg-primary text-primary-foreground">
                                    {teacher.full_name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold group-hover:text-primary transition-colors truncate">
                                    {teacher.full_name}
                                  </h4>
                                  {teacher.full_name_bn && (
                                    <p className="bengali text-sm text-muted-foreground truncate">
                                      {teacher.full_name_bn}
                                    </p>
                                  )}
                                  <p className="text-sm text-muted-foreground">{teacher.designation}</p>
                                  {teacher.email && (
                                    <p className="text-xs text-muted-foreground truncate mt-1">
                                      {teacher.email}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Faculty Coming Soon</h3>
                  <p className="text-muted-foreground">
                    Faculty information for this department is being updated.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </MainLayout>
  );
};

export default DepartmentDetail;
