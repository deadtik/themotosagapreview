'use client';

import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Trash2, Users, Calendar, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

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

interface EventsTableProps {
    events: Event[];
    onEventDeleted?: () => void;
}

export function EventsTable({ events, onEventDeleted }: EventsTableProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteClick = (event: Event) => {
        setSelectedEvent(event);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedEvent) return;

        setIsDeleting(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/admin/events/${selectedEvent.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to delete event');
            }

            toast.success('Event deleted successfully');
            setDeleteDialogOpen(false);
            setSelectedEvent(null);
            onEventDeleted?.();
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete event');
        } finally {
            setIsDeleting(false);
        }
    };

    const getEventTypeBadge = (type: string) => {
        const colors: Record<string, string> = {
            ride: 'bg-blue-500',
            meetup: 'bg-green-500',
            race: 'bg-red-500',
            exhibition: 'bg-purple-500',
            workshop: 'bg-orange-500'
        };
        return colors[type] || 'bg-gray-500';
    };

    return (
        <>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Event</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Date & Location</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>RSVPs</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {events.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-muted-foreground">
                                    No events found
                                </TableCell>
                            </TableRow>
                        ) : (
                            events.map((event) => (
                                <TableRow key={event.id}>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{event.title}</div>
                                            <div className="text-sm text-muted-foreground line-clamp-1">
                                                {event.description}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={getEventTypeBadge(event.eventType)}>
                                            {event.eventType}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <div className="flex items-center text-sm">
                                                <Calendar className="mr-1 h-3 w-3" />
                                                {format(new Date(event.date), 'PPP')}
                                            </div>
                                            <div className="flex items-center text-sm text-muted-foreground">
                                                <MapPin className="mr-1 h-3 w-3" />
                                                {event.location}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {event.ticketPrice > 0 ? (
                                            <span className="font-medium">
                                                {event.currency} {event.ticketPrice}
                                            </span>
                                        ) : (
                                            <span className="text-green-600">Free</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <Users className="mr-1 h-4 w-4" />
                                            <span>{event.rsvpCount || 0}</span>
                                            {event.maxAttendees > 0 && (
                                                <span className="text-muted-foreground">
                                                    /{event.maxAttendees}
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDeleteClick(event)}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Event</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{selectedEvent?.title}"? This action cannot be undone.
                            {selectedEvent?.rsvpCount && selectedEvent.rsvpCount > 0 && (
                                <span className="block mt-2 text-red-600 font-medium">
                                    Warning: {selectedEvent.rsvpCount} user(s) have RSVP'd to this event.
                                </span>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
