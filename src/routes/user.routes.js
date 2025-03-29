const express = require('express');
const { body } = require('express-validator');
const { updateProfile, changePassword } = require('../controllers/user.controller');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               gender:
 *                 type: string
 *               age:
 *                 type: number
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.put(
  '/profile',
  auth,
  [
    body('email').optional().isEmail().withMessage('Please provide a valid email'),
    body('gender')
      .optional()
      .isIn(['male', 'female', 'other', 'prefer not to say'])
      .withMessage('Gender must be valid'),
    body('age')
      .optional()
      .isInt({ min: 16, max: 100 })
      .withMessage('Age must be between 16 and 100')
  ],
  updateProfile
);

/**
 * @swagger
 * /api/users/password:
 *   put:
 *     summary: Change user password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 */
router.put(
  '/password',
  auth,
  [
    body('currentPassword').not().isEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters')
  ],
  changePassword
);

module.exports = router; 