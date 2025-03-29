const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

/**
 * Generate JWT token for user authentication
 * @param {Object} user - User object
 * @returns {String} - JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

/**
 * Generate random token for email verification or password reset
 * @returns {String} - Random token
 */
const generateRandomToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Send email using configured email transport
 * @param {Object} options - Email options (to, subject, text, html)
 * @returns {Promise} - Promise that resolves with email send info
 */
const sendEmail = async (options) => {
  // Create email transporter
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // Define email options
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html
  };

  // Send email
  return await transporter.sendMail(mailOptions);
};

module.exports = {
  generateToken,
  generateRandomToken,
  sendEmail
}; 