const express = require('express');
const { body } = require('express-validator');
const { 
  getSubscriptionStatus,
  createSubscription,
  handlePaymentWebhook
} = require('../controllers/subscription.controller');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * @swagger
 * /api/subscriptions/status:
 *   get:
 *     summary: Get user's subscription status
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User subscription status
 */
router.get('/status', auth, getSubscriptionStatus);

/**
 * @swagger
 * /api/subscriptions/create:
 *   post:
 *     summary: Initiate subscription purchase
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - plan
 *             properties:
 *               plan:
 *                 type: string
 *                 enum: [premium]
 *     responses:
 *       200:
 *         description: Subscription purchase initiated
 */
router.post(
  '/create',
  auth,
  [
    body('plan')
      .isIn(['premium'])
      .withMessage('Invalid subscription plan')
  ],
  createSubscription
);

/**
 * @swagger
 * /api/subscriptions/webhook:
 *   post:
 *     summary: Handle payment notifications from CloudPayments
 *     tags: [Subscriptions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - status
 *             properties:
 *               orderId:
 *                 type: string
 *               status:
 *                 type: string
 *               transactionId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 */
router.post('/webhook', handlePaymentWebhook);

module.exports = router; 