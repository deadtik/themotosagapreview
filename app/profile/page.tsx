'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Trash2 } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const [user, setUser] = useState<any | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
    setDarkMode(localStorage.getItem('darkMode') === 'true');
    fetchCurrentUser();
    fetchEvents();
  }, []);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem('darkMode', next.toString());
  };

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/auth/me', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('fetchCurrentUser', err);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events');
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (err) {
      console.error('fetchEvents', err);
    }
  };

  // rides booked = events where event.rsvps includes user.id
  const ridesBooked = user ? events.filter(e => Array.isArray(e.rsvps) && e.rsvps.includes(user.id)) : [];

  const handleCancelRsvp = async (eventId: string) => {
    if (!confirm('Cancel your RSVP?')) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/events/${eventId}/rsvp`, {
        method: 'POST',
        headers: { Authorization: token ? `Bearer ${token}` : '' },
      });
      if (res.ok) {
        const data = await res.json();
        // refresh events and user
        await fetchEvents();
        await fetchCurrentUser();
        toast({
          title: 'RSVP cancelled',
          description: 'You\'ve been removed from the attendee list'
        });
      } else {
        const err = await res.json().catch(() => ({}));
        toast({
          title: 'Error',
          description: err.error || 'Could not cancel RSVP',
          variant: 'destructive'
        });
      }
    } catch (err) {
      console.error('cancel', err);
      toast({
        title: 'Error',
        description: 'Something went wrong',
        variant: 'destructive'
      });
    }
    setLoading(false);
  };

  if (!mounted) return <div className="min-h-screen bg-gradient-to-br from-stone-200 via-amber-50 to-stone-100" />;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-zinc-950 via-red-950/30 to-zinc-950' : 'bg-gradient-to-br from-stone-200 via-amber-50 to-stone-100'}`}>
      <Toaster />
      {/* simple header */}
      <header className={`border-b sticky top-0 z-40 backdrop-blur ${darkMode ? 'bg-zinc-950/95 border-amber-900/30' : 'bg-white/95 border-stone-200/60'}`}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" legacyBehavior>
              <a className="text-xl font-black uppercase tracking-tight">The Moto Saga</a>
            </Link>
            <nav className="hidden md:flex gap-2">
              <Link href="/" legacyBehavior><a className="text-sm font-medium">Home</a></Link>
              <Link href="/events" legacyBehavior><a className="text-sm font-medium">Events</a></Link>
              <Link href="/about" legacyBehavior><a className="text-sm font-medium">About</a></Link>
              <Link href="/contact" legacyBehavior><a className="text-sm font-medium">Contact</a></Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={toggleDarkMode}>
              {darkMode ? 'Light' : 'Dark'}
            </Button>
            <Link href="/profile" legacyBehavior>
              <a className="hidden md:inline-block text-sm text-stone-600">Profile</a>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Profile card */}
          <Card className={`${darkMode ? 'bg-zinc-900/60' : 'bg-white'} p-6`}>
            <CardContent className="flex items-center gap-6">
              <Avatar className="w-20 h-20 border-2">
                <AvatarImage src={user?.profileImage} />
                <AvatarFallback className="bg-blue-600 text-white text-2xl font-bold">
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className={`text-2xl font-black ${darkMode ? 'text-amber-50' : 'text-stone-900'}`}>{user?.name || 'Guest'}</h2>
                    <p className={`text-sm ${darkMode ? 'text-zinc-400' : 'text-stone-600'}`}>{user?.email || ''}</p>
                  </div>
                  <div className="text-right">
                    <Badge className="uppercase">{user?.role || 'guest'}</Badge>
                  </div>
                </div>

                <p className={`mt-3 ${darkMode ? 'text-zinc-400' : 'text-stone-600'}`}>
                  {user?.bio || 'No bio yet. Tell the community about your rides and bikes!'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Rides booked section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-3xl font-black ${darkMode ? 'text-amber-50' : 'text-stone-900'}`}>Your Rides Booked</h3>
              <div className="text-sm text-stone-500">
                {ridesBooked.length} {ridesBooked.length === 1 ? 'ride' : 'rides'}
              </div>
            </div>

            {ridesBooked.length === 0 ? (
              <Card className={`${darkMode ? 'bg-zinc-900/60' : 'bg-white'} p-8 text-center`}>
                <p className={`${darkMode ? 'text-zinc-300' : 'text-stone-600'}`}>You haven't RSVP'd to any rides yet.</p>
                <div className="mt-4">
                  <Link href="/events" legacyBehavior>
                    <Button className="bg-gradient-to-r from-blue-600 to-red-600 text-white">Browse Events</Button>
                  </Link>
                </div>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {ridesBooked.map(ev => (
                  <Card key={ev.id} className={`${darkMode ? 'bg-zinc-900/60' : 'bg-white'}`}>
                    <CardHeader className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <CardTitle className={`${darkMode ? 'text-amber-50' : 'text-stone-900'}`}>{ev.title}</CardTitle>
                          <div className="mt-2 flex items-center gap-3 text-sm">
                            <div className="flex items-center gap-2 text-blue-400">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(ev.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-2 text-blue-400">
                              <MapPin className="w-4 h-4" />
                              <span>{ev.location}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-sm text-stone-400">
                          <div>Attending: {ev.rsvpCount || (ev.rsvps?.length ?? 0)}</div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-4">
                      <p className={`${darkMode ? 'text-zinc-300' : 'text-stone-600'}`}>{ev.description}</p>
                    </CardContent>

                    <CardFooter className="p-4 flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => handleCancelRsvp(ev.id)}
                        className="flex-1 text-sm"
                        disabled={loading}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Cancel RSVP
                      </Button>

                      <Link href={`/events/${ev.id}`} legacyBehavior>
                        <Button className="bg-gradient-to-r from-blue-600 to-red-600 text-white text-sm">View Event</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {/* small footer inside profile page */}
          <footer className="text-center py-8">
            <p className={`${darkMode ? 'text-zinc-400' : 'text-stone-500'}`}>© {new Date().getFullYear()} The Moto Saga — Ride together.</p>
          </footer>
        </div>
      </main>
    </div>
  );
}
