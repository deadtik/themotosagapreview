'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { Heart, MessageCircle, Calendar, MapPin, Users, Plus, LogOut, User, Sparkles, ShieldCheck, DollarSign, UserCog, Trash2 } from 'lucide-react';
import { useTheme } from '@/components/providers/theme-provider';
import { useAuth } from '@/components/providers/auth-provider';
import { LOGO_URL } from '@/lib/mock-data';

// Landing Page Components
import { HeroSection } from '@/components/landing/hero-section';
import { EventsSection } from '@/components/landing/events-section';
import { NewsSection } from '@/components/landing/news-section';
import { FeaturesSection } from '@/components/landing/features-section';
import { PartnersSection } from '@/components/landing/partners-section';
import { CTASection } from '@/components/landing/cta-section';

export default function App() {
  const { darkMode } = useTheme();
  const { user, token, showAuthDialog, setShowAuthDialog, authMode, setAuthMode, login, logout, updateUser } = useAuth();
  const [stories, setStories] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('stories');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();

  const [authForm, setAuthForm] = useState({
    email: '',
    password: '',
    name: '',
    role: 'rider',
    bio: '',
    bikeInfo: ''
  });

  const [storyForm, setStoryForm] = useState({
    title: '',
    content: '',
    location: '',
    mediaUrls: []
  });
  const [showStoryDialog, setShowStoryDialog] = useState(false);

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    eventType: 'ride',
    maxAttendees: 0,
    imageUrl: ''
  });
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    bio: '',
    bikeInfo: '',
    clubInfo: ''
  });
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const [adminStats, setAdminStats] = useState<any>(null);

  const fetchStories = async () => {
    try {
      const res = await fetch('/api/stories');
      if (res.ok) {
        const data = await res.json();
        setStories(data);
      }
    } catch (error) {
      console.error('Error fetching stories:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events');
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleAuth = async () => {
    setLoading(true);
    try {
      const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/signup';
      const body = authMode === 'login'
        ? { email: authForm.email, password: authForm.password }
        : authForm;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (res.ok) {
        login(data.token, data.user);
        toast({
          title: 'Welcome to the Saga!',
          description: authMode === 'login' ? 'Good to see you back, rider!' : 'Your journey begins now!'
        });
        setAuthForm({
          email: '',
          password: '',
          name: '',
          role: 'rider',
          bio: '',
          bikeInfo: ''
        });
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Something went wrong',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to authenticate',
        variant: 'destructive'
      });
    }
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
  };

  const handleFileUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        setStoryForm(prev => ({
          ...prev,
          mediaUrls: [...prev.mediaUrls, data.url]
        }));
        toast({
          title: 'Media uploaded!',
          description: 'Your photo/video has been added'
        });
      }
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Could not upload file',
        variant: 'destructive'
      });
    }
  };

  const createStory = async () => {
    if (!storyForm.title || !storyForm.content) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in title and content',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(storyForm)
      });

      if (res.ok) {
        const data = await res.json();
        setStories([data, ...stories]);
        setShowStoryDialog(false);
        setStoryForm({
          title: '',
          content: '',
          location: '',
          mediaUrls: []
        });
        toast({
          title: 'Story posted!',
          description: 'Your ride story is now live'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create story',
        variant: 'destructive'
      });
    }
    setLoading(false);
  };

  const createEvent = async () => {
    // Only admins can create events
    if (user?.role !== 'admin') {
      toast({
        title: 'Unauthorized',
        description: 'Only administrators can create events',
        variant: 'destructive'
      });
      return;
    }

    if (!eventForm.title || !eventForm.description || !eventForm.date || !eventForm.location) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
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
        body: JSON.stringify(eventForm)
      });

      if (res.ok) {
        const data = await res.json();
        setEvents([data, ...events]);
        setShowEventDialog(false);
        setEventForm({
          title: '',
          description: '',
          date: '',
          location: '',
          eventType: 'ride',
          maxAttendees: 0,
          imageUrl: ''
        });
        toast({
          title: 'Event created!',
          description: 'Your event is now live'
        });
      } else {
        const error = await res.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to create event',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create event',
        variant: 'destructive'
      });
    }
    setLoading(false);
  };

  const handleLike = async (storyId: any) => {
    try {
      const res = await fetch(`/api/stories/${storyId}/like`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setStories(stories.map(s => s.id === storyId ? { ...s, likes: data.likes } : s));
      }
    } catch (error) {
      console.error('Error liking story:', error);
    }
  };

  const handleRSVP = async (eventId: any) => {
    try {
      const res = await fetch(`/api/events/${eventId}/rsvp`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setEvents(events.map(e => e.id === eventId ? { ...e, rsvps: data.rsvps, rsvpCount: data.rsvps.length } : e));
        toast({
          title: data.rsvps.includes(user?.id) ? 'RSVP confirmed!' : 'RSVP cancelled',
          description: data.rsvps.includes(user?.id) ? 'See you at the event!' : 'You cancelled your RSVP'
        });
      }
    } catch (error) {
      console.error('Error RSVPing:', error);
    }
  };

  const updateProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(profileForm)
      });

      if (res.ok) {
        const data = await res.json();
        updateUser(data);
        setShowProfileDialog(false);
        toast({
          title: 'Profile updated!',
          description: 'Your changes have been saved'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive'
      });
    }
    setLoading(false);
  };

  const deleteStory = async (storyId: any) => {
    if (!confirm('Delete this story?')) return;

    try {
      const res = await fetch(`/api/stories/${storyId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setStories(stories.filter(s => s.id !== storyId));
        toast({
          title: 'Story deleted',
          description: 'Your story has been removed'
        });
      }
    } catch (error) {
      console.error('Error deleting story:', error);
    }
  };

  const deleteEvent = async (eventId: any) => {
    if (!confirm('Delete this event?')) return;

    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setEvents(events.filter(e => e.id !== eventId));
        toast({
          title: 'Event deleted',
          description: 'Event has been removed'
        });
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const fetchAdminStats = async () => {
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAdminStats(data);
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (token) {
      fetchStories();
      fetchEvents();
    } else {
      // still try to fetch events for the landing page
      fetchEvents();
    }
  }, [token]);

  if (!mounted) {
    return <div className="min-h-screen bg-gradient-to-br from-stone-200 via-amber-50 to-stone-100" />;
  }

  // Landing page for non-authenticated users
  if (!user) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-zinc-950 via-red-950/30 to-zinc-950' : 'bg-gradient-to-br from-stone-200 via-amber-50 to-stone-100'}`}>
        <Toaster />

        <HeroSection onSignup={() => { setAuthMode('signup'); setShowAuthDialog(true); }} />
        <EventsSection events={events} onSignup={() => { setAuthMode('signup'); setShowAuthDialog(true); }} />
        <NewsSection />
        <FeaturesSection />
        <PartnersSection />
        <CTASection onSignup={() => { setAuthMode('signup'); setShowAuthDialog(true); }} />

        {/* Auth Dialog */}
        <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
          <DialogContent className="bg-stone-950 border-blue-900/50 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent uppercase">
                {authMode === 'login' ? 'Welcome Back!' : 'Join The Saga'}
              </DialogTitle>
              <DialogDescription className="text-stone-400">
                {authMode === 'login' ? 'Sign in to continue your journey' : 'Create your account and start riding'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {authMode === 'signup' && (
                <>
                  <div>
                    <Label htmlFor="name" className="text-white font-semibold">Name</Label>
                    <Input
                      id="name"
                      value={authForm.name}
                      onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                      className="bg-stone-900 border-stone-800 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="role" className="text-white font-semibold">I am a...</Label>
                    <Select value={authForm.role} onValueChange={(value) => setAuthForm({ ...authForm, role: value })}>
                      <SelectTrigger className="bg-stone-900 border-stone-800 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-stone-900 border-stone-800">
                        <SelectItem value="rider">Rider</SelectItem>
                        <SelectItem value="club">Club / Community</SelectItem>
                        <SelectItem value="creator">Content Creator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {authForm.role === 'rider' && (
                    <div>
                      <Label htmlFor="bikeInfo" className="text-white font-semibold">Your Bike</Label>
                      <Input
                        id="bikeInfo"
                        placeholder="e.g., Royal Enfield Himalayan 450"
                        value={authForm.bikeInfo}
                        onChange={(e) => setAuthForm({ ...authForm, bikeInfo: e.target.value })}
                        className="bg-stone-900 border-stone-800 text-white"
                      />
                    </div>
                  )}
                </>
              )}

              <div>
                <Label htmlFor="email" className="text-white font-semibold">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  className="bg-stone-900 border-stone-800 text-white"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-white font-semibold">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  className="bg-stone-900 border-stone-800 text-white"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Button
                onClick={handleAuth}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white font-bold uppercase"
              >
                {loading ? 'Please wait...' : authMode === 'login' ? 'Sign In' : 'Join Now'}
              </Button>

              <Button
                variant="ghost"
                onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                className="text-blue-400 hover:text-blue-300"
              >
                {authMode === 'login' ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Main App for authenticated users
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-zinc-950 via-red-950/30 to-zinc-950' : 'bg-gradient-to-br from-stone-200 via-amber-50 to-stone-100'}`}>
      <Toaster />

      {/* Header */}
      <header className={`border-b backdrop-blur sticky top-0 z-50 ${darkMode ? 'border-amber-900/30 bg-zinc-950/95' : 'border-stone-300/50 bg-stone-100/95'}`}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className={`w-10 h-10 rounded-full overflow-hidden border-2 ${darkMode ? 'bg-amber-900/20 border-amber-600' : 'bg-stone-100 border-blue-500'}`}>
              <img src={LOGO_URL} alt="The Moto Saga" className="w-full h-full object-cover" />
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-3">
              <Button
                variant={activeTab === 'stories' ? 'default' : 'outline'}
                size="default"
                onClick={() => setActiveTab('stories')}
                className={`font-bold uppercase px-6 ${activeTab === 'stories'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/50'
                  : 'border-2 border-blue-600/50 text-blue-400 hover:bg-blue-600/10 hover:border-blue-600'
                  }`}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Stories
              </Button>
              <Button
                variant={activeTab === 'events' ? 'default' : 'outline'}
                size="default"
                onClick={() => setActiveTab('events')}
                className={`font-bold uppercase px-6 ${activeTab === 'events'
                  ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/50'
                  : 'border-2 border-red-600/50 text-red-400 hover:bg-red-600/10 hover:border-red-600'
                  }`}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Events
              </Button>

              {/* ABOUT & CONTACT LINKS */}
              <Link href="/about" legacyBehavior>
                <Button variant="ghost" size="sm" className="ml-2 font-semibold hidden md:inline-flex">
                  About Us
                </Button>
              </Link>

              <Link href="/contact" legacyBehavior>
                <Button variant="ghost" size="sm" className="ml-2 font-semibold hidden md:inline-flex">
                  Contact
                </Button>
              </Link>

              {/* EVENTS LINK */}
              <Link href="/events" legacyBehavior>
                <Button variant="ghost" size="sm" className="ml-2 font-semibold hidden md:inline-flex">
                  Events
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user.role === 'admin' && (
              <Button
                variant="outline"
                size="sm"
                className={`font-semibold ${darkMode ? 'border-amber-600 text-amber-400 hover:bg-amber-600/10' : 'border-blue-600 text-blue-400 hover:bg-blue-600/10'}`}
                onClick={() => setShowEventDialog(true)}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            )}

            <Button
              size="sm"
              className={`font-semibold ${darkMode ? 'bg-gradient-to-r from-amber-600 to-red-700 hover:from-amber-700 hover:to-red-800' : 'bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700'} text-white`}
              onClick={() => setShowStoryDialog(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Story
            </Button>

            {user.role === 'admin' && (
              <Button
                variant="outline"
                size="sm"
                className={darkMode ? 'border-amber-600 text-amber-300 hover:bg-amber-800/20' : 'border-stone-600 text-stone-700 hover:bg-stone-200'}
                onClick={() => { setShowAdminDialog(true); fetchAdminStats(); }}
              >
                <ShieldCheck className="w-4 h-4" />
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowProfileDialog(true)}
              className={darkMode ? 'text-amber-100 hover:text-amber-400' : 'text-stone-800 hover:text-blue-600'}
            >
              <User className="w-4 h-4 mr-2" />
              {user.name}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className={darkMode ? 'text-zinc-400 hover:text-red-500' : 'text-stone-500 hover:text-red-500'}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-stone-900 border border-stone-800/30">
            <TabsTrigger value="stories" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white font-semibold uppercase">
              <Sparkles className="w-4 h-4 mr-2" />
              Stories
            </TabsTrigger>
            <TabsTrigger value="events" className="data-[state=active]:bg-red-600 data-[state=active]:text-white font-semibold uppercase">
              <Calendar className="w-4 h-4 mr-2" />
              Events
            </TabsTrigger>
          </TabsList>

          {/* Stories Tab */}
          <TabsContent value="stories" className="space-y-6">
            {stories.length === 0 ? (
              <Card className="bg-gradient-to-br from-stone-900 to-zinc-900 border-stone-800/30">
                <CardContent className="py-16 text-center">
                  <Sparkles className="w-20 h-20 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-black text-white mb-2 uppercase">No stories yet</h3>
                  <p className="text-stone-400 mb-6">Be the first to share your ride!</p>
                  <Button
                    onClick={() => setShowStoryDialog(true)}
                    className="bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 font-bold"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Post Your Story
                  </Button>
                </CardContent>
              </Card>
            ) : (
              stories.map(story => (
                <Card key={story.id} className="bg-gradient-to-br from-stone-900 to-zinc-900 border-stone-800/30 overflow-hidden hover:border-blue-600/50 transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="border-2 border-blue-600">
                          <AvatarImage src={story.user?.profileImage} />
                          <AvatarFallback className="bg-blue-600 text-white font-bold">
                            {story.user?.name?.[0]?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-white">{story.user?.name}</p>
                          <div className="flex items-center gap-2 text-sm text-stone-400">
                            <Badge variant="outline" className="border-blue-600 text-blue-400 text-xs uppercase">
                              {story.user?.role}
                            </Badge>
                            <span>•</span>
                            <span>{new Date(story.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      {(user.id === story.userId || user.role === 'admin') && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteStory(story.id)}
                          className="text-red-500 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <CardTitle className="text-2xl text-white mt-4">{story.title}</CardTitle>
                    {story.location && (
                      <div className="flex items-center gap-2 text-sm text-blue-400">
                        <MapPin className="w-4 h-4" />
                        {story.location}
                      </div>
                    )}
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-stone-300 whitespace-pre-wrap leading-relaxed">{story.content}</p>

                    {story.mediaUrls && story.mediaUrls.length > 0 && (
                      <div className="grid grid-cols-2 gap-2">
                        {story.mediaUrls.map((url: string, idx: number) => (
                          <div key={idx} className="relative aspect-video bg-stone-800 rounded-lg overflow-hidden border border-stone-700/20">
                            <img src={url} alt="Story media" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="border-t border-stone-800/20 pt-4">
                    <div className="flex items-center gap-6 w-full">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(story.id)}
                        className={`gap-2 ${story.likes?.includes(user.id) ? 'text-red-500' : 'text-stone-400'}`}
                      >
                        <Heart className={`w-5 h-5 ${story.likes?.includes(user.id) ? 'fill-red-500' : ''}`} />
                        {story.likes?.length || 0}
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2 text-stone-400">
                        <MessageCircle className="w-5 h-5" />
                        {story.comments?.length || 0}
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            {events.length === 0 ? (
              <Card className="bg-gradient-to-br from-stone-900 to-zinc-900 border-stone-800/30">
                <CardContent className="py-16 text-center">
                  <Calendar className="w-20 h-20 text-red-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-black text-white mb-2 uppercase">No events yet</h3>
                  <p className="text-stone-400">Check back soon for upcoming rides!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map(event => (
                  <Card key={event.id} className="bg-gradient-to-br from-stone-900 to-zinc-900 border-stone-800/30 overflow-hidden hover:border-red-600/50 transition-all group">
                    {event.imageUrl && (
                      <div className="aspect-video bg-stone-800 relative overflow-hidden">
                        <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <Badge className="absolute top-4 right-4 bg-red-600 text-white uppercase font-bold">
                          {event.eventType}
                        </Badge>
                      </div>
                    )}

                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-8 h-8 border border-blue-600">
                            <AvatarImage src={event.creator?.profileImage} />
                            <AvatarFallback className="bg-blue-600 text-white text-xs font-bold">
                              {event.creator?.name?.[0]?.toUpperCase() || 'A'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-stone-400">by {event.creator?.name || 'Admin'}</span>
                        </div>
                        {user.role === 'admin' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteEvent(event.id)}
                            className="text-red-500 hover:text-red-400 h-8 w-8 p-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <CardTitle className="text-xl text-white">{event.title}</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      <p className="text-stone-300 text-sm leading-relaxed">{event.description}</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-blue-400">
                          <Calendar className="w-4 h-4" />
                          {new Date(event.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="flex items-center gap-2 text-blue-400">
                          <MapPin className="w-4 h-4" />
                          {event.location}
                        </div>
                        <div className="flex items-center gap-2 text-blue-400">
                          <Users className="w-4 h-4" />
                          {event.rsvpCount || 0} {event.maxAttendees > 0 && `/ ${event.maxAttendees}`} attending
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter>
                      <Button
                        onClick={() => handleRSVP(event.id)}
                        className={`w-full font-bold uppercase ${event.rsvps?.includes(user.id)
                          ? 'bg-stone-800 hover:bg-stone-700 text-white'
                          : 'bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white shadow-lg shadow-red-900/50'}`}
                      >
                        {event.rsvps?.includes(user.id) ? 'Cancel RSVP' : 'RSVP Now'}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Dialogs - Story, Event, Profile, Admin */}
      {/* Create Story Dialog */}
      <Dialog open={showStoryDialog} onOpenChange={setShowStoryDialog}>
        <DialogContent className="bg-stone-950 border-blue-900/50 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent uppercase">Share Your Story</DialogTitle>
            <DialogDescription className="text-stone-400">
              Post your journey, inspire the community
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="story-title" className="text-white font-semibold">Title</Label>
              <Input
                id="story-title"
                placeholder="Epic ride to Leh-Ladakh..."
                value={storyForm.title}
                onChange={(e) => setStoryForm({ ...storyForm, title: e.target.value })}
                className="bg-stone-900 border-stone-800 text-white"
              />
            </div>

            <div>
              <Label htmlFor="story-location" className="text-white font-semibold">Location</Label>
              <Input
                id="story-location"
                placeholder="Leh, Ladakh"
                value={storyForm.location}
                onChange={(e) => setStoryForm({ ...storyForm, location: e.target.value })}
                className="bg-stone-900 border-stone-800 text-white"
              />
            </div>

            <div>
              <Label htmlFor="story-content" className="text-white font-semibold">Your Story</Label>
              <Textarea
                id="story-content"
                placeholder="Tell us about your ride..."
                value={storyForm.content}
                onChange={(e) => setStoryForm({ ...storyForm, content: e.target.value })}
                className="bg-stone-900 border-stone-800 text-white min-h-32"
              />
            </div>

            <div>
              <Label className="text-white font-semibold">Photos / Videos</Label>
              <div className="mt-2">
                <Input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="bg-stone-900 border-stone-800 text-white"
                />
              </div>
              {storyForm.mediaUrls.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {storyForm.mediaUrls.map((url: string, idx: number) => (
                    <div key={idx} className="relative aspect-square bg-stone-900 rounded overflow-hidden border border-stone-700/30">
                      <img src={url} alt="Upload" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={createStory}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white font-bold uppercase"
            >
              {loading ? 'Posting...' : 'Post Story'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowStoryDialog(false)}
              className="border-stone-800 text-stone-400 hover:bg-stone-900"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Event Dialog - ADMIN ONLY */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="bg-stone-950 border-red-900/50 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent uppercase flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-blue-500" />
              Admin: Create Event
            </DialogTitle>
            <DialogDescription className="text-stone-400">
              Organize a ride, meetup, or track day for the community
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="event-title" className="text-white font-semibold">Event Title</Label>
              <Input
                id="event-title"
                placeholder="Sunday Morning Ride"
                value={eventForm.title}
                onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                className="bg-stone-900 border-stone-800 text-white"
              />
            </div>

            <div>
              <Label htmlFor="event-type" className="text-white font-semibold">Event Type</Label>
              <Select value={eventForm.eventType} onValueChange={(value) => setEventForm({ ...eventForm, eventType: value })}>
                <SelectTrigger className="bg-stone-900 border-stone-800 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-stone-900 border-stone-800">
                  <SelectItem value="ride">Group Ride</SelectItem>
                  <SelectItem value="trackday">Track Day</SelectItem>
                  <SelectItem value="meetup">Meetup</SelectItem>
                  <SelectItem value="festival">Festival</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="event-date" className="text-white font-semibold">Date</Label>
                <Input
                  id="event-date"
                  type="date"
                  value={eventForm.date}
                  onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                  className="bg-stone-900 border-stone-800 text-white"
                />
              </div>
              <div>
                <Label htmlFor="event-max" className="text-white font-semibold">Max Attendees</Label>
                <Input
                  id="event-max"
                  type="number"
                  placeholder="0 = unlimited"
                  value={eventForm.maxAttendees}
                  onChange={(e) => setEventForm({ ...eventForm, maxAttendees: parseInt(e.target.value) || 0 })}
                  className="bg-stone-900 border-stone-800 text-white"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="event-location" className="text-white font-semibold">Location</Label>
              <Input
                id="event-location"
                placeholder="India Gate, Delhi"
                value={eventForm.location}
                onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                className="bg-stone-900 border-stone-800 text-white"
              />
            </div>

            <div>
              <Label htmlFor="event-description" className="text-white font-semibold">Description</Label>
              <Textarea
                id="event-description"
                placeholder="Event details..."
                value={eventForm.description}
                onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                className="bg-stone-900 border-stone-800 text-white min-h-24"
              />
            </div>

            <div>
              <Label htmlFor="event-image" className="text-white font-semibold">Image URL</Label>
              <Input
                id="event-image"
                placeholder="https://..."
                value={eventForm.imageUrl}
                onChange={(e) => setEventForm({ ...eventForm, imageUrl: e.target.value })}
                className="bg-stone-900 border-stone-800 text-white"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={createEvent}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white font-bold uppercase"
            >
              {loading ? 'Creating...' : 'Create Event'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowEventDialog(false)}
              className="border-stone-800 text-stone-400 hover:bg-stone-900"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Profile Dialog */}
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="bg-stone-950 border-blue-900/50 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent uppercase">Your Profile</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="text-center mb-4">
              <Avatar className="w-24 h-24 mx-auto mb-2 border-2 border-blue-600">
                <AvatarImage src={user.profileImage} />
                <AvatarFallback className="bg-blue-600 text-white text-3xl font-bold">
                  {user.name[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Badge className="bg-gradient-to-r from-blue-600 to-red-600 uppercase font-bold">{user.role}</Badge>
            </div>

            <div>
              <Label htmlFor="profile-name" className="text-white font-semibold">Name</Label>
              <Input
                id="profile-name"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="bg-stone-900 border-stone-800 text-white"
              />
            </div>

            <div>
              <Label htmlFor="profile-bio" className="text-white font-semibold">Bio</Label>
              <Textarea
                id="profile-bio"
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                className="bg-stone-900 border-stone-800 text-white"
              />
            </div>

            {user.role === 'rider' && (
              <div>
                <Label htmlFor="profile-bike" className="text-white font-semibold">Your Bike</Label>
                <Input
                  id="profile-bike"
                  value={profileForm.bikeInfo}
                  onChange={(e) => setProfileForm({ ...profileForm, bikeInfo: e.target.value })}
                  className="bg-stone-900 border-stone-800 text-white"
                />
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <Button
              onClick={updateProfile}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white font-bold uppercase"
            >
              {loading ? 'Saving...' : 'Save'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowProfileDialog(false)}
              className="border-stone-800 text-stone-400 hover:bg-stone-900"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Admin Dashboard Dialog */}
      <Dialog open={showAdminDialog} onOpenChange={setShowAdminDialog}>
        <DialogContent className="bg-stone-950 border-blue-900/50 text-white max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-white uppercase flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-blue-500" />
              Admin Control Panel
            </DialogTitle>
            <DialogDescription className="text-stone-400">
              Platform management and community oversight
            </DialogDescription>
          </DialogHeader>

          {adminStats && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-blue-950/50 to-transparent border-blue-800/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-stone-400 uppercase flex items-center gap-2">
                      <UserCog className="w-4 h-4" />
                      Total Users
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-black text-blue-400">{adminStats.totalUsers}</div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-red-950/50 to-transparent border-red-800/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-stone-400 uppercase flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Stories
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-black text-red-400">{adminStats.totalStories}</div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-stone-800/50 to-transparent border-stone-700/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-stone-400 uppercase flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-black text-stone-300">{adminStats.totalEvents}</div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-3 uppercase flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  Community Breakdown
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {adminStats.usersByRole.map((item: any) => (
                    <div key={item._id} className="flex items-center justify-between bg-gradient-to-r from-stone-900 to-transparent p-4 rounded border border-stone-800">
                      <Badge className="bg-gradient-to-r from-blue-600 to-red-600 uppercase font-bold">{item._id}</Badge>
                      <span className="text-2xl font-black text-white">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-stone-800 pt-6">
                <h3 className="text-lg font-bold text-white mb-3 uppercase flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-blue-400" />
                  Payment Management
                </h3>
                <p className="text-stone-400 mb-4">Manage event payments, memberships, and transactions</p>
                <Button className="bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 font-bold">
                  View Payment Dashboard
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
