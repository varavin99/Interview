import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized responses
    if (error.response && error.response.status === 401) {
      // Clear auth data
      localStorage.removeItem('token');
      
      // If not already on auth page, redirect to login
      if (!window.location.pathname.includes('/login') &&
          !window.location.pathname.includes('/register') &&
          !window.location.pathname.includes('/verify-email') &&
          !window.location.pathname.includes('/forgot-password') &&
          !window.location.pathname.includes('/reset-password')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Authentication API calls
export const authAPI = {
  // Register a new user
  register: (userData) => api.post('/auth/register', userData),
  
  // Verify email
  verifyEmail: (token) => api.post('/auth/verify-email', { token }),
  
  // Login user
  login: (credentials) => api.post('/auth/login', credentials),
  
  // Forgot password
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  
  // Reset password
  resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword }),
  
  // Get current user
  getCurrentUser: () => api.get('/auth/me')
};

// User API calls
export const userAPI = {
  // Update user profile
  updateProfile: (userData) => api.put('/users/profile', userData),
  
  // Change password
  changePassword: (passwordData) => api.put('/users/password', passwordData)
};

// Interview API calls
export const interviewAPI = {
  // Get available technical interview types
  getTechnicalInterviewTypes: () => api.get('/interviews/technical'),
  
  // Start a new technical interview
  startTechnicalInterview: (level) => api.post('/interviews/technical/start', { level }),
  
  // Submit answer for a question
  submitAnswer: (interviewId, questionId, answer) => 
    api.post(`/interviews/technical/${interviewId}/answer`, { questionId, answer }),
  
  // Complete interview and get results
  completeInterview: (interviewId) => api.post(`/interviews/technical/${interviewId}/complete`),
  
  // Get interview history
  getInterviewHistory: () => api.get('/interviews/history')
};

// Subscription API calls
export const subscriptionAPI = {
  // Get subscription status
  getSubscriptionStatus: () => api.get('/subscriptions/status'),
  
  // Create subscription
  createSubscription: (plan) => api.post('/subscriptions/create', { plan })
};

// Support API calls
export const supportAPI = {
  // Submit support request
  submitSupportRequest: (data) => api.post('/support/contact', data),
  
  // Get user support tickets
  getSupportTickets: () => api.get('/support/tickets'),
  
  // Get ticket details
  getTicketDetails: (ticketId) => api.get(`/support/tickets/${ticketId}`),
  
  // Add response to ticket
  respondToTicket: (ticketId, message) => 
    api.post(`/support/tickets/${ticketId}/respond`, { message })
};

export default api; 