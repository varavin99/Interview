import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supportAPI } from '../api';

// Submit support request
export const submitSupportRequest = createAsyncThunk(
  'support/submitSupportRequest',
  async (data, { rejectWithValue }) => {
    try {
      const response = await supportAPI.submitSupportRequest(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to submit support request'
      );
    }
  }
);

// Get user's support tickets
export const getSupportTickets = createAsyncThunk(
  'support/getSupportTickets',
  async (_, { rejectWithValue }) => {
    try {
      const response = await supportAPI.getSupportTickets();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get support tickets'
      );
    }
  }
);

// Get ticket details
export const getTicketDetails = createAsyncThunk(
  'support/getTicketDetails',
  async (ticketId, { rejectWithValue }) => {
    try {
      const response = await supportAPI.getTicketDetails(ticketId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get ticket details'
      );
    }
  }
);

// Add response to ticket
export const respondToTicket = createAsyncThunk(
  'support/respondToTicket',
  async ({ ticketId, message }, { rejectWithValue }) => {
    try {
      const response = await supportAPI.respondToTicket(ticketId, message);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to respond to ticket'
      );
    }
  }
);

const initialState = {
  tickets: [],
  currentTicket: null,
  requestSubmitted: false,
  responseSubmitted: false,
  loading: false,
  error: null
};

const supportSlice = createSlice({
  name: 'support',
  initialState,
  reducers: {
    clearSupportError: (state) => {
      state.error = null;
    },
    clearRequestSubmitted: (state) => {
      state.requestSubmitted = false;
    },
    clearResponseSubmitted: (state) => {
      state.responseSubmitted = false;
    },
    clearCurrentTicket: (state) => {
      state.currentTicket = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Submit Support Request
      .addCase(submitSupportRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitSupportRequest.fulfilled, (state) => {
        state.loading = false;
        state.requestSubmitted = true;
      })
      .addCase(submitSupportRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get Support Tickets
      .addCase(getSupportTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSupportTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload.tickets;
      })
      .addCase(getSupportTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get Ticket Details
      .addCase(getTicketDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTicketDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTicket = action.payload.ticket;
      })
      .addCase(getTicketDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Respond To Ticket
      .addCase(respondToTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(respondToTicket.fulfilled, (state) => {
        state.loading = false;
        state.responseSubmitted = true;
      })
      .addCase(respondToTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { 
  clearSupportError, 
  clearRequestSubmitted, 
  clearResponseSubmitted,
  clearCurrentTicket
} = supportSlice.actions;

export default supportSlice.reducer; 