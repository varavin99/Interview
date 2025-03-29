const User = require('../models/user.model');
const { validationResult } = require('express-validator');

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateProfile = async (req, res) => {
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

    const { email, gender, age } = req.body;
    const userId = req.user._id;

    // Check if email already exists (for a different user)
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== userId.toString()) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use by another account'
        });
      }
    }

    // Find user and update
    const user = await User.findById(userId);
    
    // If email is changed, require re-verification
    if (email && email !== user.email) {
      user.email = email;
      user.isEmailVerified = false;
      // Here we would also generate a new verification token and send email
      // But for simplicity, we'll skip that in this implementation
    }
    
    if (gender) user.gender = gender;
    if (age) user.age = age;

    await user.save();

    // Return updated user data
    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        gender: user.gender,
        age: user.age,
        isEmailVerified: user.isEmailVerified,
        subscription: user.subscription
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during profile update'
    });
  }
};

/**
 * @desc    Change user password
 * @route   PUT /api/users/password
 * @access  Private
 */
const changePassword = async (req, res) => {
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

    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    // Find user
    const user = await User.findById(userId);

    // Check if current password is correct
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.passwordHash = newPassword; // will be hashed by pre-save hook
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during password change'
    });
  }
};

module.exports = {
  updateProfile,
  changePassword
}; 