import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grid,
  IconButton,
  Link,
  Paper,
  Typography,
  useTheme
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  TrendingUp as TrendingUpIcon,
  History as HistoryIcon,
  DateRange as DateRangeIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { getInterviewStats, getUpcomingInterviews } from '../../services/slices/interviewSlice';

// Stat card component
const StatCard = ({ title, value, icon, color }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 56,
                height: 56,
                borderRadius: 2,
                backgroundColor: `${color}.light`,
                color: `${color}.main`
              }}
            >
              {icon}
            </Box>
          </Grid>
          <Grid item xs>
            <Typography variant="h6" gutterBottom>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

// Recent interview card component
const RecentInterviewCard = ({ interview }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6">
                {interview.interviewType} Interview
              </Typography>
              <Typography variant="body2" color={interview.score > 70 ? 'success.main' : 'error.main'} fontWeight="bold">
                Score: {interview.score}%
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {new Date(interview.date).toLocaleDateString()} • {interview.duration} minutes
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="body2">
              Questions: {interview.questionsAnswered} / {interview.totalQuestions}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

// Upcoming interview card component
const UpcomingInterviewCard = ({ interview }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6">
            {interview.interviewType} Interview
          </Typography>
          <IconButton size="small">
            <MoreVertIcon />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          <DateRangeIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-bottom' }} />
          {new Date(interview.scheduledDate).toLocaleDateString()} at {new Date(interview.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Typography>
        <Typography variant="body2" gutterBottom>
          {interview.description}
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            component={RouterLink}
            to={`/interviews/${interview.id}`}
            variant="contained"
            size="small"
          >
            Start Interview
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { stats, upcomingInterviews, recentInterviews, loading } = useSelector(state => state.interview);

  useEffect(() => {
    dispatch(getInterviewStats());
    dispatch(getUpcomingInterviews());
  }, [dispatch]);

  // Mock data for demonstration
  const mockStats = {
    totalInterviews: stats?.totalInterviews || 12,
    averageScore: stats?.averageScore || 78,
    totalHours: stats?.totalHours || 8.5,
    streak: stats?.streak || 4
  };

  const mockRecentInterviews = recentInterviews || [
    {
      id: 1,
      interviewType: 'Technical',
      date: '2023-09-15T10:30:00',
      duration: 45,
      score: 85,
      questionsAnswered: 12,
      totalQuestions: 15
    },
    {
      id: 2,
      interviewType: 'HR',
      date: '2023-09-10T14:00:00',
      duration: 30,
      score: 92,
      questionsAnswered: 8,
      totalQuestions: 10
    },
    {
      id: 3,
      interviewType: 'Behavioral',
      date: '2023-09-05T11:15:00',
      duration: 40,
      score: 65,
      questionsAnswered: 7,
      totalQuestions: 10
    }
  ];

  const mockUpcomingInterviews = upcomingInterviews || [
    {
      id: 4,
      interviewType: 'Technical',
      scheduledDate: '2023-09-25T14:30:00',
      description: 'Frontend development with React and Redux'
    },
    {
      id: 5,
      interviewType: 'System Design',
      scheduledDate: '2023-09-28T10:00:00',
      description: 'Design a scalable web service'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.name || 'User'}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's an overview of your interview preparation progress.
        </Typography>
      </Box>

      {/* Stats Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Interviews"
            value={mockStats.totalInterviews}
            icon={<HistoryIcon fontSize="large" />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Average Score"
            value={`${mockStats.averageScore}%`}
            icon={<TrendingUpIcon fontSize="large" />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Practice Hours"
            value={mockStats.totalHours}
            icon={<DateRangeIcon fontSize="large" />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Day Streak"
            value={mockStats.streak}
            icon={<TrendingUpIcon fontSize="large" />}
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={4}>
        {/* Recent Interviews */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5">Recent Interviews</Typography>
              <Button
                component={RouterLink}
                to="/interview-history"
                endIcon={<HistoryIcon />}
                color="primary"
              >
                View All
              </Button>
            </Box>
            
            {mockRecentInterviews.map(interview => (
              <RecentInterviewCard key={interview.id} interview={interview} />
            ))}
            
            {mockRecentInterviews.length === 0 && (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  No recent interviews found.
                </Typography>
                <Button
                  component={RouterLink}
                  to="/new-interview"
                  variant="contained"
                  sx={{ mt: 2 }}
                  startIcon={<AddIcon />}
                >
                  Start New Interview
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Upcoming Interviews */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5">Upcoming Interviews</Typography>
              <Button
                component={RouterLink}
                to="/schedule-interview"
                endIcon={<AddIcon />}
                color="primary"
              >
                Schedule New
              </Button>
            </Box>
            
            {mockUpcomingInterviews.map(interview => (
              <UpcomingInterviewCard key={interview.id} interview={interview} />
            ))}
            
            {mockUpcomingInterviews.length === 0 && (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  No upcoming interviews scheduled.
                </Typography>
                <Button
                  component={RouterLink}
                  to="/schedule-interview"
                  variant="contained"
                  sx={{ mt: 2 }}
                  startIcon={<AddIcon />}
                >
                  Schedule Interview
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              component={RouterLink}
              to="/new-interview"
              variant="contained"
              fullWidth
              sx={{ py: 1.5 }}
            >
              Start Interview
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              component={RouterLink}
              to="/schedule-interview"
              variant="outlined"
              fullWidth
              sx={{ py: 1.5 }}
            >
              Schedule Interview
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              component={RouterLink}
              to="/subscription"
              variant="outlined"
              fullWidth
              sx={{ py: 1.5 }}
            >
              Upgrade Plan
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              component={RouterLink}
              to="/support"
              variant="outlined"
              fullWidth
              sx={{ py: 1.5 }}
            >
              Get Help
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Dashboard; 