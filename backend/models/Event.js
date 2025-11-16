import { v4 as uuidv4 } from 'uuid';
import { EVENT_TYPES } from '../config/constants.js';

export class EventModel {
  constructor(db) {
    this.collection = db.collection('events');
  }

  async create(eventData) {
    const { 
      creatorId, 
      title, 
      description, 
      date, 
      location, 
      eventType, 
      maxAttendees, 
      imageUrl,
      ticketPrice,
      currency
    } = eventData;

    if (!title || !description || !date || !location || !creatorId) {
      throw new Error('Missing required fields');
    }

    const event = {
      id: uuidv4(),
      creatorId,
      title,
      description,
      date,
      location,
      eventType: eventType || EVENT_TYPES.RIDE,
      maxAttendees: maxAttendees || 0,
      imageUrl: imageUrl || '',
      ticketPrice: ticketPrice || 0,
      currency: currency || 'INR',
      requiresPayment: ticketPrice > 0,
      rsvps: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await this.collection.insertOne(event);
    return event;
  }

  async findAll() {
    return await this.collection
      .find({})
      .sort({ date: 1 })
      .toArray();
  }

  async findById(id) {
    return await this.collection.findOne({ id });
  }

  async findByCreator(creatorId) {
    return await this.collection
      .find({ creatorId })
      .sort({ date: 1 })
      .toArray();
  }

  async addRSVP(eventId, userId) {
    const event = await this.findById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    const rsvps = event.rsvps || [];
    if (rsvps.includes(userId)) {
      throw new Error('Already RSVP\'d');
    }

    if (event.maxAttendees > 0 && rsvps.length >= event.maxAttendees) {
      throw new Error('Event is full');
    }

    await this.collection.updateOne(
      { id: eventId },
      { $push: { rsvps: userId }, $set: { updatedAt: new Date().toISOString() } }
    );

    return await this.findById(eventId);
  }

  async removeRSVP(eventId, userId) {
    await this.collection.updateOne(
      { id: eventId },
      { $pull: { rsvps: userId }, $set: { updatedAt: new Date().toISOString() } }
    );

    return await this.findById(eventId);
  }

  async delete(eventId) {
    const result = await this.collection.deleteOne({ id: eventId });
    return result.deletedCount > 0;
  }

  async update(eventId, updates) {
    const allowedUpdates = ['title', 'description', 'date', 'location', 'eventType', 'maxAttendees', 'imageUrl', 'ticketPrice', 'currency'];
    const filteredUpdates = {};

    for (const key of allowedUpdates) {
      if (updates[key] !== undefined) {
        filteredUpdates[key] = updates[key];
      }
    }

    filteredUpdates.updatedAt = new Date().toISOString();
    filteredUpdates.requiresPayment = (filteredUpdates.ticketPrice || 0) > 0;

    await this.collection.updateOne(
      { id: eventId },
      { $set: filteredUpdates }
    );

    return await this.findById(eventId);
  }
}
