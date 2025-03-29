import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { subscriptionAPI } from '../api';

// Get subscription status
export const getSubscriptionStatus = createAsyncThunk(
  'subscription/getSubscriptionStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await subscriptionAPI.getSubscriptionStatus();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get subscription status'
      );
    }
  }
);

// Create subscription
export const createSubscription = createAsyncThunk(
  'subscription/createSubscription',
  async (plan, { rejectWithValue }) => {
    try {
      const response = await subscriptionAPI.createSubscription(plan);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create subscription'
      );
    }
  }
);

const initialState = {
  subscriptionStatus: {
    active: false,
    plan: 'free',
    expiresAt: null
  },
  paymentDetails: null,
  loading: false,
  error: null
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    clearSubscriptionError: (state) => {
      state.error = null;
    },
    clearPaymentDetails: (state) => {
      state.paymentDetails = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get Subscription Status
      .addCase(getSubscriptionStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSubscriptionStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptionStatus = action.payload;
      })
      .addCase(getSubscriptionStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create Subscription
      .addCase(createSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentDetails = action.payload;
      })
      .addCase(createSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearSubscriptionError, clearPaymentDetails } = subscriptionSlice.actions;

export default subscriptionSlice.reducer; 