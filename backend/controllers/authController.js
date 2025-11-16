import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/constants.js';
import { UserModel } from '../models/User.js';
import { getDatabase } from '../config/database.js';

export async function signup(request) {
  const db = await getDatabase();
  const userModel = new UserModel(db);
  
  const body = await request.json();
  const user = await userModel.create(body);
  
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
  
  return Response.json({ user, token });
}

export async function login(request) {
  const db = await getDatabase();
  const userModel = new UserModel(db);
  
  const body = await request.json();
  const { email, password } = body;
  
  if (!email || !password) {
    return Response.json({ error: 'Missing email or password' }, { status: 400 });
  }
  
  const user = await userModel.findByEmail(email);
  if (!user) {
    return Response.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  
  const isValid = await userModel.verifyPassword(user, password);
  if (!isValid) {
    return Response.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
  
  const sanitizedUser = userModel.sanitizeUser(user);
  return Response.json({ user: sanitizedUser, token });
}

export async function getMe(request, authUser) {
  const db = await getDatabase();
  const userModel = new UserModel(db);
  
  const user = await userModel.findById(authUser.userId);
  if (!user) {
    return Response.json({ error: 'User not found' }, { status: 404 });
  }
  
  return Response.json(userModel.sanitizeUser(user));
}

export async function updateProfile(request, authUser, userId) {
  if (authUser.userId !== userId && authUser.role !== 'admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 403 });
  }
  
  const db = await getDatabase();
  const userModel = new UserModel(db);
  
  const body = await request.json();
  const updatedUser = await userModel.update(userId, body);
  
  return Response.json(userModel.sanitizeUser(updatedUser));
}

export async function getUserProfile(userId) {
  const db = await getDatabase();
  const userModel = new UserModel(db);
  
  const user = await userModel.findById(userId);
  if (!user) {
    return Response.json({ error: 'User not found' }, { status: 404 });
  }
  
  return Response.json(userModel.sanitizeUser(user));
}
