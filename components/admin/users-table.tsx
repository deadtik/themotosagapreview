'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';

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

interface UsersTableProps {
    users: User[];
}

export function UsersTable({ users }: UsersTableProps) {
    const getRoleBadge = (role: string) => {
        const colors: Record<string, string> = {
            admin: 'bg-red-500',
            creator: 'bg-purple-500',
            club: 'bg-blue-500',
            rider: 'bg-green-500'
        };
        return colors[role] || 'bg-gray-500';
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Recent Activity</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center text-muted-foreground">
                                No users found
                            </TableCell>
                        </TableRow>
                    ) : (
                        users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={user.profileImage} />
                                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">{user.name}</div>
                                            <div className="text-sm text-muted-foreground">{user.email}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge className={getRoleBadge(user.role)}>
                                        {user.role}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {format(new Date(user.createdAt), 'PPP')}
                                </TableCell>
                                <TableCell>
                                    {user.recentActivity ? (
                                        <div className="text-sm space-y-1">
                                            {user.recentActivity.stories > 0 && (
                                                <div>Stories: {user.recentActivity.stories}</div>
                                            )}
                                            {user.recentActivity.events > 0 && (
                                                <div>Events: {user.recentActivity.events}</div>
                                            )}
                                            {user.recentActivity.payments > 0 && (
                                                <div>Payments: {user.recentActivity.payments}</div>
                                            )}
                                            {user.recentActivity.stories === 0 &&
                                                user.recentActivity.events === 0 &&
                                                user.recentActivity.payments === 0 && (
                                                    <div className="text-muted-foreground">No recent activity</div>
                                                )}
                                        </div>
                                    ) : (
                                        <div className="text-sm text-muted-foreground">-</div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
