import { useState } from 'react';
import { 
  User, 
  BookOpen, 
  FileText, 
  Bell, 
  Settings,
  Plus,
  Search,
  Award,
  TrendingUp,
  Lock
} from 'lucide-react';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChangePasswordForm } from '@/components/teacher/ChangePasswordForm';

const mockPublications = [
  {
    id: 1,
    title: 'Machine Learning Applications in Agricultural Yield Prediction',
    journal: 'International Journal of AI',
    year: 2024,
    status: 'published',
    citations: 12,
  },
  {
    id: 2,
    title: 'IoT-based Water Quality Monitoring System',
    journal: 'Journal of Environmental Technology',
    year: 2023,
    status: 'published',
    citations: 8,
  },
  {
    id: 3,
    title: 'Deep Learning for Bengali Text Classification',
    journal: 'Computational Linguistics Review',
    year: 2024,
    status: 'pending',
    citations: 0,
  },
];

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Total Publications', value: '15', icon: FileText, color: 'bg-blue-500' },
    { label: 'Total Citations', value: '156', icon: TrendingUp, color: 'bg-green-500' },
    { label: 'Pending Reviews', value: '3', icon: Bell, color: 'bg-orange-500' },
    { label: 'Awards', value: '2', icon: Award, color: 'bg-purple-500' },
  ];

  return (
    <PortalLayout portalName="Teacher Portal" loginPath="/teacher/login">
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold">Teacher Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, Dr. Mohammad Rahman</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, idx) => (
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
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add New
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockPublications.map((pub) => (
                        <div key={pub.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                          <h4 className="font-semibold mb-1">{pub.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {pub.journal} • {pub.year}
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              pub.status === 'published' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {pub.status}
                            </span>
                            <span className="text-muted-foreground">{pub.citations} citations</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Profile Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Profile</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-12 h-12 text-primary" />
                      </div>
                      <h3 className="font-semibold text-lg">Dr. Mohammad Rahman</h3>
                      <p className="text-muted-foreground text-sm">Associate Professor</p>
                      <p className="text-muted-foreground text-sm">Dept. of Computer Science</p>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Employee ID</span>
                        <span className="font-medium">SSTU-T-001</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Joined</span>
                        <span className="font-medium">January 2021</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">h-index</span>
                        <span className="font-medium">8</span>
                      </div>
                    </div>
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
                        <Input placeholder="Search publications..." className="pl-9 w-64" />
                      </div>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Publication
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockPublications.map((pub) => (
                      <div key={pub.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <h4 className="font-semibold mb-1">{pub.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {pub.journal} • {pub.year}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm">
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              pub.status === 'published' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {pub.status}
                            </span>
                            <span className="text-muted-foreground">{pub.citations} citations</span>
                          </div>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Edit Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6 max-w-2xl">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Full Name</label>
                        <Input defaultValue="Dr. Mohammad Rahman" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Designation</label>
                        <Input defaultValue="Associate Professor" />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <Input type="email" defaultValue="rahman@sstu.ac.bd" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Phone</label>
                        <Input defaultValue="+880-1234-567890" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Research Areas</label>
                      <Input defaultValue="Machine Learning, Natural Language Processing, IoT" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Google Scholar URL</label>
                      <Input placeholder="https://scholar.google.com/..." />
                    </div>
                    <Button>Save Changes</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <ChangePasswordForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PortalLayout>
  );
};

export default TeacherDashboard;
