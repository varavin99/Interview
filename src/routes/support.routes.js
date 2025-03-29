const express = require('express');
const { body, param } = require('express-validator');
const { 
  submitSupportRequest,
  getUserSupportTickets,
  getTicketDetails,
  respondToTicket
} = require('../controllers/support.controller');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * @swagger
 * /api/support/contact:
 *   post:
 *     summary: Submit a support request
 *     tags: [Support]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subject
 *               - message
 *             properties:
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Support request submitted successfully
 */
router.post(
  '/contact',
  auth,
  [
    body('subject').not().isEmpty().withMessage('Subject is required'),
    body('message').not().isEmpty().withMessage('Message is required')
  ],
  submitSupportRequest
);

/**
 * @swagger
 * /api/support/tickets:
 *   get:
 *     summary: Get user's support tickets
 *     tags: [Support]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's support tickets
 */
router.get('/tickets', auth, getUserSupportTickets);

/**
 * @swagger
 * /api/support/tickets/{ticketId}:
 *   get:
 *     summary: Get ticket details
 *     tags: [Support]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Support ticket details
 */
router.get(
  '/tickets/:ticketId',
  auth,
  [
    param('ticketId').isMongoId().withMessage('Invalid ticket ID')
  ],
  getTicketDetails
);

/**
 * @swagger
 * /api/support/tickets/{ticketId}/respond:
 *   post:
 *     summary: Add response to a support ticket
 *     tags: [Support]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Response added successfully
 */
router.post(
  '/tickets/:ticketId/respond',
  auth,
  [
    param('ticketId').isMongoId().withMessage('Invalid ticket ID'),
    body('message').not().isEmpty().withMessage('Message is required')
  ],
  respondToTicket
);

module.exports = router; 