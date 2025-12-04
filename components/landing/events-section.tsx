'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users } from 'lucide-react';
import { ScrollReveal } from '@/components/parallax/scroll-reveal';
import { useTheme } from '@/components/providers/theme-provider';

interface EventsSectionProps {
    events: any[];
    onSignup: () => void;
}

export function EventsSection({ events, onSignup }: EventsSectionProps) {
    const { darkMode } = useTheme();

    return (
        <div className={`py-24 px-4 border-t ${darkMode ? 'bg-gradient-to-br from-zinc-950 to-red-950/20 border-amber-900/30' : 'bg-gradient-to-br from-stone-100 to-amber-50 border-stone-300/50'}`}>
            <div className="max-w-7xl mx-auto">
                <ScrollReveal direction="up" scale>
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className={`text-5xl font-black mb-2 uppercase tracking-tight ${darkMode ? 'text-amber-50' : 'text-stone-900'}`}>Upcoming Events</h2>
                            <p className={`text-xl ${darkMode ? 'text-zinc-400' : 'text-stone-600'}`}>Join the rides and meetups</p>
                        </div>
                        <div className="hidden md:flex items-center gap-3">
                            <Link href="/events" legacyBehavior>
                                <Button className="bg-gradient-to-r from-blue-600 to-red-600 text-white font-bold">See all events</Button>
                            </Link>
                        </div>
                    </div>
                </ScrollReveal>

                <div className="grid md:grid-cols-3 gap-6">
                    {events.slice(0, 3).length > 0 ? events.slice(0, 3).map((event, idx) => (
                        <ScrollReveal key={event.id} direction="up" delay={idx * 0.15} scale blur>
                            <Card className={`overflow-hidden transition-all group shadow-lg ${darkMode ? 'bg-gradient-to-br from-zinc-900 to-red-950/30 border-amber-900/50 hover:border-amber-600' : 'bg-white border-stone-300/50 hover:border-blue-500'}`}>
                                {event.imageUrl && (
                                    <div className="aspect-video bg-stone-800 relative overflow-hidden">
                                        <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                        <Badge className="absolute top-4 right-4 bg-red-600 text-white uppercase font-bold">
                                            {event.eventType}
                                        </Badge>
                                    </div>
                                )}
                                <CardHeader>
                                    <CardTitle className={`text-xl ${darkMode ? 'text-white' : 'text-stone-900'}`}>{event.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className={`flex items-center gap-2 text-sm font-medium ${darkMode ? 'text-amber-400' : 'text-blue-600'}`}>
                                        <Calendar className="w-4 h-4" />
                                        {new Date(event.date).toLocaleDateString('en-IN')}
                                    </div>
                                    <div className={`flex items-center gap-2 text-sm font-medium ${darkMode ? 'text-amber-400' : 'text-blue-600'}`}>
                                        <MapPin className="w-4 h-4" />
                                        {event.location}
                                    </div>
                                    <div className={`flex items-center gap-2 text-sm font-medium ${darkMode ? 'text-amber-400' : 'text-blue-600'}`}>
                                        <Users className="w-4 h-4" />
                                        {event.rsvpCount || 0} attending
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        onClick={onSignup}
                                        className={`w-full font-bold text-white ${darkMode ? 'bg-gradient-to-r from-amber-600 to-red-700 hover:from-amber-700 hover:to-red-800' : 'bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700'}`}
                                    >
                                        RSVP Now
                                    </Button>
                                </CardFooter>
                            </Card>
                        </ScrollReveal>
                    )) : (
                        <div className="col-span-3 text-center py-16">
                            <Calendar className="w-16 h-16 text-stone-600 mx-auto mb-4" />
                            <p className="text-stone-400 text-lg">No events scheduled yet. Check back soon!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
