# Payment Integration Guide - The Moto Saga

This guide explains how to set up and use the payment gateway integrations for event ticket purchases.

## Overview

The Moto Saga supports two payment gateways:
- **RazorPay** (for Indian market - supports UPI, Cards, Wallets, Net Banking)
- **PayPal** (for international payments)

## Backend Architecture

The backend has been restructured into a production-ready architecture:

```
/app/backend/
├── config/
│   ├── database.js          # MongoDB connection
│   └── constants.js          # App constants and config
├── models/
│   ├── User.js              # User model
│   ├── Story.js             # Story model
│   ├── Event.js             # Event model
│   └── Payment.js           # Payment model
├── middleware/
│   ├── auth.js              # Authentication middleware
│   └── errorHandler.js      # Error handling
├── controllers/
│   ├── authController.js    # Auth logic
│   ├── storyController.js   # Story logic
│   ├── eventController.js   # Event logic
│   ├── paymentController.js # Payment logic
│   └── adminController.js   # Admin logic
└── utils/
    ├── validation.js        # Input validation
    └── responseHandler.js   # Response formatters
```

## Setting Up Payment Gateways

### 1. RazorPay Setup

#### Step 1: Create RazorPay Account
1. Go to https://dashboard.razorpay.com/signup
2. Complete the signup process
3. Navigate to Settings > API Keys

#### Step 2: Get API Credentials
1. In the RazorPay Dashboard, go to Settings > API Keys
2. Generate new Test Keys (for testing) or Live Keys (for production)
3. You'll get:
   - Key ID (starts with `rzp_test_` or `rzp_live_`)
   - Key Secret

#### Step 3: Update Environment Variables
Edit `/app/.env` file:
```env
# RazorPay Configuration
RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_key_secret_here
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id_here
```

#### Step 4: Set Up Webhooks
1. Go to Settings > Webhooks in RazorPay Dashboard
2. Add a new webhook with URL: `https://your-domain.com/api/payments/razorpay/webhook`
3. Select events:
   - payment.captured
   - payment.failed
4. Copy the webhook secret and add it to `.env` as `RAZORPAY_WEBHOOK_SECRET`

#### Step 5: Restart Backend
```bash
sudo supervisorctl restart nextjs
```

### 2. PayPal Setup

#### Step 1: Create PayPal Developer Account
1. Go to https://developer.paypal.com/
2. Sign in or create an account
3. Go to Dashboard

#### Step 2: Create App
1. Click "My Apps & Credentials"
2. Under REST API apps, click "Create App"
3. Name your app (e.g., "The Moto Saga")
4. Choose "Merchant" as app type
5. Click "Create App"

#### Step 3: Get API Credentials
You'll get:
- Client ID
- Secret

#### Step 4: Update Environment Variables
Edit `/app/.env` file:
```env
# PayPal Configuration
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_secret_here
PAYPAL_MODE=sandbox  # Change to 'live' for production
```

#### Step 5: Restart Backend
```bash
sudo supervisorctl restart nextjs
```

## Creating Paid Events

### As Admin:

1. Log in with admin credentials
2. Click "Admin Panel" in the header
3. Click "Create Event"
4. Fill in event details:
   - Title, Description, Date, Location (required)
   - Event Type (ride, meetup, race, etc.)
   - Max Attendees (0 for unlimited)
   - **Ticket Price** - Enter amount (0 for free event)
   - **Currency** - Select INR or USD
   - Image URL (optional)
5. Click "Create Event"

### Price Guidelines:
- Set to `0` for free events (users can RSVP without payment)
- Set any amount > 0 to require payment
- Choose INR (₹) for India-based events
- Choose USD ($) for international events

## User Flow for Paid Events

1. User views event list and sees ticket price displayed
2. Clicks "Buy Ticket" button (instead of "RSVP Now")
3. Payment dialog opens with:
   - Event details
   - Ticket quantity selector
   - Payment method chooser (RazorPay/PayPal)
   - Total amount calculation
4. User selects quantity and payment method
5. Clicks "Pay" button
6. Payment gateway checkout opens
7. User completes payment
8. On success:
   - Payment verified
   - User automatically added to event RSVP list
   - Confirmation toast shown

## Testing Payments

### RazorPay Test Cards

**Success Scenario:**
- Card Number: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date

**Failure Scenario:**
- Card Number: 4242 4242 4242 4242
- CVV: Any 3 digits
- Expiry: Any future date

**UPI Testing:**
- Use: `success@razorpay` for successful payment
- Use: `failure@razorpay` for failed payment

### PayPal Testing

1. Use PayPal Sandbox accounts (create in developer dashboard)
2. Personal account for buyer
3. Business account for seller
4. Use sandbox credentials in `.env`

## API Endpoints

### Payment Endpoints

#### Create RazorPay Order
```
POST /api/payments/razorpay/create-order
Headers: Authorization: Bearer <token>
Body: {
  "eventId": "event-uuid",
  "quantity": 1
}
Response: {
  "orderId": "order_xxx",
  "amount": 50000,
  "currency": "INR",
  "key": "rzp_test_xxx"
}
```

#### Verify RazorPay Payment
```
POST /api/payments/razorpay/verify-payment
Headers: Authorization: Bearer <token>
Body: {
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "signature"
}
Response: {
  "verified": true,
  "paymentId": "payment-uuid"
}
```

#### Create PayPal Order
```
POST /api/payments/paypal/create-order
Headers: Authorization: Bearer <token>
Body: {
  "eventId": "event-uuid",
  "quantity": 1
}
Response: {
  "orderId": "paypal-order-id",
  "paymentId": "payment-uuid"
}
```

#### Capture PayPal Payment
```
POST /api/payments/paypal/capture-order
Headers: Authorization: Bearer <token>
Body: {
  "orderId": "paypal-order-id"
}
Response: {
  "success": true,
  "captureId": "capture-id",
  "status": "COMPLETED"
}
```

#### Get User Payments
```
GET /api/payments/my-payments
Headers: Authorization: Bearer <token>
Response: [
  {
    "id": "payment-uuid",
    "eventId": "event-uuid",
    "amount": 500,
    "currency": "INR",
    "gateway": "razorpay",
    "status": "completed",
    "event": {
      "title": "Event Name",
      "date": "2025-01-15"
    }
  }
]
```

## Database Collections

### Payments Collection Schema
```javascript
{
  id: String (UUID),
  userId: String,
  eventId: String,
  amount: Number,
  currency: String,
  gateway: String ('razorpay' | 'paypal'),
  gatewayOrderId: String,
  gatewayPaymentId: String,
  quantity: Number,
  status: String ('pending' | 'completed' | 'failed' | 'refunded'),
  userEmail: String,
  userName: String,
  metadata: Object,
  createdAt: ISO Date,
  updatedAt: ISO Date,
  completedAt: ISO Date (optional)
}
```

### Updated Events Collection
```javascript
{
  id: String (UUID),
  creatorId: String,
  title: String,
  description: String,
  date: String,
  location: String,
  eventType: String,
  maxAttendees: Number,
  imageUrl: String,
  ticketPrice: Number,           // NEW
  currency: String,              // NEW ('INR' | 'USD')
  requiresPayment: Boolean,      // NEW (auto-calculated)
  rsvps: Array[String],
  createdAt: ISO Date,
  updatedAt: ISO Date
}
```

## Security Best Practices

1. **Never expose secrets in frontend code**
   - Only `NEXT_PUBLIC_*` variables are accessible in frontend
   - Keep `RAZORPAY_KEY_SECRET` and `PAYPAL_CLIENT_SECRET` server-side only

2. **Always verify payment signatures**
   - RazorPay signature verification is mandatory
   - PayPal orders should be captured server-side

3. **Use HTTPS in production**
   - Payment gateways require HTTPS
   - Set up SSL certificate for your domain

4. **Implement webhook verification**
   - Always verify webhook signatures
   - Use webhook secrets from payment gateway dashboard

5. **Rate limiting**
   - Implement rate limiting on payment endpoints
   - Prevent abuse and DDoS attacks

## Troubleshooting

### Issue: "Invalid API Key"
**Solution:** 
- Verify you copied the correct keys from dashboard
- Check if using test keys with test mode, live keys with live mode
- Restart backend after updating `.env`

### Issue: "Payment verification failed"
**Solution:**
- Check webhook setup in dashboard
- Verify webhook secret in `.env`
- Check backend logs for detailed error

### Issue: "RazorPay checkout not opening"
**Solution:**
- Check browser console for errors
- Verify `NEXT_PUBLIC_RAZORPAY_KEY_ID` is set correctly
- Clear browser cache and try again

### Issue: "PayPal error"
**Solution:**
- Verify PayPal credentials are correct
- Check `PAYPAL_MODE` is set to `sandbox` for testing
- Ensure API credentials match the mode (sandbox/live)

## Going Live

### Pre-Production Checklist:

1. **RazorPay:**
   - [ ] Complete KYC verification
   - [ ] Switch from test to live keys
   - [ ] Update webhook URL to production domain
   - [ ] Test with small real transactions

2. **PayPal:**
   - [ ] Complete business verification
   - [ ] Switch from sandbox to live credentials
   - [ ] Update `PAYPAL_MODE=live`
   - [ ] Test with small real transactions

3. **Backend:**
   - [ ] Set up proper error logging
   - [ ] Implement monitoring for payment failures
   - [ ] Set up automated reconciliation
   - [ ] Configure backup and disaster recovery

4. **Legal & Compliance:**
   - [ ] Add terms and conditions
   - [ ] Display refund policy
   - [ ] Ensure PCI compliance
   - [ ] Add privacy policy for payment data

## Support

For technical issues:
- Check backend logs: `tail -f /var/log/supervisor/nextjs.out.log`
- RazorPay Support: https://razorpay.com/support/
- PayPal Developer Support: https://developer.paypal.com/support/

## Cost Structure

### RazorPay:
- No setup fees
- 2% per transaction (standard pricing)
- Instant settlements available
- More details: https://razorpay.com/pricing/

### PayPal:
- No setup fees
- ~4.4% + fixed fee per transaction
- Currency conversion fees apply
- More details: https://www.paypal.com/in/webapps/mpp/merchant-fees

---

**Note:** Always test thoroughly in sandbox/test mode before going live with real transactions.
