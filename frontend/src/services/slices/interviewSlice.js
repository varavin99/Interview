import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { interviewAPI } from '../api';

// Get technical interview types
export const getTechnicalInterviewTypes = createAsyncThunk(
  'interview/getTechnicalInterviewTypes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await interviewAPI.getTechnicalInterviewTypes();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get interview types'
      );
    }
  }
);

// Start a new technical interview
export const startTechnicalInterview = createAsyncThunk(
  'interview/startTechnicalInterview',
  async (level, { rejectWithValue }) => {
    try {
      const response = await interviewAPI.startTechnicalInterview(level);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to start interview'
      );
    }
  }
);

// Submit answer for a question
export const submitAnswer = createAsyncThunk(
  'interview/submitAnswer',
  async ({ interviewId, questionId, answer }, { rejectWithValue }) => {
    try {
      const response = await interviewAPI.submitAnswer(interviewId, questionId, answer);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to submit answer'
      );
    }
  }
);

// Complete interview and get results
export const completeInterview = createAsyncThunk(
  'interview/completeInterview',
  async (interviewId, { rejectWithValue }) => {
    try {
      const response = await interviewAPI.completeInterview(interviewId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to complete interview'
      );
    }
  }
);

// Get interview history
export const getInterviewHistory = createAsyncThunk(
  'interview/getInterviewHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await interviewAPI.getInterviewHistory();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get interview history'
      );
    }
  }
);

const initialState = {
  availableLevels: [],
  currentInterview: null,
  questions: [],
  currentQuestion: null,
  results: null,
  interviewHistory: [],
  loading: false,
  error: null
};

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    clearInterviewError: (state) => {
      state.error = null;
    },
    setCurrentQuestion: (state, action) => {
      state.currentQuestion = action.payload;
    },
    clearCurrentInterview: (state) => {
      state.currentInterview = null;
      state.questions = [];
      state.currentQuestion = null;
      state.results = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get Technical Interview Types
      .addCase(getTechnicalInterviewTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTechnicalInterviewTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.availableLevels = action.payload.levels;
      })
      .addCase(getTechnicalInterviewTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Start Technical Interview
      .addCase(startTechnicalInterview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startTechnicalInterview.fulfilled, (state, action) => {
        state.loading = false;
        state.currentInterview = action.payload.interviewId;
        state.questions = action.payload.questions;
        state.currentQuestion = action.payload.questions[0];
        state.results = null;
      })
      .addCase(startTechnicalInterview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Submit Answer
      .addCase(submitAnswer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitAnswer.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuestion = action.payload.nextQuestion;
      })
      .addCase(submitAnswer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Complete Interview
      .addCase(completeInterview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeInterview.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(completeInterview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get Interview History
      .addCase(getInterviewHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getInterviewHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.interviewHistory = action.payload.interviews;
      })
      .addCase(getInterviewHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { 
  clearInterviewError, 
  setCurrentQuestion, 
  clearCurrentInterview 
} = interviewSlice.actions;

export default interviewSlice.reducer; 