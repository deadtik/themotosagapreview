'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatCard } from '@/components/admin/stat-card';
import { EventForm } from '@/components/admin/event-form';
import { EventsTable } from '@/components/admin/events-table';
import { UsersTable } from '@/components/admin/users-table';
import { RazorpaySettings } from '@/components/admin/razorpay-settings';
import {
    Users,
    Calendar,
    DollarSign,
    Activity,
    TrendingUp,
    Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface AdminStats {
    totalUsers: number;
    totalEvents: number;
    activeUsersCount: number;
    recentUsers: number;
    totalRevenue?: number;
    totalPayments?: number;
}

interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    eventType: string;
    ticketPrice: number;
    currency: string;
    rsvpCount?: number;
    maxAttendees: number;
}

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    profileImage?: string;
    createdAt: string;
    recentActivity?: {
        stories: number;
        events: number;
        payments: number;
    };
}

export default function AdminPage() {
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [events, setEvents] = useState<Event[]>([]);
    const [activeUsers, setActiveUsers] = useState<User[]>([]);
    const [razorpayKeyId, setRazorpayKeyId] = useState<string>('');
    const [currentTab, setCurrentTab] = useState('dashboard');

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;
        checkAuth();
        loadData();
    }, [isMounted]);

    const checkAuth = () => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (!token || !userStr) {
            toast.error('Please login to access admin panel');
            router.push('/');
            return;
        }

        try {
            const user = JSON.parse(userStr);
            if (user.role !== 'admin') {
                toast.error('Admin access required');
                router.push('/');
                return;
            }
        } catch (error) {
            toast.error('Invalid session');
            router.push('/');
        }
    };

    const loadData = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');

            // Load stats
            const statsRes = await fetch('/api/admin/stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (statsRes.ok) {
                const statsData = await statsRes.json();
                setStats(statsData);

                // Extract Razorpay key from environment (if available in response)
                // Note: In production, this should come from a separate endpoint
                setRazorpayKeyId(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder');
            }

            // Load events
            const eventsRes = await fetch('/api/events', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (eventsRes.ok) {
                const eventsData = await eventsRes.json();
                setEvents(eventsData);
            }

            // Load active users
            const usersRes = await fetch('/api/admin/active-users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (usersRes.ok) {
                const usersData = await usersRes.json();
                setActiveUsers(usersData.users || []);
            }
        } catch (error) {
            console.error('Failed to load admin data:', error);
            toast.error('Failed to load admin data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEventCreated = () => {
        loadData();
        setCurrentTab('events');
    };

    const handleEventDeleted = () => {
        loadData();
    };

    if (!isMounted) {
        return null;
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const isRazorpayConfigured = razorpayKeyId && !razorpayKeyId.includes('placeholder');

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            <div className="container mx-auto p-6 space-y-8">
                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Admin Dashboard
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your platform, events, and users
                    </p>
                </div>

                {/* Main Content */}
                <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-5 lg:w-auto">
                        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                        <TabsTrigger value="users">Users</TabsTrigger>
                        <TabsTrigger value="events">Events</TabsTrigger>
                        <TabsTrigger value="create-event">Create Event</TabsTrigger>
                        <TabsTrigger value="payments">Payments</TabsTrigger>
                    </TabsList>

                    {/* Dashboard Tab */}
                    <TabsContent value="dashboard" className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <StatCard
                                title="Total Users"
                                value={stats?.totalUsers || 0}
                                icon={Users}
                                description="Registered users"
                                className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-200 dark:border-blue-900"
                            />
                            <StatCard
                                title="Active Users"
                                value={stats?.activeUsersCount || 0}
                                icon={Activity}
                                description="Last 30 days"
                                className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-200 dark:border-green-900"
                            />
                            <StatCard
                                title="Total Events"
                                value={stats?.totalEvents || 0}
                                icon={Calendar}
                                description="All events"
                                className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-200 dark:border-purple-900"
                            />
                            <StatCard
                                title="New Users"
                                value={stats?.recentUsers || 0}
                                icon={TrendingUp}
                                description="Last 7 days"
                                className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-200 dark:border-orange-900"
                            />
                        </div>

                        {stats?.totalPayments !== undefined && (
                            <div className="grid gap-4 md:grid-cols-2">
                                <StatCard
                                    title="Total Payments"
                                    value={stats.totalPayments}
                                    icon={DollarSign}
                                    description="All time"
                                    className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border-emerald-200 dark:border-emerald-900"
                                />
                                {stats.totalRevenue !== undefined && (
                                    <StatCard
                                        title="Total Revenue"
                                        value={`₹${stats.totalRevenue.toLocaleString()}`}
                                        icon={DollarSign}
                                        description="All time"
                                        className="bg-gradient-to-br from-teal-500/10 to-teal-600/10 border-teal-200 dark:border-teal-900"
                                    />
                                )}
                            </div>
                        )}
                    </TabsContent>

                    {/* Users Tab */}
                    <TabsContent value="users" className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold">Active Users</h2>
                                <p className="text-muted-foreground">
                                    Users who have been active in the last 30 days
                                </p>
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {activeUsers.length} active user{activeUsers.length !== 1 ? 's' : ''}
                            </div>
                        </div>
                        <UsersTable users={activeUsers} />
                    </TabsContent>

                    {/* Events Tab */}
                    <TabsContent value="events" className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold">Manage Events</h2>
                                <p className="text-muted-foreground">
                                    View and delete events
                                </p>
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {events.length} event{events.length !== 1 ? 's' : ''}
                            </div>
                        </div>
                        <EventsTable events={events} onEventDeleted={handleEventDeleted} />
                    </TabsContent>

                    {/* Create Event Tab */}
                    <TabsContent value="create-event" className="space-y-4">
                        <div>
                            <h2 className="text-2xl font-bold">Create New Event</h2>
                            <p className="text-muted-foreground">
                                Add a new event to the platform
                            </p>
                        </div>
                        <EventForm onSuccess={handleEventCreated} />
                    </TabsContent>

                    {/* Payments Tab */}
                    <TabsContent value="payments" className="space-y-4">
                        <div>
                            <h2 className="text-2xl font-bold">Payment Settings</h2>
                            <p className="text-muted-foreground">
                                Configure Razorpay payment gateway
                            </p>
                        </div>
                        <RazorpaySettings
                            keyId={razorpayKeyId}
                            isConfigured={isRazorpayConfigured}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
