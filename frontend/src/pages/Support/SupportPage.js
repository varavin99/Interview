import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import {
  Send as SendIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  getSupportTickets,
  submitSupportRequest,
  clearSupportFlags
} from '../../services/slices/supportSlice';
import AlertMessage from '../../components/common/AlertMessage';

// Validation schema for support request form
const validationSchema = Yup.object({
  subject: Yup.string()
    .required('Subject is required')
    .min(5, 'Subject must be at least 5 characters'),
  category: Yup.string()
    .required('Category is required'),
  message: Yup.string()
    .required('Message is required')
    .min(20, 'Message must be at least 20 characters')
});

// TabPanel component for tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Support ticket component
const SupportTicket = ({ ticket }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'warning';
      case 'in-progress':
        return 'info';
      case 'resolved':
        return 'success';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6">
            {ticket.subject}
          </Typography>
          <Chip
            label={ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
            color={getStatusColor(ticket.status)}
            size="small"
          />
        </Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          <strong>Category:</strong> {ticket.category} • <strong>Ticket ID:</strong> #{ticket.id}
        </Typography>
        <Divider sx={{ my: 1.5 }} />
        
        <Typography variant="body2" sx={{ mb: 2 }}>
          {ticket.message}
        </Typography>
        
        {ticket.response && (
          <Paper variant="outlined" sx={{ p: 2, mt: 2, bgcolor: 'background.default' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Response from Support Team:
            </Typography>
            <Typography variant="body2">
              {ticket.response}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              Responded on {formatDate(ticket.responseDate)}
            </Typography>
          </Paper>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-bottom' }} />
            Created on {formatDate(ticket.createdAt)}
          </Typography>
          
          {ticket.status !== 'resolved' && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<SendIcon />}
            >
              Reply
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

const SupportPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { tickets, requestSubmitted, loading, error } = useSelector(state => state.support);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    dispatch(getSupportTickets());
    
    // Clear submission flag when component unmounts
    return () => {
      dispatch(clearSupportFlags());
    };
  }, [dispatch]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle support request submission
  const handleSubmitRequest = (values, { resetForm }) => {
    dispatch(submitSupportRequest(values));
    
    // Reset form if submission was successful
    if (requestSubmitted) {
      resetForm();
    }
  };

  // Filter tickets based on status
  const openTickets = tickets?.filter(ticket => ticket.status === 'open' || ticket.status === 'in-progress') || [];
  const resolvedTickets = tickets?.filter(ticket => ticket.status === 'resolved') || [];

  // Mock data for demonstration if no tickets are available
  const mockTickets = [
    {
      id: 'SUP-1001',
      subject: 'Unable to access technical interviews',
      category: 'Technical Issue',
      message: 'When I try to start a technical interview, I get an error message saying "Service unavailable". I\'ve tried refreshing the page and using a different browser but the issue persists.',
      status: 'in-progress',
      createdAt: '2023-09-15T10:30:00',
      response: 'Thank you for reporting this issue. Our technical team is investigating and we expect to have it resolved within the next 24 hours. We\'ll update you as soon as it\'s fixed.',
      responseDate: '2023-09-15T14:25:00'
    },
    {
      id: 'SUP-1002',
      subject: 'Question about subscription plans',
      category: 'Billing',
      message: 'I\'m currently on the free plan and considering upgrading to premium. Does the premium plan include mock interviews with real people or is it just the AI interviews?',
      status: 'resolved',
      createdAt: '2023-09-10T15:45:00',
      response: 'The premium plan includes both AI interviews and 2 mock interviews with industry professionals each month. You can schedule these through the "Schedule Interview" section after upgrading.',
      responseDate: '2023-09-11T09:20:00'
    },
    {
      id: 'SUP-1003',
      subject: 'Need help with interview feedback',
      category: 'Other',
      message: 'I completed several interviews but I\'m having trouble understanding the feedback. Is there a way to get more detailed explanations of what I need to improve?',
      status: 'open',
      createdAt: '2023-09-18T11:15:00'
    }
  ];

  const displayTickets = tickets?.length > 0 ? tickets : mockTickets;
  const displayOpenTickets = openTickets.length > 0 ? openTickets : mockTickets.filter(ticket => ticket.status === 'open' || ticket.status === 'in-progress');
  const displayResolvedTickets = resolvedTickets.length > 0 ? resolvedTickets : mockTickets.filter(ticket => ticket.status === 'resolved');

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Support Center
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Need help? Submit a ticket or check the status of your previous inquiries.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Support Form */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Submit a Support Request
            </Typography>
            
            <AlertMessage
              open={!!error}
              type="error"
              message={error || ''}
              onClose={() => dispatch(clearSupportFlags())}
            />
            
            <AlertMessage
              open={requestSubmitted}
              type="success"
              title="Request Submitted"
              message="Your support request has been submitted successfully. We'll get back to you soon."
              onClose={() => dispatch(clearSupportFlags())}
            />
            
            <Formik
              initialValues={{
                subject: '',
                category: '',
                message: ''
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmitRequest}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form>
                  <Field
                    as={TextField}
                    name="subject"
                    label="Subject"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    error={touched.subject && Boolean(errors.subject)}
                    helperText={touched.subject && errors.subject}
                    disabled={loading}
                  />
                  
                  <Field
                    name="category"
                    as={FormControl}
                    fullWidth
                    margin="normal"
                    error={touched.category && Boolean(errors.category)}
                  >
                    {({ field }) => (
                      <FormControl fullWidth variant="outlined" margin="normal">
                        <InputLabel id="category-label">Category</InputLabel>
                        <Select
                          {...field}
                          labelId="category-label"
                          label="Category"
                          error={touched.category && Boolean(errors.category)}
                          disabled={loading}
                        >
                          <MenuItem value="">Select a category</MenuItem>
                          <MenuItem value="Technical Issue">Technical Issue</MenuItem>
                          <MenuItem value="Billing">Billing</MenuItem>
                          <MenuItem value="Account">Account</MenuItem>
                          <MenuItem value="Feature Request">Feature Request</MenuItem>
                          <MenuItem value="Other">Other</MenuItem>
                        </Select>
                        {touched.category && errors.category && (
                          <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                            {errors.category}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  </Field>
                  
                  <Field
                    as={TextField}
                    name="message"
                    label="Message"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={5}
                    error={touched.message && Boolean(errors.message)}
                    helperText={touched.message && errors.message}
                    disabled={loading}
                  />
                  
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading}
                    startIcon={<SendIcon />}
                    sx={{ mt: 3 }}
                  >
                    {loading ? 'Submitting...' : 'Submit Request'}
                  </Button>
                </Form>
              )}
            </Formik>
          </Paper>
        </Grid>

        {/* Support Tickets */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Your Support Tickets
            </Typography>
            
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="support tickets tabs"
              >
                <Tab 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AccessTimeIcon sx={{ mr: 1, fontSize: 20 }} />
                      Open Tickets
                      <Chip 
                        label={displayOpenTickets.length} 
                        size="small" 
                        sx={{ ml: 1, height: 20, minWidth: 20 }} 
                      />
                    </Box>
                  } 
                />
                <Tab 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircleIcon sx={{ mr: 1, fontSize: 20 }} />
                      Resolved
                      <Chip 
                        label={displayResolvedTickets.length} 
                        size="small" 
                        sx={{ ml: 1, height: 20, minWidth: 20 }} 
                      />
                    </Box>
                  } 
                />
              </Tabs>
            </Box>
            
            <TabPanel value={tabValue} index={0}>
              {displayOpenTickets.length > 0 ? (
                displayOpenTickets.map((ticket) => (
                  <SupportTicket key={ticket.id} ticket={ticket} />
                ))
              ) : (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    You don't have any open support tickets.
                  </Typography>
                </Box>
              )}
            </TabPanel>
            
            <TabPanel value={tabValue} index={1}>
              {displayResolvedTickets.length > 0 ? (
                displayResolvedTickets.map((ticket) => (
                  <SupportTicket key={ticket.id} ticket={ticket} />
                ))
              ) : (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    You don't have any resolved support tickets.
                  </Typography>
                </Box>
              )}
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SupportPage; 