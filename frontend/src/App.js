import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';

// Theme
import theme from './theme';

// Components
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AlertMessage from './components/common/AlertMessage';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import Dashboard from './pages/Dashboard/Dashboard';
import SupportPage from './pages/Support/SupportPage';

// Actions
import { loadUser, clearError } from './services/slices/authSlice';

const App = () => {
  const dispatch = useDispatch();
  const { error, isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    // Load user data when app starts
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/support" element={<SupportPage />} />
              
              {/* TODO: Add these pages when they are implemented */}
              <Route path="/new-interview" element={<div>New Interview Page</div>} />
              <Route path="/interview-history" element={<div>Interview History Page</div>} />
              <Route path="/interviews/:id" element={<div>Interview Session Page</div>} />
              <Route path="/schedule-interview" element={<div>Schedule Interview Page</div>} />
              <Route path="/subscription" element={<div>Subscription Page</div>} />
              <Route path="/profile" element={<div>Profile Page</div>} />
            </Route>
          </Route>
          
          {/* Fallback route for unknown paths */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        
        {/* Global error alert */}
        {error && (
          <AlertMessage
            open={!!error}
            type="error"
            message={error}
            onClose={() => dispatch(clearError())}
          />
        )}
      </Router>
    </ThemeProvider>
  );
};

export default App; 