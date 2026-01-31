import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  User, 
  FileText, 
  Bell, 
  Settings,
  Plus,
  Search,
  Award,
  TrendingUp,
  Edit
} from 'lucide-react';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { ChangePasswordForm } from '@/components/teacher/ChangePasswordForm';
import { PublicationForm } from '@/components/teacher/PublicationForm';
import { TeacherProfileForm } from '@/components/teacher/TeacherProfileForm';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type ResearchPaper = Tables<'research_papers'>;

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showPublicationForm, setShowPublicationForm] = useState(false);
  const [editingPublication, setEditingPublication] = useState<ResearchPaper | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Get current user's profile
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['teacher-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select(`*, departments(name, short_name), faculties(name)`)
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  // Get publications for this teacher
  const { data: publications = [], isLoading: pubsLoading } = useQuery({
    queryKey: ['teacher-publications', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];
      
      const { data, error } = await supabase
        .from('research_papers')
        .select('*')
        .eq('teacher_id', profile.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ResearchPaper[];
    },
    enabled: !!profile?.id,
  });

  // Calculate dynamic stats
  const stats = {
    totalPublications: publications.length,
    totalCitations: publications.reduce((sum, p) => sum + (p.citation_count || 0), 0),
    pendingReviews: publications.filter(p => p.status === 'pending').length,
    publishedCount: publications.filter(p => p.status === 'published').length,
  };

  const statCards = [
    { label: 'Total Publications', value: stats.totalPublications, icon: FileText, color: 'bg-blue-500' },
    { label: 'Total Citations', value: stats.totalCitations, icon: TrendingUp, color: 'bg-green-500' },
    { label: 'Pending Reviews', value: stats.pendingReviews, icon: Bell, color: 'bg-orange-500' },
    { label: 'Published', value: stats.publishedCount, icon: Award, color: 'bg-purple-500' },
  ];

  const filteredPublications = publications.filter(pub =>
    pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pub.journal_conference_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditPublication = (pub: ResearchPaper) => {
    setEditingPublication(pub);
    setShowPublicationForm(true);
  };

  const handleAddNew = () => {
    setEditingPublication(null);
    setShowPublicationForm(true);
  };

  if (profileLoading) {
    return (
      <PortalLayout portalName="Teacher Portal" loginPath="/teacher/login">
        <div className="min-h-screen py-8">
          <div className="container mx-auto px-4">
            <Skeleton className="h-10 w-64 mb-4" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24" />)}
            </div>
          </div>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout portalName="Teacher Portal" loginPath="/teacher/login">
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold">Teacher Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {profile?.full_name || 'Teacher'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => setActiveTab('security')}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {statCards.map((stat, idx) => (
              <Card key={idx}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="publications">Publications</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Publications */}
                <Card className="lg:col-span-2">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Recent Publications</CardTitle>
                    <Button size="sm" onClick={handleAddNew}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add New
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {pubsLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map(i => <Skeleton key={i} className="h-20" />)}
                      </div>
                    ) : publications.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No publications yet</p>
                        <Button className="mt-4" onClick={handleAddNew}>
                          Add Your First Publication
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {publications.slice(0, 5).map((pub) => (
                          <div key={pub.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                            <h4 className="font-semibold mb-1 line-clamp-2">{pub.title}</h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              {pub.journal_conference_name || 'No journal specified'} • {pub.publication_date ? new Date(pub.publication_date).getFullYear() : 'N/A'}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className={`px-2 py-0.5 rounded-full text-xs ${
                                pub.status === 'published' 
                                  ? 'bg-green-100 text-green-700' 
                                  : pub.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}>
                                {pub.status}
                              </span>
                              <span className="text-muted-foreground">{pub.citation_count || 0} citations</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Profile Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Profile</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                        {profile?.profile_photo ? (
                          <img src={profile.profile_photo} alt={profile.full_name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-12 h-12 text-primary" />
                        )}
                      </div>
                      <h3 className="font-semibold text-lg">{profile?.full_name}</h3>
                      <p className="text-muted-foreground text-sm">{profile?.designation || 'Teacher'}</p>
                      <p className="text-muted-foreground text-sm">
                        {(profile?.departments as any)?.name ? `Dept. of ${(profile?.departments as any).name}` : 'No department'}
                      </p>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Employee ID</span>
                        <span className="font-medium">{profile?.employee_id || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email</span>
                        <span className="font-medium text-xs">{profile?.email || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Publications</span>
                        <span className="font-medium">{stats.totalPublications}</span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full mt-4"
                      onClick={() => setActiveTab('profile')}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="publications">
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <CardTitle>My Publications</CardTitle>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                          placeholder="Search publications..." 
                          className="pl-9 w-64"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <Button onClick={handleAddNew}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Publication
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {pubsLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => <Skeleton key={i} className="h-24" />)}
                    </div>
                  ) : filteredPublications.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      {searchQuery ? 'No publications match your search' : 'No publications yet. Add your first publication!'}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredPublications.map((pub) => (
                        <div key={pub.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                          <h4 className="font-semibold mb-1">{pub.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {pub.authors?.join(', ')}
                          </p>
                          <p className="text-sm text-muted-foreground mb-2">
                            {pub.journal_conference_name || 'No journal'} • {pub.publication_date ? new Date(pub.publication_date).getFullYear() : 'N/A'}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm">
                              <span className={`px-2 py-0.5 rounded-full text-xs ${
                                pub.status === 'published' 
                                  ? 'bg-green-100 text-green-700' 
                                  : pub.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}>
                                {pub.status}
                              </span>
                              <span className="text-muted-foreground">{pub.citation_count || 0} citations</span>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditPublication(pub)}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile">
              <TeacherProfileForm profile={profile} />
            </TabsContent>

            <TabsContent value="security">
              <ChangePasswordForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Publication Form Dialog */}
      {profile && (
        <PublicationForm
          open={showPublicationForm}
          onOpenChange={(open) => {
            setShowPublicationForm(open);
            if (!open) setEditingPublication(null);
          }}
          publication={editingPublication}
          teacherId={profile.id}
        />
      )}
    </PortalLayout>
  );
};

export default TeacherDashboard;
