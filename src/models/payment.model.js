const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  amount: {
    type: Number,
    required: [true, 'Payment amount is required']
  },
  currency: {
    type: String,
    default: 'RUB',
    required: [true, 'Currency is required']
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
    required: [true, 'Payment status is required']
  },
  paymentMethod: {
    type: String,
    required: [true, 'Payment method is required']
  },
  subscriptionPeriod: {
    type: String,
    enum: ['monthly', 'yearly'],
    required: [true, 'Subscription period is required']
  },
  transactionDate: {
    type: Date,
    default: Date.now
  },
  externalPaymentId: String,
  metadata: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
paymentSchema.index({ userId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ externalPaymentId: 1 });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment; 