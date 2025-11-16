import { EventModel } from '../models/Event.js';
import { UserModel } from '../models/User.js';
import { getDatabase } from '../config/database.js';

export async function createEvent(request, authUser) {
  // Only admins can create events
  if (authUser.role !== 'admin') {
    return Response.json({ error: 'Only administrators can create events' }, { status: 403 });
  }
  
  const db = await getDatabase();
  const eventModel = new EventModel(db);
  
  const body = await request.json();
  const eventData = {
    ...body,
    creatorId: authUser.userId
  };
  
  const event = await eventModel.create(eventData);
  return Response.json(event);
}

export async function getEvents() {
  const db = await getDatabase();
  const eventModel = new EventModel(db);
  const userModel = new UserModel(db);
  
  const events = await eventModel.findAll();
  
  // Populate creator info and RSVP counts
  for (let event of events) {
    const creator = await userModel.findById(event.creatorId);
    if (creator) {
      event.creator = {
        id: creator.id,
        name: creator.name,
        role: creator.role,
        profileImage: creator.profileImage
      };
    }
    event.rsvpCount = event.rsvps ? event.rsvps.length : 0;
  }
  
  return Response.json(events);
}

export async function getEventById(eventId) {
  const db = await getDatabase();
  const eventModel = new EventModel(db);
  const userModel = new UserModel(db);
  
  const event = await eventModel.findById(eventId);
  if (!event) {
    return Response.json({ error: 'Event not found' }, { status: 404 });
  }
  
  // Populate creator info
  const creator = await userModel.findById(event.creatorId);
  if (creator) {
    event.creator = {
      id: creator.id,
      name: creator.name,
      role: creator.role,
      profileImage: creator.profileImage
    };
  }
  event.rsvpCount = event.rsvps ? event.rsvps.length : 0;
  
  return Response.json(event);
}

export async function toggleRSVP(eventId, authUser) {
  const db = await getDatabase();
  const eventModel = new EventModel(db);
  
  const event = await eventModel.findById(eventId);
  if (!event) {
    return Response.json({ error: 'Event not found' }, { status: 404 });
  }
  
  const rsvps = event.rsvps || [];
  const hasRSVP = rsvps.includes(authUser.userId);
  
  let updatedEvent;
  if (hasRSVP) {
    updatedEvent = await eventModel.removeRSVP(eventId, authUser.userId);
  } else {
    updatedEvent = await eventModel.addRSVP(eventId, authUser.userId);
  }
  
  return Response.json(updatedEvent);
}

export async function deleteEvent(eventId, authUser) {
  const db = await getDatabase();
  const eventModel = new EventModel(db);
  
  const event = await eventModel.findById(eventId);
  if (!event) {
    return Response.json({ error: 'Event not found' }, { status: 404 });
  }
  
  if (event.creatorId !== authUser.userId && authUser.role !== 'admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 403 });
  }
  
  await eventModel.delete(eventId);
  return Response.json({ message: 'Event deleted successfully' });
}
