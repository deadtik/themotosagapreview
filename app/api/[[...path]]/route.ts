import { NextRequest } from 'next/server';

import { verifyToken, requireAuth } from '../../../backend/middleware/auth.js';

// Auth Controllers
import { signup, login, getMe, updateProfile, getUserProfile } from '../../../backend/controllers/authController.js';

// Story Controllers
import {
  createStory,
  getStories,
  getStoryById,
  likeStory,
  commentOnStory,
  deleteStory
} from '../../../backend/controllers/storyController.js';

// Event Controllers
import {
  createEvent,
  getEvents,
  getEventById,
  toggleRSVP,
  deleteEvent
} from '../../../backend/controllers/eventController.js';

// Payment Controllers
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  razorpayWebhook,
  createPayPalOrder,
  capturePayPalOrder,
  getPaymentDetails,
  getUserPayments
} from '../../../backend/controllers/paymentController.js';

// Admin Controllers
import {
  getAdminStats,
  getAdminContent,
  getAllPayments,
  getAllUsers,
  getRecentActivity,
  deleteEventByAdmin,
  deleteStoryByAdmin,
  getActiveUsers
} from '../../../backend/controllers/adminController.js';

// GET Handler
export async function GET(request: NextRequest, { params }: { params: { path?: string[] } }) {
  const { path: routePath = [] } = params || {};
  const pathString = routePath.join('/');

  try {
    // Auth Routes
    if (pathString === 'auth/me') {
      const user = requireAuth(request);
      return await getMe(request, user);
    }

    // Story Routes
    if (pathString === 'stories') {
      return await getStories();
    }

    if (pathString.startsWith('stories/') && routePath.length === 2) {
      const storyId = routePath[1];
      return await getStoryById(storyId);
    }

    // Event Routes
    if (pathString === 'events') {
      return await getEvents();
    }

    if (pathString.startsWith('events/') && routePath.length === 2) {
      const eventId = routePath[1];
      return await getEventById(eventId);
    }

    // User Routes
    if (pathString.startsWith('users/') && routePath.length === 2) {
      const userId = routePath[1];
      return await getUserProfile(userId);
    }

    // Payment Routes
    if (pathString.startsWith('payments/') && routePath.length === 2) {
      const user = requireAuth(request);
      const paymentId = routePath[1];
      return await getPaymentDetails(paymentId, user);
    }

    if (pathString === 'payments/my-payments') {
      const user = requireAuth(request);
      return await getUserPayments(user);
    }

    // Admin Routes
    if (pathString === 'admin/stats') {
      const user = requireAuth(request);
      return await getAdminStats(user);
    }

    if (pathString === 'admin/content') {
      const user = requireAuth(request);
      return await getAdminContent(user);
    }

    if (pathString === 'admin/payments') {
      const user = requireAuth(request);
      return await getAllPayments(user);
    }

    if (pathString === 'admin/users') {
      const user = requireAuth(request);
      return await getAllUsers(user);
    }

    if (pathString === 'admin/activity') {
      const user = requireAuth(request);
      return await getRecentActivity(user);
    }

    if (pathString === 'admin/active-users') {
      const user = requireAuth(request);
      return await getActiveUsers(user);
    }

    return Response.json({ error: 'Not found' }, { status: 404 });
  } catch (error: any) {
    console.error('API Error:', error);
    const statusCode = error.message === 'Authentication required' ? 401 :
      error.message === 'Admin access required' ? 403 : 500;
    return Response.json({ error: error.message }, { status: statusCode });
  }
}

// POST Handler
export async function POST(request: NextRequest, { params }: { params: { path?: string[] } }) {
  const { path: routePath = [] } = params || {};
  const pathString = routePath.join('/');

  try {
    // Auth Routes
    if (pathString === 'auth/signup') {
      return await signup(request);
    }

    if (pathString === 'auth/login') {
      return await login(request);
    }

    // Story Routes
    if (pathString === 'stories') {
      const user = requireAuth(request);
      return await createStory(request, user);
    }

    if (pathString.match(/stories\/[^/]+\/like/)) {
      const user = requireAuth(request);
      const storyId = routePath[1];
      return await likeStory(storyId, user);
    }

    if (pathString.match(/stories\/[^/]+\/comment/)) {
      const user = requireAuth(request);
      const storyId = routePath[1];
      return await commentOnStory(request, storyId, user);
    }

    // Event Routes
    if (pathString === 'events') {
      const user = requireAuth(request);
      return await createEvent(request, user);
    }

    if (pathString.match(/events\/[^/]+\/rsvp/)) {
      const user = requireAuth(request);
      const eventId = routePath[1];
      return await toggleRSVP(eventId, user);
    }

    // Payment Routes - RazorPay
    if (pathString === 'payments/razorpay/create-order') {
      const user = requireAuth(request);
      return await createRazorpayOrder(request, user);
    }

    if (pathString === 'payments/razorpay/verify-payment') {
      const user = requireAuth(request);
      return await verifyRazorpayPayment(request, user);
    }

    if (pathString === 'payments/razorpay/webhook') {
      return await razorpayWebhook(request);
    }

    // Payment Routes - PayPal
    if (pathString === 'payments/paypal/create-order') {
      const user = requireAuth(request);
      return await createPayPalOrder(request, user);
    }

    if (pathString === 'payments/paypal/capture-order') {
      const user = requireAuth(request);
      return await capturePayPalOrder(request, user);
    }

    // Upload Route
    if (pathString === 'upload') {
      const user = requireAuth(request);

      const formData = await request.formData();
      const file = formData.get('file');
      if (!(file instanceof File)) {
        return Response.json({ error: "Invalid file" }, { status: 400 });
      }

      if (!file) {
        return Response.json({ error: 'No file provided' }, { status: 400 });
      }

      const buffer = await file.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      const dataUrl = `data:${file.type};base64,${base64}`;

      return Response.json({ url: dataUrl });
    }

    return Response.json({ error: 'Not found' }, { status: 404 });
  } catch (error: any) {
    console.error('API Error:', error);
    const statusCode = error.message === 'Authentication required' ? 401 :
      error.message === 'Admin access required' ? 403 : 500;
    return Response.json({ error: error.message }, { status: statusCode });
  }
}

// PUT Handler
export async function PUT(request: NextRequest, { params }: { params: { path?: string[] } }) {
  const { path: routePath = [] } = params || {};
  const pathString = routePath.join('/');

  try {
    const user = requireAuth(request);

    // User Routes
    if (pathString.startsWith('users/') && routePath.length === 2) {
      const userId = routePath[1];
      return await updateProfile(request, user, userId);
    }

    return Response.json({ error: 'Not found' }, { status: 404 });
  } catch (error: any) {
    console.error('API Error:', error);
    const statusCode = error.message === 'Authentication required' ? 401 :
      error.message === 'Admin access required' ? 403 : 500;
    return Response.json({ error: error.message }, { status: statusCode });
  }
}

// DELETE Handler
export async function DELETE(request: NextRequest, { params }: { params: { path?: string[] } }) {
  const { path: routePath = [] } = params || {};
  const pathString = routePath.join('/');

  try {
    const user = requireAuth(request);

    // Story Routes
    if (pathString.startsWith('stories/') && routePath.length === 2) {
      const storyId = routePath[1];
      return await deleteStory(storyId, user);
    }

    // Event Routes
    if (pathString.startsWith('events/') && routePath.length === 2) {
      const eventId = routePath[1];
      return await deleteEvent(eventId, user);
    }

    // Admin Routes
    if (pathString.startsWith('admin/events/') && routePath.length === 3) {
      const eventId = routePath[2];
      return await deleteEventByAdmin(user, eventId);
    }

    if (pathString.startsWith('admin/stories/') && routePath.length === 3) {
      const storyId = routePath[2];
      return await deleteStoryByAdmin(user, storyId);
    }

    return Response.json({ error: 'Not found' }, { status: 404 });
  } catch (error: any) {
    console.error('API Error:', error);
    const statusCode = error.message === 'Authentication required' ? 401 :
      error.message === 'Admin access required' ? 403 : 500;
    return Response.json({ error: error.message }, { status: statusCode });
  }
}