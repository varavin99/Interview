import { configureStore } from '@reduxjs/toolkit';
import authReducer from './services/slices/authSlice';
import interviewReducer from './services/slices/interviewSlice';
import subscriptionReducer from './services/slices/subscriptionSlice';
import supportReducer from './services/slices/supportSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    interview: interviewReducer,
    subscription: subscriptionReducer,
    support: supportReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  })
});

export default store; 