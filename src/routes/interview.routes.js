const express = require('express');
const { body, param } = require('express-validator');
const { 
  getTechnicalInterviewTypes,
  startTechnicalInterview,
  submitAnswer,
  completeInterview,
  getInterviewHistory
} = require('../controllers/interview.controller');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * @swagger
 * /api/interviews/technical:
 *   get:
 *     summary: Get available technical interview types/levels
 *     tags: [Interviews]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns available interview levels
 */
router.get('/technical', auth, getTechnicalInterviewTypes);

/**
 * @swagger
 * /api/interviews/technical/start:
 *   post:
 *     summary: Start a new technical interview
 *     tags: [Interviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - level
 *             properties:
 *               level:
 *                 type: string
 *                 enum: [intern, junior, middle]
 *     responses:
 *       201:
 *         description: Interview created successfully
 */
router.post(
  '/technical/start',
  auth,
  [
    body('level')
      .isIn(['intern', 'junior', 'middle'])
      .withMessage('Invalid interview level')
  ],
  startTechnicalInterview
);

/**
 * @swagger
 * /api/interviews/technical/{interviewId}/answer:
 *   post:
 *     summary: Submit answer for a question
 *     tags: [Interviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: interviewId
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
 *               - questionId
 *               - answer
 *             properties:
 *               questionId:
 *                 type: string
 *               answer:
 *                 type: string
 *     responses:
 *       200:
 *         description: Answer submitted successfully
 */
router.post(
  '/technical/:interviewId/answer',
  auth,
  [
    param('interviewId').isMongoId().withMessage('Invalid interview ID'),
    body('questionId').isMongoId().withMessage('Invalid question ID'),
    body('answer').not().isEmpty().withMessage('Answer is required')
  ],
  submitAnswer
);

/**
 * @swagger
 * /api/interviews/technical/{interviewId}/complete:
 *   post:
 *     summary: Complete an interview and get results
 *     tags: [Interviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: interviewId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Interview completed successfully
 */
router.post(
  '/technical/:interviewId/complete',
  auth,
  [
    param('interviewId').isMongoId().withMessage('Invalid interview ID')
  ],
  completeInterview
);

/**
 * @swagger
 * /api/interviews/history:
 *   get:
 *     summary: Get user's interview history
 *     tags: [Interviews]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Interview history retrieved successfully
 */
router.get('/history', auth, getInterviewHistory);

module.exports = router; 