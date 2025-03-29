const SupportTicket = require('../models/supportTicket.model');
const { validationResult } = require('express-validator');

/**
 * @desc    Submit a support request
 * @route   POST /api/support/contact
 * @access  Private
 */
const submitSupportRequest = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { subject, message } = req.body;
    const userId = req.user._id;

    // Create new support ticket
    const supportTicket = new SupportTicket({
      userId,
      subject,
      message,
      status: 'new',
      responses: [] // Will be populated when staff responds
    });

    await supportTicket.save();

    res.status(201).json({
      success: true,
      ticketId: supportTicket._id,
      message: 'Support request submitted successfully. Our team will respond shortly.'
    });
  } catch (error) {
    console.error('Submit support request error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during support request submission'
    });
  }
};

/**
 * @desc    Get user's support tickets
 * @route   GET /api/support/tickets
 * @access  Private
 */
const getUserSupportTickets = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user's support tickets
    const tickets = await SupportTicket.find({ userId })
      .sort({ createdAt: -1 }) // Newest first
      .select('subject status createdAt updatedAt');

    res.status(200).json({
      tickets
    });
  } catch (error) {
    console.error('Get support tickets error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching support tickets'
    });
  }
};

/**
 * @desc    Get ticket details
 * @route   GET /api/support/tickets/:ticketId
 * @access  Private
 */
const getTicketDetails = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const userId = req.user._id;

    // Find ticket by ID and user ID (to ensure the user can only see their own tickets)
    const ticket = await SupportTicket.findOne({
      _id: ticketId,
      userId
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Support ticket not found'
      });
    }

    res.status(200).json({
      ticket
    });
  } catch (error) {
    console.error('Get ticket details error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching ticket details'
    });
  }
};

/**
 * @desc    Add response to a support ticket
 * @route   POST /api/support/tickets/:ticketId/respond
 * @access  Private
 */
const respondToTicket = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { message } = req.body;
    const { ticketId } = req.params;
    const userId = req.user._id;

    // Find ticket by ID and user ID (to ensure the user can only respond to their own tickets)
    const ticket = await SupportTicket.findOne({
      _id: ticketId,
      userId
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Support ticket not found'
      });
    }

    // Check if ticket is already resolved
    if (ticket.status === 'resolved') {
      return res.status(400).json({
        success: false,
        message: 'This ticket is already resolved. Please create a new ticket if you need further assistance.'
      });
    }

    // Add user response
    ticket.responses.push({
      message,
      isStaff: false,
      createdAt: Date.now()
    });

    // Update ticket status to in-progress if it was new
    if (ticket.status === 'new') {
      ticket.status = 'in-progress';
    }

    await ticket.save();

    res.status(200).json({
      success: true,
      message: 'Response added to support ticket'
    });
  } catch (error) {
    console.error('Respond to ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during ticket response'
    });
  }
};

module.exports = {
  submitSupportRequest,
  getUserSupportTickets,
  getTicketDetails,
  respondToTicket
}; 