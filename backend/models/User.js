import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { USER_ROLES } from '../config/constants.js';

export class UserModel {
  constructor(db) {
    this.collection = db.collection('users');
  }

  async create(userData) {
    const { email, password, name, role, bikeInfo, clubInfo, bio } = userData;

    // Validate required fields
    if (!email || !password || !name || !role) {
      throw new Error('Missing required fields');
    }

    // Check if user exists
    const existing = await this.collection.findOne({ email });
    if (existing) {
      throw new Error('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      name,
      role,
      bio: bio || '',
      profileImage: '',
      bikeInfo: role === USER_ROLES.RIDER ? bikeInfo : null,
      clubInfo: role === USER_ROLES.CLUB ? clubInfo : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await this.collection.insertOne(user);
    return this.sanitizeUser(user);
  }

  async findByEmail(email) {
    return await this.collection.findOne({ email });
  }

  async findById(id) {
    return await this.collection.findOne({ id });
  }

  async update(id, updates) {
    const allowedUpdates = ['name', 'bio', 'profileImage', 'bikeInfo', 'clubInfo'];
    const filteredUpdates = {};

    for (const key of allowedUpdates) {
      if (updates[key] !== undefined) {
        filteredUpdates[key] = updates[key];
      }
    }

    filteredUpdates.updatedAt = new Date().toISOString();

    await this.collection.updateOne(
      { id },
      { $set: filteredUpdates }
    );

    return await this.findById(id);
  }

  async verifyPassword(user, password) {
    return await bcrypt.compare(password, user.password);
  }

  sanitizeUser(user) {
    const sanitized = { ...user };
    delete sanitized.password;
    delete sanitized._id;
    return sanitized;
  }
}
