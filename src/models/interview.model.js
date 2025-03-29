const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  type: {
    type: String,
    enum: ['technical', 'hr', 'manager'],
    required: [true, 'Interview type is required']
  },
  level: {
    type: String,
    enum: ['intern', 'junior', 'middle'],
    required: [true, 'Interview level is required']
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: Date,
  questions: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
      },
      question: {
        type: String,
        required: true
      },
      userAnswer: String,
      aiEvaluation: {
        score: Number,
        feedback: String
      }
    }
  ],
  overallScore: Number,
  passed: Boolean,
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'abandoned'],
    default: 'in-progress'
  },
  feedbackDelivered: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
interviewSchema.index({ userId: 1, status: 1 });
interviewSchema.index({ userId: 1, type: 1, level: 1 });

const Interview = mongoose.model('Interview', interviewSchema);

module.exports = Interview; 