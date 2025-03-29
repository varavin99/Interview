const User = require('../models/user.model');
const Payment = require('../models/payment.model');
const crypto = require('crypto');
const axios = require('axios');

/**
 * @desc    Get user's subscription status
 * @route   GET /api/subscriptions/status
 * @access  Private
 */
const getSubscriptionStatus = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get subscription info from user
    const { subscription } = req.user;

    res.status(200).json({
      active: subscription.isActive,
      plan: subscription.plan,
      expiresAt: subscription.endDate
    });
  } catch (error) {
    console.error('Get subscription status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching subscription status'
    });
  }
};

/**
 * @desc    Initiate subscription purchase
 * @route   POST /api/subscriptions/create
 * @access  Private
 */
const createSubscription = async (req, res) => {
  try {
    const { plan } = req.body;
    const userId = req.user._id;

    // Validate plan type
    if (plan !== 'premium') {
      return res.status(400).json({
        success: false,
        message: 'Invalid subscription plan'
      });
    }

    // Check if user already has an active subscription
    if (req.user.subscription.isActive && req.user.subscription.plan === 'premium') {
      return res.status(400).json({
        success: false,
        message: 'You already have an active premium subscription'
      });
    }

    // Create order ID
    const orderId = `order_${crypto.randomBytes(8).toString('hex')}`;

    // Calculate subscription period (1 month from now)
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    // Create payment record
    const payment = new Payment({
      userId,
      amount: 2990, // 2,990 ₽
      currency: 'RUB',
      status: 'pending',
      paymentMethod: 'card', // Default
      subscriptionPeriod: 'monthly',
      metadata: {
        orderId,
        plan
      }
    });

    await payment.save();

    // In a real application, we would integrate with CloudPayments API here
    // For simulation, we'll just return a fake payment URL
    const paymentUrl = `https://pay.cloudpayments.ru/checkout?order=${orderId}`;

    res.status(200).json({
      paymentUrl,
      orderId
    });
  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during subscription creation'
    });
  }
};

/**
 * @desc    Handle payment notification from CloudPayments
 * @route   POST /api/subscriptions/webhook
 * @access  Public
 */
const handlePaymentWebhook = async (req, res) => {
  try {
    // In a real application, we would verify the webhook signature from CloudPayments
    const { orderId, status, transactionId } = req.body;

    // Find the payment by orderId
    const payment = await Payment.findOne({
      'metadata.orderId': orderId
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Update payment status
    payment.status = status === 'completed' ? 'completed' : 'failed';
    payment.externalPaymentId = transactionId;
    await payment.save();

    // If payment was successful, update user's subscription
    if (status === 'completed') {
      const user = await User.findById(payment.userId);

      // Calculate subscription period (1 month from now)
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);

      // Update user's subscription
      user.subscription = {
        isActive: true,
        plan: payment.metadata.plan,
        startDate,
        endDate,
        autoRenew: true,
        paymentId: payment._id
      };

      await user.save();
    }

    res.status(200).json({
      success: true
    });
  } catch (error) {
    console.error('Payment webhook error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during payment processing'
    });
  }
};

module.exports = {
  getSubscriptionStatus,
  createSubscription,
  handlePaymentWebhook
}; 