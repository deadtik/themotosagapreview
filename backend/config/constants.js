export const JWT_SECRET = process.env.JWT_SECRET || 'moto-saga-secret-key-2024';
export const JWT_EXPIRES_IN = '7d';

export const USER_ROLES = {
  RIDER: 'rider',
  CLUB: 'club',
  CREATOR: 'creator',
  ADMIN: 'admin'
};

export const EVENT_TYPES = {
  RIDE: 'ride',
  MEETUP: 'meetup',
  RACE: 'race',
  EXHIBITION: 'exhibition',
  WORKSHOP: 'workshop'
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  CANCELLED: 'cancelled'
};

export const PAYMENT_GATEWAYS = {
  RAZORPAY: 'razorpay',
  PAYPAL: 'paypal'
};

// RazorPay Configuration
export const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder';
export const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret';
export const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || 'placeholder_webhook_secret';

// PayPal Configuration
export const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'paypal_placeholder_client_id';
export const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || 'paypal_placeholder_secret';
export const PAYPAL_MODE = process.env.PAYPAL_MODE || 'sandbox'; // 'sandbox' or 'live'
