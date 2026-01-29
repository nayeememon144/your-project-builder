import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, FileText, Database, GraduationCap, ExternalLink, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const EResources = () => {
  const resources = [
    {
      icon: BookOpen,
      title: 'E-Books',
      description: 'Access thousands of digital books across various disciplines including science, technology, humanities, and more.',
      link: '/facilities/e-resources/ebooks',
      color: 'bg-blue-500/10 text-blue-600',
    },
    {
      icon: FileText,
      title: 'E-Journals',
      description: 'Browse peer-reviewed academic journals from leading publishers worldwide.',
      link: '/facilities/e-resources/ejournals',
      color: 'bg-green-500/10 text-green-600',
    },
    {
      icon: Database,
      title: 'Databases',
      description: 'Explore comprehensive academic databases including IEEE, Scopus, Web of Science, and more.',
      link: '/facilities/e-resources/databases',
      color: 'bg-purple-500/10 text-purple-600',
    },
    {
      icon: GraduationCap,
      title: 'Online Thesis / Repository',
      description: 'Access thesis papers, dissertations, and research works from SSTU students and faculty.',
      link: '/facilities/e-resources/repository',
      color: 'bg-orange-500/10 text-orange-600',
    },
  ];

  const databases = [
    { name: 'IEEE Xplore', type: 'Engineering & Technology' },
    { name: 'Scopus', type: 'Multidisciplinary' },
    { name: 'Web of Science', type: 'Citation Database' },
    { name: 'JSTOR', type: 'Humanities & Social Sciences' },
    { name: 'PubMed', type: 'Biomedical' },
    { name: 'Science Direct', type: 'Science & Technology' },
  ];

  return (
    <MainLayout>
      <div className="bg-gradient-to-br from-primary/5 to-secondary py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-primary mb-4">
              E-Resources
            </h1>
            <p className="text-lg text-muted-foreground">
              Access digital academic resources anytime, anywhere with your SSTU credentials
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search e-resources, journals, books..."
              className="w-full pl-12 pr-4 py-4 border rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        {/* Resource Categories */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="grid md:grid-cols-2 gap-6">
            {resources.map((resource, index) => (
              <Link to={resource.link} key={index}>
                <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-4 rounded-xl ${resource.color}`}>
                        <resource.icon className="w-8 h-8" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-xl mb-2">{resource.title}</h3>
                        <p className="text-muted-foreground mb-4">{resource.description}</p>
                        <span className="inline-flex items-center gap-1 text-primary text-sm font-medium">
                          Browse {resource.title} <ExternalLink className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Popular Databases */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">Subscribed Databases</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {databases.map((db, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <h4 className="font-semibold">{db.name}</h4>
                  <p className="text-sm text-muted-foreground">{db.type}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Access Info */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-primary/5">
            <CardHeader>
              <CardTitle className="text-xl">How to Access E-Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  All e-resources are available to current SSTU students, faculty, and staff members.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">On Campus</h4>
                    <p className="text-sm text-muted-foreground">
                      Connect to SSTU WiFi network and access resources directly through the library portal.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Off Campus</h4>
                    <p className="text-sm text-muted-foreground">
                      Use your SSTU login credentials to authenticate through our VPN or proxy service.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default EResources;
