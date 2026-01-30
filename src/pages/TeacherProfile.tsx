import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Mail, 
  Phone, 
  MapPin, 
  BookOpen, 
  GraduationCap, 
  Award,
  ExternalLink,
  FileText
} from 'lucide-react';

const TeacherProfile = () => {
  const { id } = useParams<{ id: string }>();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['teacher-profile', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          departments(name, short_name),
          faculties(name)
        `)
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: publications, isLoading: pubsLoading } = useQuery({
    queryKey: ['teacher-publications', id],
    queryFn: async () => {
      if (!id) return [];
      const { data, error } = await supabase
        .from('research_papers')
        .select('*')
        .eq('teacher_id', id)
        .eq('status', 'published')
        .order('publication_date', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (profileLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-48 w-full mb-6" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!profile) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Teacher Not Found</h1>
            <p className="text-muted-foreground mt-2">The requested profile could not be found.</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-center md:items-start">
            {/* Profile Photo */}
            <div className="w-40 h-40 rounded-full bg-white/10 border-4 border-gold flex items-center justify-center overflow-hidden flex-shrink-0">
              {profile.profile_photo ? (
                <img 
                  src={profile.profile_photo} 
                  alt={profile.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-5xl font-bold text-gold">
                  {profile.full_name?.charAt(0)}
                </span>
              )}
            </div>

            {/* Profile Info */}
            <div className="text-center md:text-left">
              <h1 className="font-formal text-3xl md:text-4xl font-bold mb-2">
                {profile.full_name}
              </h1>
              {profile.full_name_bn && (
                <p className="text-white/80 bengali text-lg mb-2">{profile.full_name_bn}</p>
              )}
              {profile.designation && (
                <p className="text-gold font-semibold text-lg">{profile.designation}</p>
              )}
              {profile.departments && (
                <p className="text-white/70 mt-1">
                  Department of {(profile.departments as any).name}
                </p>
              )}
              {profile.faculties && (
                <p className="text-white/60 text-sm">
                  {(profile.faculties as any).name}
                </p>
              )}

              {/* Contact Info */}
              <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
                {profile.email && (
                  <a href={`mailto:${profile.email}`} className="flex items-center gap-2 text-white/80 hover:text-gold transition-colors">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{profile.email}</span>
                  </a>
                )}
                {profile.phone && (
                  <a href={`tel:${profile.phone}`} className="flex items-center gap-2 text-white/80 hover:text-gold transition-colors">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{profile.phone}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid gap-6">
            {/* Academic Background */}
            {profile.academic_background && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-formal">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    Academic Background
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-line">{profile.academic_background}</p>
                </CardContent>
              </Card>
            )}

            {/* Areas of Interest */}
            {profile.areas_of_interest && profile.areas_of_interest.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-formal">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Research Interests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.areas_of_interest.map((interest: string, idx: number) => (
                      <Badge key={idx} variant="secondary">{interest}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Professional Experience */}
            {profile.professional_experience && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-formal">
                    <Award className="w-5 h-5 text-primary" />
                    Professional Experience
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-line">{profile.professional_experience}</p>
                </CardContent>
              </Card>
            )}

            {/* Research Links */}
            {(profile.google_scholar_url || profile.researchgate_url || profile.orcid_url) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-formal">
                    <ExternalLink className="w-5 h-5 text-primary" />
                    Research Profiles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4">
                    {profile.google_scholar_url && (
                      <a
                        href={profile.google_scholar_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Google Scholar
                      </a>
                    )}
                    {profile.researchgate_url && (
                      <a
                        href={profile.researchgate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        ResearchGate
                      </a>
                    )}
                    {profile.orcid_url && (
                      <a
                        href={profile.orcid_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        ORCID
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Publications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-formal">
                  <FileText className="w-5 h-5 text-primary" />
                  Research Publications
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pubsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : publications && publications.length > 0 ? (
                  <div className="space-y-4">
                    {publications.map((pub) => (
                      <div key={pub.id} className="border-l-4 border-gold pl-4 py-2">
                        <h4 className="font-semibold text-foreground">{pub.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {pub.authors?.join(', ')}
                        </p>
                        {pub.journal_conference_name && (
                          <p className="text-sm text-muted-foreground italic">
                            {pub.journal_conference_name}
                            {pub.publication_date && ` (${new Date(pub.publication_date).getFullYear()})`}
                          </p>
                        )}
                        <div className="flex gap-3 mt-2">
                          {pub.doi_link && (
                            <a
                              href={pub.doi_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline"
                            >
                              DOI
                            </a>
                          )}
                          {pub.pdf_url && (
                            <a
                              href={pub.pdf_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline"
                            >
                              PDF
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No publications available.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default TeacherProfile;
