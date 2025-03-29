const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['technical', 'hr', 'manager'],
    required: [true, 'Question type is required']
  },
  level: {
    type: String,
    enum: ['intern', 'junior', 'middle'],
    required: [true, 'Question level is required']
  },
  question: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true
  },
  exampleAnswer: {
    type: String,
    required: [true, 'Example answer is required'],
    trim: true
  },
  tags: {
    type: [String],
    default: []
  },
  difficulty: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Difficulty level is required']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
questionSchema.index({ type: 1, level: 1, isActive: 1 });
questionSchema.index({ tags: 1 });

const Question = mongoose.model('Question', questionSchema);

module.exports = Question; 