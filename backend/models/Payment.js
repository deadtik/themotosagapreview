import { v4 as uuidv4 } from 'uuid';
import { PAYMENT_STATUS, PAYMENT_GATEWAYS } from '../config/constants.js';

export class PaymentModel {
  constructor(db) {
    this.collection = db.collection('payments');
  }

  async create(paymentData) {
    const {
      userId,
      eventId,
      amount,
      currency,
      gateway,
      gatewayOrderId,
      quantity,
      userEmail,
      userName
    } = paymentData;

    if (!userId || !eventId || !amount || !gateway) {
      throw new Error('Missing required payment fields');
    }

    const payment = {
      id: uuidv4(),
      userId,
      eventId,
      amount,
      currency: currency || 'INR',
      gateway,
      gatewayOrderId: gatewayOrderId || '',
      gatewayPaymentId: '',
      quantity: quantity || 1,
      status: PAYMENT_STATUS.PENDING,
      userEmail: userEmail || '',
      userName: userName || '',
      metadata: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await this.collection.insertOne(payment);
    return payment;
  }

  async findById(id) {
    return await this.collection.findOne({ id });
  }

  async findByGatewayOrderId(gatewayOrderId) {
    return await this.collection.findOne({ gatewayOrderId });
  }

  async findByUser(userId) {
    return await this.collection
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();
  }

  async findByEvent(eventId) {
    return await this.collection
      .find({ eventId })
      .sort({ createdAt: -1 })
      .toArray();
  }

  async updateStatus(paymentId, status, metadata = {}) {
    const updates = {
      status,
      updatedAt: new Date().toISOString()
    };

    if (Object.keys(metadata).length > 0) {
      updates.metadata = metadata;
    }

    if (status === PAYMENT_STATUS.COMPLETED && metadata.gatewayPaymentId) {
      updates.gatewayPaymentId = metadata.gatewayPaymentId;
      updates.completedAt = new Date().toISOString();
    }

    await this.collection.updateOne(
      { id: paymentId },
      { $set: updates }
    );

    return await this.findById(paymentId);
  }

  async getStats() {
    const totalPayments = await this.collection.countDocuments();
    const completedPayments = await this.collection.countDocuments({ 
      status: PAYMENT_STATUS.COMPLETED 
    });
    
    const revenueResult = await this.collection.aggregate([
      { $match: { status: PAYMENT_STATUS.COMPLETED } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]).toArray();

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    return {
      totalPayments,
      completedPayments,
      totalRevenue
    };
  }
}
