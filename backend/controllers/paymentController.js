import Razorpay from 'razorpay';
import crypto from 'crypto';
import { PaymentModel } from '../models/Payment.js';
import { EventModel } from '../models/Event.js';
import { getDatabase } from '../config/database.js';
import { 
  RAZORPAY_KEY_ID, 
  RAZORPAY_KEY_SECRET, 
  RAZORPAY_WEBHOOK_SECRET,
  PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_SECRET,
  PAYPAL_MODE,
  PAYMENT_STATUS,
  PAYMENT_GATEWAYS
} from '../config/constants.js';

// Initialize Razorpay
let razorpayInstance = null;
function getRazorpayInstance() {
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
}

// RazorPay: Create Order
export async function createRazorpayOrder(request, authUser) {
  const db = await getDatabase();
  const paymentModel = new PaymentModel(db);
  const eventModel = new EventModel(db);
  
  const body = await request.json();
  const { eventId, quantity = 1 } = body;
  
  if (!eventId) {
    return Response.json({ error: 'Event ID is required' }, { status: 400 });
  }
  
  // Get event details
  const event = await eventModel.findById(eventId);
  if (!event) {
    return Response.json({ error: 'Event not found' }, { status: 404 });
  }
  
  if (!event.requiresPayment || event.ticketPrice <= 0) {
    return Response.json({ error: 'This event does not require payment' }, { status: 400 });
  }
  
  // Calculate amount (in paise for INR)
  const amount = event.ticketPrice * quantity;
  const amountInPaise = Math.round(amount * 100);
  
  try {
    const razorpay = getRazorpayInstance();
    
    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: event.currency || 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        eventId,
        userId: authUser.userId,
        eventTitle: event.title,
        quantity: quantity.toString()
      }
    });
    
    // Save payment record in database
    const payment = await paymentModel.create({
      userId: authUser.userId,
      eventId,
      amount,
      currency: event.currency || 'INR',
      gateway: PAYMENT_GATEWAYS.RAZORPAY,
      gatewayOrderId: razorpayOrder.id,
      quantity,
      userEmail: authUser.email,
      userName: authUser.name || ''
    });
    
    return Response.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      paymentId: payment.id,
      key: RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('RazorPay order creation error:', error);
    return Response.json({ 
      error: 'Failed to create payment order', 
      details: error.message 
    }, { status: 500 });
  }
}

// RazorPay: Verify Payment
export async function verifyRazorpayPayment(request, authUser) {
  const db = await getDatabase();
  const paymentModel = new PaymentModel(db);
  const eventModel = new EventModel(db);
  
  const body = await request.json();
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
  
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return Response.json({ error: 'Missing payment verification data' }, { status: 400 });
  }
  
  try {
    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");
    
    if (expectedSignature !== razorpay_signature) {
      return Response.json({ 
        verified: false, 
        error: 'Invalid payment signature' 
      }, { status: 400 });
    }
    
    // Find payment by gateway order ID
    const payment = await paymentModel.findByGatewayOrderId(razorpay_order_id);
    if (!payment) {
      return Response.json({ error: 'Payment record not found' }, { status: 404 });
    }
    
    // Update payment status
    await paymentModel.updateStatus(payment.id, PAYMENT_STATUS.COMPLETED, {
      gatewayPaymentId: razorpay_payment_id,
      razorpay_signature
    });
    
    // Add user to event RSVPs
    const event = await eventModel.findById(payment.eventId);
    if (event) {
      const rsvps = event.rsvps || [];
      if (!rsvps.includes(authUser.userId)) {
        await eventModel.addRSVP(payment.eventId, authUser.userId);
      }
    }
    
    return Response.json({ 
      verified: true, 
      paymentId: payment.id,
      message: 'Payment verified successfully'
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return Response.json({ 
      verified: false, 
      error: 'Payment verification failed',
      details: error.message
    }, { status: 500 });
  }
}

// RazorPay: Webhook Handler
export async function razorpayWebhook(request) {
  const db = await getDatabase();
  const paymentModel = new PaymentModel(db);
  
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');
    
    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest('hex');
    
    if (signature !== expectedSignature) {
      return Response.json({ error: 'Invalid webhook signature' }, { status: 400 });
    }
    
    const event = JSON.parse(body);
    
    // Handle different webhook events
    if (event.event === 'payment.captured') {
      const razorpayPayment = event.payload.payment.entity;
      const orderId = razorpayPayment.order_id;
      const paymentId = razorpayPayment.id;
      
      const payment = await paymentModel.findByGatewayOrderId(orderId);
      if (payment) {
        await paymentModel.updateStatus(payment.id, PAYMENT_STATUS.COMPLETED, {
          gatewayPaymentId: paymentId,
          webhookProcessed: true
        });
      }
    } else if (event.event === 'payment.failed') {
      const razorpayPayment = event.payload.payment.entity;
      const orderId = razorpayPayment.order_id;
      
      const payment = await paymentModel.findByGatewayOrderId(orderId);
      if (payment) {
        await paymentModel.updateStatus(payment.id, PAYMENT_STATUS.FAILED, {
          webhookProcessed: true,
          failureReason: razorpayPayment.error_description
        });
      }
    }
    
    return Response.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return Response.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

// PayPal: Create Order
export async function createPayPalOrder(request, authUser) {
  const db = await getDatabase();
  const paymentModel = new PaymentModel(db);
  const eventModel = new EventModel(db);
  
  const body = await request.json();
  const { eventId, quantity = 1 } = body;
  
  if (!eventId) {
    return Response.json({ error: 'Event ID is required' }, { status: 400 });
  }
  
  // Get event details
  const event = await eventModel.findById(eventId);
  if (!event) {
    return Response.json({ error: 'Event not found' }, { status: 404 });
  }
  
  if (!event.requiresPayment || event.ticketPrice <= 0) {
    return Response.json({ error: 'This event does not require payment' }, { status: 400 });
  }
  
  // Calculate amount
  const amount = event.ticketPrice * quantity;
  const unitAmount = event.ticketPrice;
  
  try {
    // Get PayPal access token
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
    const tokenResponse = await fetch(
      `https://api-m.${PAYPAL_MODE}.paypal.com/v1/oauth2/token`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
      }
    );
    
    if (!tokenResponse.ok) {
      throw new Error('Failed to get PayPal access token');
    }
    
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    
    // Create PayPal order
    const orderResponse = await fetch(
      `https://api-m.${PAYPAL_MODE}.paypal.com/v2/checkout/orders`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [{
            reference_id: eventId,
            description: `Ticket for ${event.title}`,
            custom_id: `event_${eventId}`,
            amount: {
              currency_code: 'USD',
              value: amount.toFixed(2),
              breakdown: {
                item_total: {
                  currency_code: 'USD',
                  value: amount.toFixed(2)
                }
              }
            },
            items: [{
              name: event.title,
              quantity: quantity.toString(),
              unit_amount: {
                currency_code: 'USD',
                value: unitAmount.toFixed(2)
              },
              category: 'DIGITAL_GOODS'
            }]
          }],
          application_context: {
            brand_name: 'The Moto Saga',
            landing_page: 'NO_PREFERENCE',
            user_action: 'PAY_NOW'
          }
        })
      }
    );
    
    if (!orderResponse.ok) {
      const errorData = await orderResponse.json();
      throw new Error(errorData.message || 'Failed to create PayPal order');
    }
    
    const orderData = await orderResponse.json();
    
    // Save payment record in database
    const payment = await paymentModel.create({
      userId: authUser.userId,
      eventId,
      amount,
      currency: 'USD',
      gateway: PAYMENT_GATEWAYS.PAYPAL,
      gatewayOrderId: orderData.id,
      quantity,
      userEmail: authUser.email,
      userName: authUser.name || ''
    });
    
    return Response.json({
      orderId: orderData.id,
      paymentId: payment.id
    });
  } catch (error) {
    console.error('PayPal order creation error:', error);
    return Response.json({ 
      error: 'Failed to create PayPal order', 
      details: error.message 
    }, { status: 500 });
  }
}

// PayPal: Capture Payment
export async function capturePayPalOrder(request, authUser) {
  const db = await getDatabase();
  const paymentModel = new PaymentModel(db);
  const eventModel = new EventModel(db);
  
  const body = await request.json();
  const { orderId } = body;
  
  if (!orderId) {
    return Response.json({ error: 'Order ID is required' }, { status: 400 });
  }
  
  try {
    // Get PayPal access token
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
    const tokenResponse = await fetch(
      `https://api-m.${PAYPAL_MODE}.paypal.com/v1/oauth2/token`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
      }
    );
    
    if (!tokenResponse.ok) {
      throw new Error('Failed to get PayPal access token');
    }
    
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    
    // Capture the order
    const captureResponse = await fetch(
      `https://api-m.${PAYPAL_MODE}.paypal.com/v2/checkout/orders/${orderId}/capture`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!captureResponse.ok) {
      const errorData = await captureResponse.json();
      throw new Error(errorData.message || 'Failed to capture PayPal payment');
    }
    
    const captureData = await captureResponse.json();
    const captureId = captureData.purchase_units[0].payments.captures[0].id;
    
    // Find and update payment
    const payment = await paymentModel.findByGatewayOrderId(orderId);
    if (!payment) {
      return Response.json({ error: 'Payment record not found' }, { status: 404 });
    }
    
    await paymentModel.updateStatus(payment.id, PAYMENT_STATUS.COMPLETED, {
      gatewayPaymentId: captureId,
      captureData
    });
    
    // Add user to event RSVPs
    const event = await eventModel.findById(payment.eventId);
    if (event) {
      const rsvps = event.rsvps || [];
      if (!rsvps.includes(authUser.userId)) {
        await eventModel.addRSVP(payment.eventId, authUser.userId);
      }
    }
    
    return Response.json({
      success: true,
      captureId,
      paymentId: payment.id,
      status: captureData.status
    });
  } catch (error) {
    console.error('PayPal capture error:', error);
    return Response.json({ 
      error: 'Failed to capture payment', 
      details: error.message 
    }, { status: 500 });
  }
}

// Get payment details
export async function getPaymentDetails(paymentId, authUser) {
  const db = await getDatabase();
  const paymentModel = new PaymentModel(db);
  const eventModel = new EventModel(db);
  
  const payment = await paymentModel.findById(paymentId);
  if (!payment) {
    return Response.json({ error: 'Payment not found' }, { status: 404 });
  }
  
  // Users can only view their own payments, admins can view all
  if (payment.userId !== authUser.userId && authUser.role !== 'admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 403 });
  }
  
  // Get event details
  const event = await eventModel.findById(payment.eventId);
  if (event) {
    payment.event = {
      id: event.id,
      title: event.title,
      date: event.date,
      location: event.location
    };
  }
  
  return Response.json(payment);
}

// Get user's payments
export async function getUserPayments(authUser) {
  const db = await getDatabase();
  const paymentModel = new PaymentModel(db);
  const eventModel = new EventModel(db);
  
  const payments = await paymentModel.findByUser(authUser.userId);
  
  // Populate event details
  for (let payment of payments) {
    const event = await eventModel.findById(payment.eventId);
    if (event) {
      payment.event = {
        id: event.id,
        title: event.title,
        date: event.date,
        location: event.location,
        imageUrl: event.imageUrl
      };
    }
  }
  
  return Response.json(payments);
}
