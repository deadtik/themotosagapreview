import { getDatabase } from '../config/database.js';
import { PaymentModel } from '../models/Payment.js';
import { EventModel } from '../models/Event.js';
import { UserModel } from '../models/User.js';

export async function getAdminStats(authUser) {
  if (authUser.role !== 'admin') {
    return Response.json({ error: 'Admin access required' }, { status: 403 });
  }
  
  const db = await getDatabase();
  const paymentModel = new PaymentModel(db);
  
  // Get basic stats
  const totalUsers = await db.collection('users').countDocuments();
  const totalStories = await db.collection('stories').countDocuments();
  const totalEvents = await db.collection('events').countDocuments();
  
  // Get users by role
  const usersByRole = await db.collection('users').aggregate([
    { $group: { _id: '$role', count: { $sum: 1 } } }
  ]).toArray();
  
  // Get payment stats
  const paymentStats = await paymentModel.getStats();
  
  // Get recent activity counts (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const recentUsers = await db.collection('users').countDocuments({
    createdAt: { $gte: sevenDaysAgo.toISOString() }
  });
  
  const recentStories = await db.collection('stories').countDocuments({
    createdAt: { $gte: sevenDaysAgo.toISOString() }
  });
  
  const recentEvents = await db.collection('events').countDocuments({
    createdAt: { $gte: sevenDaysAgo.toISOString() }
  });
  
  return Response.json({
    totalUsers,
    totalStories,
    totalEvents,
    usersByRole,
    recentUsers,
    recentStories,
    recentEvents,
    ...paymentStats
  });
}

export async function getAdminContent(authUser) {
  if (authUser.role !== 'admin') {
    return Response.json({ error: 'Admin access required' }, { status: 403 });
  }
  
  const db = await getDatabase();
  
  const stories = await db.collection('stories')
    .find({})
    .sort({ createdAt: -1 })
    .limit(100)
    .toArray();
  
  const events = await db.collection('events')
    .find({})
    .sort({ createdAt: -1 })
    .limit(100)
    .toArray();
  
  return Response.json({ stories, events });
}

export async function getAllUsers(authUser) {
  if (authUser.role !== 'admin') {
    return Response.json({ error: 'Admin access required' }, { status: 403 });
  }
  
  const db = await getDatabase();
  
  // Get all users with their activity counts
  const users = await db.collection('users')
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
  
  // Add story and event counts for each user
  for (let user of users) {
    const storyCount = await db.collection('stories').countDocuments({ userId: user.id });
    const eventCount = await db.collection('events').countDocuments({ creatorId: user.id });
    
    user.storyCount = storyCount;
    user.eventCount = eventCount;
    delete user.password; // Remove password from response
  }
  
  return Response.json(users);
}

export async function getAllPayments(authUser) {
  if (authUser.role !== 'admin') {
    return Response.json({ error: 'Admin access required' }, { status: 403 });
  }
  
  const db = await getDatabase();
  const payments = await db.collection('payments')
    .find({})
    .sort({ createdAt: -1 })
    .limit(200)
    .toArray();
  
  // Populate user and event details
  for (let payment of payments) {
    const user = await db.collection('users').findOne({ id: payment.userId });
    const event = await db.collection('events').findOne({ id: payment.eventId });
    
    if (user) {
      payment.user = {
        id: user.id,
        name: user.name,
        email: user.email
      };
    }
    
    if (event) {
      payment.event = {
        id: event.id,
        title: event.title,
        date: event.date
      };
    }
  }
  
  return Response.json(payments);
}

export async function getRecentActivity(authUser) {
  if (authUser.role !== 'admin') {
    return Response.json({ error: 'Admin access required' }, { status: 403 });
  }
  
  const db = await getDatabase();
  const userModel = new UserModel(db);
  
  // Get recent activities from last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentUsers = await db.collection('users')
    .find({ createdAt: { $gte: thirtyDaysAgo.toISOString() } })
    .sort({ createdAt: -1 })
    .limit(20)
    .toArray();
  
  const recentStories = await db.collection('stories')
    .find({ createdAt: { $gte: thirtyDaysAgo.toISOString() } })
    .sort({ createdAt: -1 })
    .limit(20)
    .toArray();
  
  const recentEvents = await db.collection('events')
    .find({ createdAt: { $gte: thirtyDaysAgo.toISOString() } })
    .sort({ createdAt: -1 })
    .limit(20)
    .toArray();
  
  const recentPayments = await db.collection('payments')
    .find({ createdAt: { $gte: thirtyDaysAgo.toISOString() } })
    .sort({ createdAt: -1 })
    .limit(20)
    .toArray();
  
  // Sanitize user data
  for (let user of recentUsers) {
    delete user.password;
  }
  
  // Populate user info for stories
  for (let story of recentStories) {
    const user = await userModel.findById(story.userId);
    if (user) {
      story.user = {
        id: user.id,
        name: user.name,
        email: user.email
      };
    }
  }
  
  // Populate user info for events
  for (let event of recentEvents) {
    const user = await userModel.findById(event.creatorId);
    if (user) {
      event.creator = {
        id: user.id,
        name: user.name,
        email: user.email
      };
    }
  }
  
  // Create unified activity feed
  const activities = [];
  
  recentUsers.forEach(user => {
    activities.push({
      type: 'user_signup',
      timestamp: user.createdAt,
      data: user
    });
  });
  
  recentStories.forEach(story => {
    activities.push({
      type: 'story_created',
      timestamp: story.createdAt,
      data: story
    });
  });
  
  recentEvents.forEach(event => {
    activities.push({
      type: 'event_created',
      timestamp: event.createdAt,
      data: event
    });
  });
  
  recentPayments.forEach(payment => {
    activities.push({
      type: 'payment_completed',
      timestamp: payment.createdAt,
      data: payment
    });
  });
  
  // Sort by timestamp descending
  activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  return Response.json({
    activities: activities.slice(0, 50),
    recentUsers,
    recentStories,
    recentEvents,
    recentPayments
  });
}

export async function deleteEventByAdmin(authUser, eventId) {
  if (authUser.role !== 'admin') {
    return Response.json({ error: 'Admin access required' }, { status: 403 });
  }
  
  const db = await getDatabase();
  const eventModel = new EventModel(db);
  
  const event = await eventModel.findById(eventId);
  if (!event) {
    return Response.json({ error: 'Event not found' }, { status: 404 });
  }
  
  await eventModel.delete(eventId);
  
  return Response.json({ 
    message: 'Event deleted successfully',
    deletedEvent: event 
  });
}

export async function deleteStoryByAdmin(authUser, storyId) {
  if (authUser.role !== 'admin') {
    return Response.json({ error: 'Admin access required' }, { status: 403 });
  }
  
  const db = await getDatabase();
  
  const story = await db.collection('stories').findOne({ id: storyId });
  if (!story) {
    return Response.json({ error: 'Story not found' }, { status: 404 });
  }
  
  await db.collection('stories').deleteOne({ id: storyId });
  
  return Response.json({ 
    message: 'Story deleted successfully',
    deletedStory: story 
  });
}
