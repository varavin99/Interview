const Interview = require('../models/interview.model');
const Question = require('../models/question.model');
const User = require('../models/user.model');
const { validationResult } = require('express-validator');
const axios = require('axios');

/**
 * @desc    Get available technical interview types/levels
 * @route   GET /api/interviews/technical
 * @access  Private
 */
const getTechnicalInterviewTypes = async (req, res) => {
  try {
    // Return available levels for technical interviews
    res.status(200).json({
      levels: ["intern", "junior", "middle"]
    });
  } catch (error) {
    console.error('Get interview types error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * @desc    Start a new technical interview
 * @route   POST /api/interviews/technical/start
 * @access  Private
 */
const startTechnicalInterview = async (req, res) => {
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

    const { level } = req.body;
    const userId = req.user._id;

    // Check if user has an active interview
    const activeInterview = await Interview.findOne({
      userId,
      status: 'in-progress'
    });

    if (activeInterview) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active interview. Please complete it first.'
      });
    }

    // Check for subscription limits if user is on free plan
    if (req.user.subscription.plan === 'free') {
      const completedInterviewsToday = await Interview.countDocuments({
        userId,
        startTime: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        status: { $ne: 'abandoned' }
      });

      if (completedInterviewsToday >= 2) {
        return res.status(403).json({
          success: false,
          message: 'Free users can only take 2 interviews per day. Please upgrade your subscription.'
        });
      }
    }

    // Get 4 random questions for the technical interview at specified level
    const questions = await Question.aggregate([
      { 
        $match: { 
          type: 'technical', 
          level, 
          isActive: true 
        } 
      },
      { $sample: { size: 4 } }
    ]);

    if (questions.length < 4) {
      return res.status(404).json({
        success: false,
        message: 'Not enough questions available for this interview type and level.'
      });
    }

    // Create new interview
    const interview = new Interview({
      userId,
      type: 'technical',
      level,
      questions: questions.map(q => ({
        questionId: q._id,
        question: q.question
      })),
      status: 'in-progress'
    });

    await interview.save();

    // Format questions for response (don't include answer examples)
    const formattedQuestions = interview.questions.map(q => ({
      questionId: q.questionId,
      question: q.question
    }));

    res.status(201).json({
      interviewId: interview._id,
      questions: formattedQuestions
    });
  } catch (error) {
    console.error('Start interview error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during interview creation'
    });
  }
};

/**
 * @desc    Submit answer for a question in a technical interview
 * @route   POST /api/interviews/technical/:interviewId/answer
 * @access  Private
 */
const submitAnswer = async (req, res) => {
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

    const { questionId, answer } = req.body;
    const { interviewId } = req.params;
    const userId = req.user._id;

    // Find the interview
    const interview = await Interview.findOne({
      _id: interviewId,
      userId,
      status: 'in-progress'
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found or already completed'
      });
    }

    // Find the question in the interview
    const questionIndex = interview.questions.findIndex(
      q => q.questionId.toString() === questionId
    );

    if (questionIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'Question not found in this interview'
      });
    }

    // Check if question already has an answer
    if (interview.questions[questionIndex].userAnswer) {
      return res.status(400).json({
        success: false,
        message: 'This question has already been answered'
      });
    }

    // Get the original question for AI evaluation
    const originalQuestion = await Question.findById(questionId);
    if (!originalQuestion) {
      return res.status(404).json({
        success: false,
        message: 'Original question not found'
      });
    }

    // Save the user's answer
    interview.questions[questionIndex].userAnswer = answer;

    // If user is on paid plan, evaluate answer with OpenAI
    let aiEvaluation = null;
    if (req.user.subscription.isActive) {
      try {
        // Get AI evaluation of the answer
        const aiResponse = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-4',
            messages: [
              {
                role: 'system',
                content: 'You are an expert technical interviewer. Evaluate the candidate\'s answer to the given question on a scale of 0-100, and provide brief feedback on strengths and weaknesses.'
              },
              {
                role: 'user',
                content: `Question: ${originalQuestion.question}\nExample good answer: ${originalQuestion.exampleAnswer}\nCandidate answer: ${answer}\n\nPlease score the answer on a scale of 0-100 and provide brief feedback on strengths and weaknesses.`
              }
            ],
            temperature: 0.7
          },
          {
            headers: {
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        );

        const aiResponseText = aiResponse.data.choices[0].message.content;

        // Parse score from response (assuming the AI includes a numeric score in its response)
        const scoreMatch = aiResponseText.match(/\b([0-9]{1,2}|100)\b/);
        const score = scoreMatch ? parseInt(scoreMatch[0]) : 70; // Default to 70 if parsing fails

        aiEvaluation = {
          score,
          feedback: aiResponseText
        };
      } catch (aiError) {
        console.error('AI evaluation error:', aiError);
        // If AI evaluation fails, continue without it
        aiEvaluation = {
          score: null,
          feedback: 'Automatic evaluation is currently unavailable.'
        };
      }
    }

    // Save AI evaluation if available
    if (aiEvaluation) {
      interview.questions[questionIndex].aiEvaluation = aiEvaluation;
    }

    await interview.save();

    // Find next unanswered question
    const nextQuestion = interview.questions.find(q => !q.userAnswer);

    res.status(200).json({
      success: true,
      nextQuestion: nextQuestion ? {
        questionId: nextQuestion.questionId,
        question: nextQuestion.question
      } : null
    });
  } catch (error) {
    console.error('Submit answer error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during answer submission'
    });
  }
};

/**
 * @desc    Complete a technical interview and generate results
 * @route   POST /api/interviews/technical/:interviewId/complete
 * @access  Private
 */
const completeInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const userId = req.user._id;

    // Find the interview
    const interview = await Interview.findOne({
      _id: interviewId,
      userId,
      status: 'in-progress'
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found or already completed'
      });
    }

    // Check if all questions have been answered
    const unansweredQuestions = interview.questions.filter(q => !q.userAnswer);
    if (unansweredQuestions.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Please answer all questions before completing the interview. ${unansweredQuestions.length} question(s) remaining.`
      });
    }

    // Calculate overall score (average of question scores)
    const answeredQuestions = interview.questions.filter(
      q => q.aiEvaluation && q.aiEvaluation.score !== null
    );

    let overallScore = 0;
    if (answeredQuestions.length > 0) {
      const totalScore = answeredQuestions.reduce(
        (sum, q) => sum + q.aiEvaluation.score,
        0
      );
      overallScore = Math.round(totalScore / answeredQuestions.length);
    } else {
      // If no AI evaluations, set a default passing score
      overallScore = 70;
    }

    // Determine if interview is passed (score >= 70)
    const passed = overallScore >= 70;

    // Update interview status and results
    interview.status = 'completed';
    interview.endTime = Date.now();
    interview.overallScore = overallScore;
    interview.passed = passed;
    interview.feedbackDelivered = true;

    await interview.save();

    res.status(200).json({
      score: overallScore,
      passed,
      feedback: interview.questions.map(q => ({
        question: q.question,
        answer: q.userAnswer,
        evaluation: q.aiEvaluation || {
          score: null,
          feedback: 'No evaluation available for this answer.'
        }
      }))
    });
  } catch (error) {
    console.error('Complete interview error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during interview completion'
    });
  }
};

/**
 * @desc    Get user's interview history
 * @route   GET /api/interviews/history
 * @access  Private
 */
const getInterviewHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get interviews sorted by date (newest first)
    const interviews = await Interview.find({ userId })
      .sort({ startTime: -1 })
      .select('type level startTime endTime status overallScore passed');

    res.status(200).json({
      interviews
    });
  } catch (error) {
    console.error('Get interview history error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching interview history'
    });
  }
};

module.exports = {
  getTechnicalInterviewTypes,
  startTechnicalInterview,
  submitAnswer,
  completeInterview,
  getInterviewHistory
}; 