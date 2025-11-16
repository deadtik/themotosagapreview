import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/constants.js';

export function verifyToken(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('Token verification error:', error.message);
    return null;
  }
}

export function requireAuth(request) {
  const user = verifyToken(request);
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}
