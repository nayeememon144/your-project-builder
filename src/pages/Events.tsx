import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock, Users, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format, isPast, isFuture, isToday } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

const Events = () => {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');

  const { data: events, isLoading } = useQuery({
    queryKey: ['public-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'published')
        .order('event_date', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const filteredEvents = events?.filter(event => {
    const eventDate = new Date(event.event_date);
    if (filter === 'upcoming') return isFuture(eventDate) || isToday(eventDate);
    if (filter === 'past') return isPast(eventDate) && !isToday(eventDate);
    return true;
  });

  const upcomingEvents = events?.filter(e => isFuture(new Date(e.event_date)) || isToday(new Date(e.event_date)));
  const pastEvents = events?.filter(e => isPast(new Date(e.event_date)) && !isToday(new Date(e.event_date)));

  return (
    <MainLayout>
      <div className="bg-gradient-to-br from-primary/5 to-secondary py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-primary mb-4">
              Events
            </h1>
            <p className="text-lg text-muted-foreground">
              Stay updated with seminars, workshops, cultural programs, and academic events at SSTU
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Filter Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          <Button
            variant={filter === 'upcoming' ? 'default' : 'outline'}
            onClick={() => setFilter('upcoming')}
          >
            Upcoming ({upcomingEvents?.length || 0})
          </Button>
          <Button
            variant={filter === 'past' ? 'default' : 'outline'}
            onClick={() => setFilter('past')}
          >
            Past Events ({pastEvents?.length || 0})
          </Button>
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All Events
          </Button>
        </div>

        {/* Events List */}
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredEvents && filteredEvents.length > 0 ? (
            <div className="space-y-6">
              {filteredEvents.map((event) => {
                const eventDate = new Date(event.event_date);
                const isUpcoming = isFuture(eventDate) || isToday(eventDate);
                
                return (
                  <Card 
                    key={event.id} 
                    className={`hover:shadow-lg transition-shadow ${!isUpcoming ? 'opacity-75' : ''}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        {/* Date Badge */}
                        <div className="flex-shrink-0 w-20 text-center">
                          <div className={`rounded-lg p-3 ${isUpcoming ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                            <div className="text-2xl font-bold">{format(eventDate, 'd')}</div>
                            <div className="text-sm">{format(eventDate, 'MMM')}</div>
                            <div className="text-xs">{format(eventDate, 'yyyy')}</div>
                          </div>
                        </div>

                        {/* Event Details */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-xl font-semibold text-primary">{event.title}</h3>
                            {isUpcoming && (
                              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                                Upcoming
                              </span>
                            )}
                          </div>
                          
                          {event.description && (
                            <p className="text-muted-foreground mb-4 line-clamp-2">
                              {event.description}
                            </p>
                          )}

                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {format(eventDate, 'h:mm a')}
                            </div>
                            {event.venue && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {event.venue}
                              </div>
                            )}
                            {event.organizer && (
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {event.organizer}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Arrow */}
                        <div className="flex items-center">
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Events Found</h3>
                <p className="text-muted-foreground">
                  {filter === 'upcoming' 
                    ? 'No upcoming events scheduled at the moment.' 
                    : filter === 'past'
                    ? 'No past events to display.'
                    : 'No events available.'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Events;
