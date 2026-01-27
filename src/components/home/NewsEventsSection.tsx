import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const sampleNews = [
  {
    id: '1',
    title: 'SSTU Signs MoU with Leading International University',
    excerpt: 'A new partnership to enhance research collaboration and student exchange programs.',
    featured_image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80',
    published_at: new Date().toISOString(),
    category: 'Partnership',
  },
  {
    id: '2',
    title: 'Annual Science Fair 2025 Concludes Successfully',
    excerpt: 'Over 200 projects showcased by students from various departments.',
    featured_image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&q=80',
    published_at: new Date(Date.now() - 86400000).toISOString(),
    category: 'Event',
  },
  {
    id: '3',
    title: 'New Research Center Inaugurated',
    excerpt: 'State-of-the-art AI and Machine Learning research facility opens its doors.',
    featured_image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80',
    published_at: new Date(Date.now() - 172800000).toISOString(),
    category: 'Campus',
  },
];

const sampleEvents = [
  {
    id: '1',
    title: 'International Conference on Sustainable Technology',
    event_date: new Date(Date.now() + 604800000).toISOString(),
    venue: 'Main Auditorium',
  },
  {
    id: '2',
    title: 'Career Fair 2025',
    event_date: new Date(Date.now() + 1209600000).toISOString(),
    venue: 'Central Plaza',
  },
  {
    id: '3',
    title: 'Annual Cultural Festival',
    event_date: new Date(Date.now() + 1814400000).toISOString(),
    venue: 'Open Air Theater',
  },
];

export const NewsEventsSection = () => {
  return (
    <section className="py-20 bg-secondary/30 section-divider">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* News Section */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-display text-3xl font-bold text-foreground">
                Latest News
              </h2>
              <Link to="/news">
                <Button variant="ghost" className="group">
                  View All
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Featured News */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="md:col-span-2"
              >
                <Link to={`/news/${sampleNews[0].id}`}>
                  <Card className="overflow-hidden card-hover group">
                    <div className="grid md:grid-cols-2">
                      <div className="aspect-video md:aspect-auto">
                        <img
                          src={sampleNews[0].featured_image}
                          alt={sampleNews[0].title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <CardContent className="p-6 flex flex-col justify-center">
                        <Badge className="w-fit mb-3">{sampleNews[0].category}</Badge>
                        <h3 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                          {sampleNews[0].title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4">
                          {sampleNews[0].excerpt}
                        </p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4 mr-2" />
                          {format(new Date(sampleNews[0].published_at), 'MMM dd, yyyy')}
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              </motion.div>

              {/* Other News */}
              {sampleNews.slice(1).map((news, idx) => (
                <motion.div
                  key={news.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link to={`/news/${news.id}`}>
                    <Card className="overflow-hidden card-hover group h-full">
                      <div className="aspect-video">
                        <img
                          src={news.featured_image}
                          alt={news.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <CardContent className="p-4">
                        <Badge variant="outline" className="mb-2">{news.category}</Badge>
                        <h3 className="font-medium text-foreground mb-2 group-hover:text-accent transition-colors line-clamp-2">
                          {news.title}
                        </h3>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3 mr-1" />
                          {format(new Date(news.published_at), 'MMM dd, yyyy')}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Events Section */}
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-display text-3xl font-bold text-foreground">
                Upcoming Events
              </h2>
            </div>

            <div className="space-y-4">
              {sampleEvents.map((event, idx) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="card-hover">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* Date Box */}
                        <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-primary text-primary-foreground flex flex-col items-center justify-center">
                          <span className="text-2xl font-bold">
                            {format(new Date(event.event_date), 'dd')}
                          </span>
                          <span className="text-xs uppercase">
                            {format(new Date(event.event_date), 'MMM')}
                          </span>
                        </div>
                        {/* Event Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground mb-2 line-clamp-2">
                            {event.title}
                          </h3>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{event.venue}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Link to="/events" className="block mt-6">
              <Button variant="outline" className="w-full group">
                View All Events
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
