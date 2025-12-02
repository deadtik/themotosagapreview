'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface EventFormData {
    title: string;
    description: string;
    date: string;
    location: string;
    eventType: string;
    maxAttendees: number;
    ticketPrice: number;
    currency: string;
    imageUrl: string;
}

interface EventFormProps {
    onSuccess?: () => void;
}

export function EventForm({ onSuccess }: EventFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm<EventFormData>();

    const onSubmit = async (data: EventFormData) => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...data,
                    maxAttendees: Number(data.maxAttendees),
                    ticketPrice: Number(data.ticketPrice)
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to create event');
            }

            toast.success('Event created successfully!');
            reset();
            onSuccess?.();
        } catch (error: any) {
            toast.error(error.message || 'Failed to create event');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create New Event</CardTitle>
                <CardDescription>Fill in the details to create a new event</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Event Title *</Label>
                            <Input
                                id="title"
                                {...register('title', { required: 'Title is required' })}
                                placeholder="Enter event title"
                            />
                            {errors.title && (
                                <p className="text-sm text-red-500">{errors.title.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="eventType">Event Type *</Label>
                            <select
                                id="eventType"
                                {...register('eventType', { required: 'Event type is required' })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="">Select type</option>
                                <option value="ride">Ride</option>
                                <option value="meetup">Meetup</option>
                                <option value="race">Race</option>
                                <option value="exhibition">Exhibition</option>
                                <option value="workshop">Workshop</option>
                            </select>
                            {errors.eventType && (
                                <p className="text-sm text-red-500">{errors.eventType.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="date">Date *</Label>
                            <Input
                                id="date"
                                type="datetime-local"
                                {...register('date', { required: 'Date is required' })}
                            />
                            {errors.date && (
                                <p className="text-sm text-red-500">{errors.date.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location">Location *</Label>
                            <Input
                                id="location"
                                {...register('location', { required: 'Location is required' })}
                                placeholder="Enter location"
                            />
                            {errors.location && (
                                <p className="text-sm text-red-500">{errors.location.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="maxAttendees">Max Attendees</Label>
                            <Input
                                id="maxAttendees"
                                type="number"
                                {...register('maxAttendees')}
                                placeholder="0 for unlimited"
                                defaultValue={0}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="ticketPrice">Ticket Price</Label>
                            <Input
                                id="ticketPrice"
                                type="number"
                                step="0.01"
                                {...register('ticketPrice')}
                                placeholder="0 for free"
                                defaultValue={0}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="currency">Currency</Label>
                            <select
                                id="currency"
                                {...register('currency')}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                defaultValue="INR"
                            >
                                <option value="INR">INR</option>
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="imageUrl">Image URL</Label>
                            <Input
                                id="imageUrl"
                                {...register('imageUrl')}
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                            id="description"
                            {...register('description', { required: 'Description is required' })}
                            placeholder="Enter event description"
                            rows={4}
                        />
                        {errors.description && (
                            <p className="text-sm text-red-500">{errors.description.message}</p>
                        )}
                    </div>

                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Event
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
