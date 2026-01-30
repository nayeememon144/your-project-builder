import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  GraduationCap, 
  FileText, 
  Bell, 
  TrendingUp,
  Eye,
  Plus,
  ArrowRight,
  Building2,
  BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { EditableStatCard } from '@/components/admin/EditableStatCard';

interface StatCard {
  title: string;
  value: string | number;
  icon: React.ElementType;
  change?: string;
  changeType?: 'positive' | 'negative';
  href: string;
  color: string;
  statKey: string;
  isEditable: boolean;
}

const AdminDashboard = () => {
  // Fetch quick_stats from database (admin-editable values)
  const { data: quickStats } = useQuery({
    queryKey: ['admin-quick-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quick_stats')
        .select('*')
        .eq('is_active', true);
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch dynamic counts from database
  const { data: stats } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      const { data: publicStats } = await supabase.rpc('get_public_stats');
      const { count: noticeCount } = await supabase
        .from('notices')
        .select('*', { count: 'exact', head: true });

      const dbStats = publicStats as {
        departments: number;
        faculties: number;
        students: number;
        teachers: number;
        all_teachers: number;
      } | null;

      return {
        totalNotices: noticeCount || 0,
        totalDepartments: dbStats?.departments || 0,
        totalFaculties: dbStats?.faculties || 0,
        totalStudents: dbStats?.students || 0,
        totalTeachers: dbStats?.teachers || 0,
      };
    },
  });

  // Get quick_stats value for a key, or fallback to dynamic count
  const getStatValue = (key: string, dynamicValue: number) => {
    const quickStat = quickStats?.find(s => s.label === key);
    return quickStat?.value ?? dynamicValue;
  };

  const statCards: StatCard[] = [
    {
      title: 'Total Students',
      value: getStatValue('Students', stats?.totalStudents || 0),
      icon: GraduationCap,
      change: '+12%',
      changeType: 'positive',
      href: '/admin/students',
      color: 'bg-blue-500',
      statKey: 'Students',
      isEditable: true,
    },
    {
      title: 'Verified Teachers',
      value: stats?.totalTeachers || 0,
      icon: Users,
      change: '+3',
      changeType: 'positive',
      href: '/admin/teachers',
      color: 'bg-green-500',
      statKey: 'Teachers',
      isEditable: false, // Dynamic count from verified teachers
    },
    {
      title: 'Total Notices',
      value: stats?.totalNotices || 0,
      icon: Bell,
      href: '/admin/notices',
      color: 'bg-orange-500',
      statKey: 'Notices',
      isEditable: false, // Dynamic count
    },
    {
      title: 'Departments',
      value: stats?.totalDepartments || 0,
      icon: Building2,
      href: '/admin/departments',
      color: 'bg-purple-500',
      statKey: 'Departments',
      isEditable: false, // Dynamic count
    },
  ];

  const quickActions = [
    { label: 'Add Notice', icon: Bell, href: '/admin/notices/new', color: 'bg-blue-500' },
    { label: 'Add News', icon: FileText, href: '/admin/news/new', color: 'bg-green-500' },
    { label: 'Add Teacher', icon: Users, href: '/admin/teachers/new', color: 'bg-orange-500' },
    { label: 'Add Student', icon: GraduationCap, href: '/admin/students/new', color: 'bg-purple-500' },
  ];

  const recentActivities = [
    { action: 'New notice published', time: '2 hours ago', type: 'notice' },
    { action: 'Teacher profile updated', time: '5 hours ago', type: 'user' },
    { action: 'New student registered', time: '1 day ago', type: 'student' },
    { action: 'Department info updated', time: '2 days ago', type: 'department' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's what's happening at SSTU.</p>
          </div>
          <Link to="/" target="_blank">
            <Button variant="outline" className="gap-2">
              <Eye className="w-4 h-4" />
              View Site
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, idx) => (
            stat.isEditable ? (
              <EditableStatCard
                key={idx}
                title={stat.title}
                value={Number(stat.value)}
                icon={stat.icon}
                change={stat.change}
                changeType={stat.changeType}
                href={stat.href}
                color={stat.color}
                statKey={stat.statKey}
                isEditable={stat.isEditable}
              />
            ) : (
              <Link key={idx} to={stat.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                        <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                        {stat.change && (
                          <p className={`text-sm mt-1 ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                            <TrendingUp className="w-3 h-3 inline mr-1" />
                            {stat.change} from last month
                          </p>
                        )}
                      </div>
                      <div className={`w-14 h-14 rounded-xl ${stat.color} flex items-center justify-center`}>
                        <stat.icon className="w-7 h-7 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          ))}
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, idx) => (
                <Link key={idx} to={action.href}>
                  <Button variant="outline" className="w-full justify-start gap-3 h-12">
                    <div className={`w-8 h-8 rounded-lg ${action.color} flex items-center justify-center`}>
                      <action.icon className="w-4 h-4 text-white" />
                    </div>
                    {action.label}
                    <Plus className="w-4 h-4 ml-auto" />
                  </Button>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <Button variant="ghost" size="sm" className="gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-3 bg-secondary/50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {activity.type === 'notice' && <Bell className="w-5 h-5 text-primary" />}
                      {activity.type === 'user' && <Users className="w-5 h-5 text-primary" />}
                      {activity.type === 'student' && <GraduationCap className="w-5 h-5 text-primary" />}
                      {activity.type === 'department' && <Building2 className="w-5 h-5 text-primary" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Management Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="w-5 h-5 text-orange-500" />
                Notices Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Create, edit, and manage university notices and announcements.
              </p>
              <Link to="/admin/notices">
                <Button className="w-full">Manage Notices</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                News Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Publish and manage news articles and updates.
              </p>
              <Link to="/admin/news">
                <Button className="w-full">Manage News</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-green-500" />
                Academic Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Manage faculties, departments, and programs.
              </p>
              <Link to="/admin/faculties">
                <Button className="w-full">Manage Content</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
