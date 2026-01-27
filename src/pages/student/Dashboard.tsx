import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  BookOpen, 
  FileText, 
  Bell, 
  Settings, 
  LogOut,
  Calendar,
  GraduationCap,
  ClipboardList,
  CreditCard,
  Download
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

const mockCourses = [
  { code: 'CSE-101', name: 'Introduction to Computer Science', credits: 3, grade: 'A', status: 'completed' },
  { code: 'CSE-201', name: 'Data Structures', credits: 3, grade: 'A-', status: 'completed' },
  { code: 'CSE-301', name: 'Database Systems', credits: 3, grade: null, status: 'ongoing' },
  { code: 'CSE-305', name: 'Software Engineering', credits: 3, grade: null, status: 'ongoing' },
  { code: 'MATH-201', name: 'Discrete Mathematics', credits: 3, grade: 'B+', status: 'completed' },
];

const mockNotices = [
  { id: 1, title: 'Mid-Term Exam Schedule Published', date: '2024-01-20', type: 'exam' },
  { id: 2, title: 'Semester Registration Deadline Extended', date: '2024-01-18', type: 'academic' },
  { id: 3, title: 'Library Hours Extended During Exams', date: '2024-01-15', type: 'general' },
];

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Current CGPA', value: '3.65', icon: GraduationCap, color: 'bg-blue-500' },
    { label: 'Credits Completed', value: '45', icon: BookOpen, color: 'bg-green-500' },
    { label: 'Current Semester', value: '4th', icon: Calendar, color: 'bg-orange-500' },
    { label: 'Pending Dues', value: '৳0', icon: CreditCard, color: 'bg-purple-500' },
  ];

  return (
    <MainLayout>
      <div className="bg-muted/30 min-h-screen py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold">Student Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, Md. Abdul Karim</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Link to="/student/login">
                <Button variant="ghost" size="sm">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </Link>
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
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Current Courses */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Current Courses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockCourses.filter(c => c.status === 'ongoing').map((course) => (
                        <div key={course.code} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold">{course.name}</h4>
                              <p className="text-sm text-muted-foreground">{course.code} • {course.credits} Credits</p>
                            </div>
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                              In Progress
                            </span>
                          </div>
                          <div className="mt-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-muted-foreground">Progress</span>
                              <span>65%</span>
                            </div>
                            <Progress value={65} className="h-2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Profile & Notices */}
                <div className="space-y-6">
                  {/* Profile Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center mb-4">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                          <User className="w-10 h-10 text-primary" />
                        </div>
                        <h3 className="font-semibold">Md. Abdul Karim</h3>
                        <p className="text-muted-foreground text-sm">BSc in CSE</p>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Student ID</span>
                          <span className="font-medium">2021-1-52-001</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Batch</span>
                          <span className="font-medium">2021</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Session</span>
                          <span className="font-medium">2020-21</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Notices */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Recent Notices</CardTitle>
                      <Link to="/notices" className="text-sm text-primary hover:underline">View All</Link>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {mockNotices.map((notice) => (
                          <div key={notice.id} className="border-l-2 border-gold pl-3 py-1">
                            <p className="text-sm font-medium line-clamp-1">{notice.title}</p>
                            <p className="text-xs text-muted-foreground">{notice.date}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="courses">
              <Card>
                <CardHeader>
                  <CardTitle>All Courses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium">Code</th>
                          <th className="text-left py-3 px-4 font-medium">Course Name</th>
                          <th className="text-center py-3 px-4 font-medium">Credits</th>
                          <th className="text-center py-3 px-4 font-medium">Grade</th>
                          <th className="text-center py-3 px-4 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockCourses.map((course) => (
                          <tr key={course.code} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-4 font-medium">{course.code}</td>
                            <td className="py-3 px-4">{course.name}</td>
                            <td className="py-3 px-4 text-center">{course.credits}</td>
                            <td className="py-3 px-4 text-center">
                              {course.grade || '-'}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className={`px-2 py-0.5 rounded-full text-xs ${
                                course.status === 'completed' 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-blue-100 text-blue-700'
                              }`}>
                                {course.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="results">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Academic Results</CardTitle>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download Transcript
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <GraduationCap className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Results will be displayed here</h3>
                    <p className="text-muted-foreground">
                      Your semester-wise results and CGPA progression will appear here.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Student Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h3 className="font-semibold border-b pb-2">Personal Information</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Full Name</span>
                          <p className="font-medium">Md. Abdul Karim</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Student ID</span>
                          <p className="font-medium">2021-1-52-001</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Email</span>
                          <p className="font-medium">abdul.karim@sstu.ac.bd</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Phone</span>
                          <p className="font-medium">+880-1712-345678</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-semibold border-b pb-2">Academic Information</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Program</span>
                          <p className="font-medium">BSc in Computer Science</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Department</span>
                          <p className="font-medium">Computer Science & Engineering</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Faculty</span>
                          <p className="font-medium">Engineering & Technology</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Advisor</span>
                          <p className="font-medium">Dr. Mohammad Rahman</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default StudentDashboard;
