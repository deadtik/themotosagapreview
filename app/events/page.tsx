'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, MapPin, Users, ChevronRight, Sun, Moon, Plus, ShieldCheck, Trash2 } from 'lucide-react';

const LOGO_URL = 'https://customer-assets.emergentagent.com/job_motocommunity/artifacts/tt95bhwq_image.png';

type EventType = {
  id: string | number;
  title: string;
  description: string;
  date: string;
  location: string;
  eventType: string;
  imageUrl?: string;
  rsvpCount?: number;
  maxAttendees?: number;
  creator?: { id?: string; name?: string; profileImage?: string };
  rsvps?: string[]; // user IDs
};

export default function EventsPage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventType[]>([]);
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'ride' | 'trackday' | 'meetup' | 'festival'>('all');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    eventType: 'ride',
    maxAttendees: 0,
    imageUrl: ''
  });
  const { toast } = useToast();

  // Load dark mode + token/user from localStorage to keep experience consistent
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('darkMode') === 'true';
    setDarkMode(saved);
    const t = localStorage.getItem('token');
    if (t) setToken(t);
    // minimal attempt to get user (optional)
    try {
      const u = localStorage.getItem('user');
      if (u) setUser(JSON.parse(u));
    } catch (e) {}
  }, []);

  // Fetch events
  useEffect(() => {
    fetchAllEvents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [events, query, filterType]);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem('darkMode', next.toString());
  };

  const fetchAllEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/events');
      if (!res.ok) {
        // fallback to empty or mock data
        console.warn('Failed to fetch events, status:', res.status);
        setEvents([]);
        setFilteredEvents([]);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching events:', err);
      setEvents([]);
    }
    setLoading(false);
  };

  const applyFilters = () => {
    let out = events.slice();
    if (filterType !== 'all') {
      out = out.filter(e => e.eventType === filterType);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      out = out.filter(e => (e.title || '').toLowerCase().includes(q) || (e.location || '').toLowerCase().includes(q) || (e.description || '').toLowerCase().includes(q));
    }
    setFilteredEvents(out);
  };

  const handleRSVP = async (eventId: string | number) => {
    if (!token) {
      toast({ title: 'Sign in required', description: 'Please sign in to RSVP' });
      return;
    }
    try {
      const res = await fetch(`/api/events/${eventId}/rsvp`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast({ title: 'Error', description: err.error || 'Failed to RSVP', variant: 'destructive' });
        return;
      }
      const updated = await res.json();
      setEvents(prev => prev.map(ev => ev.id === eventId ? { ...ev, ...updated } : ev));
      toast({ title: 'RSVP updated', description: 'Your RSVP status changed' });
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to RSVP', variant: 'destructive' });
    }
  };

  const handleCreateEvent = async () => {
    if (!user || user.role !== 'admin') {
      toast({ title: 'Unauthorized', description: 'Only admins can create events', variant: 'destructive' });
      return;
    }
    // basic validation
    if (!createForm.title || !createForm.date || !createForm.location || !createForm.description) {
      toast({ title: 'Missing fields', description: 'Please fill all required fields', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(createForm)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast({ title: 'Error', description: err.error || 'Failed to create event', variant: 'destructive' });
        setLoading(false);
        return;
      }
      const newEvent = await res.json();
      setEvents(prev => [newEvent, ...prev]);
      setShowCreate(false);
      setCreateForm({ title: '', description: '', date: '', location: '', eventType: 'ride', maxAttendees: 0, imageUrl: '' });
      toast({ title: 'Event created', description: 'Event is live' });
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to create event', variant: 'destructive' });
    }
    setLoading(false);
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm('Delete this event?')) return;
    try {
      const res = await fetch(`/api/events/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) {
        toast({ title: 'Error', description: 'Failed to delete event', variant: 'destructive' });
        return;
      }
      setEvents(prev => prev.filter(e => e.id !== id));
      toast({ title: 'Deleted', description: 'Event removed' });
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to delete event', variant: 'destructive' });
    }
  };

  if (!mounted) {
    return <div className="min-h-screen bg-gradient-to-br from-stone-200 via-amber-50 to-stone-100" />;
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-zinc-950 via-red-950/30 to-zinc-950 text-amber-100' : 'bg-gradient-to-br from-stone-200 via-amber-50 to-stone-100 text-stone-900'}`}>
      <Toaster />

      {/* top navigation (kept small, consistent with theme) */}
      <nav className={`sticky top-0 z-40 backdrop-blur border-b ${darkMode ? 'bg-zinc-950/95 border-amber-900/30' : 'bg-stone-100/95 border-stone-300/50'}`}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full overflow-hidden border-2 ${darkMode ? 'bg-amber-900/20 border-amber-600' : 'bg-stone-100 border-blue-500'}`}>
              <img src={LOGO_URL} alt="The Moto Saga" className="w-full h-full object-cover" />
            </div>
            <div className="text-lg font-black tracking-tight">
              Events
            </div>
            <Link href="/" className={`ml-4 text-sm font-semibold ${darkMode ? 'text-amber-200' : 'text-stone-700'}`}>
              Home
            </Link>
            <Link href="/About" className={`ml-2 text-sm font-semibold ${darkMode ? 'text-amber-200' : 'text-stone-700'}`}>
              About
            </Link>
            <Link href="/Contact" className={`ml-2 text-sm font-semibold ${darkMode ? 'text-amber-200' : 'text-stone-700'}`}>
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={toggleDarkMode} className={darkMode ? 'text-amber-400' : 'text-stone-700'}>
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            {user?.role === 'admin' && (
              <Button onClick={() => setShowCreate(true)} className="hidden sm:inline-flex bg-gradient-to-r from-blue-600 to-red-600 text-white font-bold">
                <Plus className="w-4 h-4 mr-2" /> Create Event
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* page header + filters */}
      <header className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">Events</h1>
            <p className="mt-2 text-stone-500 max-w-xl">
              Find rides, track days, meetups and festivals — RSVP instantly and join the community.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-white dark:bg-stone-900 px-2 py-2 rounded shadow-sm">
              <Input
                placeholder="Search events, location, description..."
                value={query}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                className="min-w-[240px] bg-transparent"
              />
              <Button variant="ghost" onClick={() => { setQuery(''); }} className="hidden sm:inline-flex">Clear</Button>
            </div>

            <div className="w-48">
              <Select value={filterType} onValueChange={(v: any) => setFilterType(v)}>
                <SelectTrigger className="w-full bg-white dark:bg-stone-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-stone-900">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="ride">Group Ride</SelectItem>
                  <SelectItem value="trackday">Track Day</SelectItem>
                  <SelectItem value="meetup">Meetup</SelectItem>
                  <SelectItem value="festival">Festival</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      {/* Events grid */}
      <main className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && <div className="col-span-full text-center py-10">Loading...</div>}

          {filteredEvents.length === 0 && !loading && (
            <div className="col-span-full text-center py-20">
              <p className="text-stone-400">No events found. Check back soon.</p>
            </div>
          )}

          {filteredEvents.map(ev => (
            <Card key={ev.id} className={`overflow-hidden group ${darkMode ? 'bg-zinc-900 border-amber-900/20' : 'bg-white border-stone-200'}`}>
              {ev.imageUrl ? (
                <div className="aspect-video overflow-hidden">
                  <img src={ev.imageUrl} alt={ev.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-r from-stone-100 to-stone-200 flex items-center justify-center">
                  <div className="text-stone-400">No image</div>
                </div>
              )}

              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="uppercase">{ev.eventType}</Badge>
                      <div className="text-sm text-stone-500 flex items-center gap-3">
                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(ev.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {ev.location}</span>
                      </div>
                    </div>

                    <CardTitle className="text-lg">{ev.title}</CardTitle>
                  </div>

                  <div className="flex flex-col items-end">
                    <div className="text-sm text-stone-500">{ev.rsvpCount || 0} attending</div>
                    {user?.role === 'admin' && (
                      <Button variant="ghost" onClick={() => handleDelete(ev.id)} className="mt-2 text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-sm leading-relaxed text-stone-400 line-clamp-4">{ev.description}</p>
                <div className="mt-4 flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={ev.creator?.profileImage} />
                    <AvatarFallback>{ev.creator?.name?.[0] || 'A'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-semibold">{ev.creator?.name || 'Admin'}</div>
                    <div className="text-xs text-stone-500">Hosted by</div>
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <div className="w-full flex items-center gap-3">
                  <Button
                    className={`flex-1 font-bold ${ev.rsvps?.includes(user?.id) ? 'bg-stone-800 text-white' : 'bg-gradient-to-r from-blue-600 to-red-600 text-white'}`}
                    onClick={() => handleRSVP(ev.id)}
                  >
                    {ev.rsvps?.includes(user?.id) ? 'Cancel RSVP' : 'RSVP Now'}
                  </Button>

                  <Link href={`/events/${ev.id}`} className="inline-flex items-center gap-2 text-sm font-semibold">
                    Details <ChevronRight />
                  </Link>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      {/* Create Event Dialog (admin) */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-2xl bg-stone-950 border-blue-900/40 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">Create Event</DialogTitle>
            <DialogDescription className="text-stone-400">Add a new event to the community calendar</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Name</Label>
              <Input value={createForm.title} onChange={(e) => setCreateForm({...createForm, title: e.target.value})} className="bg-stone-900" />
            </div>
            <div>
              <Label>Type</Label>
              <Select value={createForm.eventType} onValueChange={(v: any) => setCreateForm({...createForm, eventType: v})}>
                <SelectTrigger className="bg-stone-900"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-stone-900">
                  <SelectItem value="ride">Group Ride</SelectItem>
                  <SelectItem value="trackday">Track Day</SelectItem>
                  <SelectItem value="meetup">Meetup</SelectItem>
                  <SelectItem value="festival">Festival</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Date</Label>
                <Input type="date" value={createForm.date} onChange={(e) => setCreateForm({...createForm, date: e.target.value})} className="bg-stone-900" />
              </div>
              <div>
                <Label>Max Attendees</Label>
                <Input type="number" value={createForm.maxAttendees} onChange={(e) => setCreateForm({...createForm, maxAttendees: parseInt(e.target.value || '0')})} className="bg-stone-900" />
              </div>
            </div>
            <div>
              <Label>Location</Label>
              <Input value={createForm.location} onChange={(e) => setCreateForm({...createForm, location: e.target.value})} className="bg-stone-900" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={createForm.description} onChange={(e) => setCreateForm({...createForm, description: e.target.value})} className="bg-stone-900" />
            </div>
            <div>
              <Label>Image URL</Label>
              <Input value={createForm.imageUrl} onChange={(e) => setCreateForm({...createForm, imageUrl: e.target.value})} className="bg-stone-900" />
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={handleCreateEvent} className="flex-1 bg-gradient-to-r from-blue-600 to-red-600 text-white font-bold">Create</Button>
            <Button variant="outline" onClick={() => setShowCreate(false)} className="border-stone-800">Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
