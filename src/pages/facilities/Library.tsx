import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Clock, Search, Users, Wifi, Coffee, FileText, Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Library = () => {
  const services = [
    { icon: BookOpen, title: 'Book Lending', description: 'Borrow books for up to 14 days with renewal options' },
    { icon: Search, title: 'Reference Service', description: 'Get help finding research materials and citations' },
    { icon: Wifi, title: 'Digital Access', description: 'Access e-journals, e-books, and online databases' },
    { icon: Users, title: 'Study Rooms', description: 'Book private study rooms for group discussions' },
    { icon: Coffee, title: 'Reading Hall', description: 'Quiet reading spaces with comfortable seating' },
    { icon: FileText, title: 'Printing & Copying', description: 'Photocopying and printing services available' },
  ];

  const hours = [
    { day: 'Sunday - Thursday', time: '8:00 AM - 9:00 PM' },
    { day: 'Friday', time: '2:30 PM - 9:00 PM' },
    { day: 'Saturday', time: '9:00 AM - 5:00 PM' },
    { day: 'Public Holidays', time: 'Closed' },
  ];

  const rules = [
    'Valid SSTU ID card is required for entry and borrowing',
    'Maintain silence in the reading halls',
    'Mobile phones should be kept on silent mode',
    'Food and beverages are not allowed inside the library',
    'Return books on time to avoid late fees (Tk. 5/day)',
    'Handle library materials with care',
    'Report any damaged books to the librarian',
    'Maximum 3 books can be borrowed at a time',
  ];

  const stats = [
    { label: 'Total Books', value: '25,000+' },
    { label: 'E-Journals', value: '500+' },
    { label: 'Seating Capacity', value: '200' },
    { label: 'Study Rooms', value: '8' },
  ];

  return (
    <MainLayout>
      <div className="bg-gradient-to-br from-primary/5 to-secondary py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-primary mb-4">
              Central Library
            </h1>
            <p className="text-lg text-muted-foreground">
              Your gateway to knowledge and academic resources at SSTU
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Quick Stats */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tabs Section */}
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="about">About Library</TabsTrigger>
              <TabsTrigger value="services">Library Services</TabsTrigger>
              <TabsTrigger value="opac">OPAC / Book Search</TabsTrigger>
              <TabsTrigger value="rules">Rules & Hours</TabsTrigger>
            </TabsList>

            <TabsContent value="about">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-primary">About Central Library</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-lg max-w-none">
                  <p>
                    The Central Library of Sunamgonj Science and Technology University is the heart 
                    of academic resources on campus. Established with the university in 2023, 
                    the library has grown to become a comprehensive knowledge center serving 
                    students, faculty, and researchers.
                  </p>
                  <p>
                    Our collection spans across all major disciplines offered at SSTU, including 
                    science, engineering, technology, humanities, and social sciences. We continuously 
                    expand our collection based on curriculum requirements and user recommendations.
                  </p>
                  <p>
                    The library building features modern architecture with ample natural lighting, 
                    climate-controlled reading halls, and dedicated spaces for individual study, 
                    group discussions, and research work.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <service.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                          <p className="text-muted-foreground text-sm">{service.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="opac">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-primary">Online Public Access Catalog (OPAC)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <p className="text-muted-foreground mb-6">
                      Search our entire library collection including books, journals, theses, and other materials.
                    </p>
                    <div className="relative max-w-2xl">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search by title, author, ISBN, or keyword..."
                        className="w-full pl-12 pr-4 py-4 border rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">Advanced Search</Button>
                    <Button variant="outline" size="sm">Browse by Subject</Button>
                    <Button variant="outline" size="sm">New Arrivals</Button>
                    <Button variant="outline" size="sm">Most Borrowed</Button>
                  </div>
                  <div className="mt-8 p-4 bg-secondary rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Note:</strong> The full OPAC system is accessible from campus network. 
                      For off-campus access, please use your SSTU credentials to log in.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rules">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      Library Hours
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {hours.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                          <span className="font-medium">{item.day}</span>
                          <span className="text-muted-foreground">{item.time}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      Library Rules
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {rules.map((rule, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="text-primary mt-1">•</span>
                          <span className="text-muted-foreground">{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Contact */}
        <div className="max-w-4xl mx-auto mt-12">
          <Card className="bg-primary/5">
            <CardHeader>
              <CardTitle className="text-xl">Contact Library</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <span>+880-831-52015</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <span>library@sstu.ac.bd</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>Central Library Building</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Library;
