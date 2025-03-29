import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Divider,
  Grid,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Toolbar,
  Typography,
  useTheme
} from '@mui/material';
import {
  CheckCircleOutline as CheckIcon,
  ArrowForward as ArrowForwardIcon,
  ComputerOutlined as ComputerIcon,
  PeopleOutlined as PeopleIcon,
  BusinessOutlined as BusinessIcon,
  LockOutlined as LockIcon
} from '@mui/icons-material';

const LandingPage = () => {
  const theme = useTheme();

  const features = [
    'Practice technical interview questions at your own pace',
    'Get AI-powered feedback on your answers',
    'Track your progress with interview history',
    'Prepare for different levels: Intern, Junior, Middle',
    'Access a growing library of real interview questions'
  ];

  const interviewTypes = [
    {
      title: 'Technical Interview',
      icon: <ComputerIcon fontSize="large" color="primary" />,
      description: 'Practice technical questions for coding, algorithms, and system design.',
      status: 'active'
    },
    {
      title: 'HR Interview',
      icon: <PeopleIcon fontSize="large" color="primary" />,
      description: 'Prepare for behavioral and cultural fit questions.',
      status: 'coming-soon'
    },
    {
      title: 'Manager Interview',
      icon: <BusinessIcon fontSize="large" color="primary" />,
      description: 'Practice leadership and problem-solving scenarios.',
      status: 'coming-soon'
    }
  ];

  return (
    <Box>
      {/* Header/Navigation */}
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <Typography variant="h6" color="primary" sx={{ flexGrow: 1 }}>
            Interview Preparation Platform
          </Typography>
          <Button color="primary" component={RouterLink} to="/login" sx={{ mx: 1 }}>
            Login
          </Button>
          <Button
            variant="contained"
            color="primary"
            component={RouterLink}
            to="/register"
          >
            Register
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'background.default',
          pt: 8,
          pb: 6
        }}
      >
        <Container maxWidth="md">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
            fontWeight="bold"
          >
            Master Your Tech Interview
          </Typography>
          <Typography
            variant="h5"
            align="center"
            color="text.secondary"
            paragraph
          >
            Practice with realistic interview questions and get AI-powered feedback to increase your chances of landing your dream job at top Russian IT companies.
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            sx={{ mt: 4 }}
          >
            <Button
              variant="contained"
              size="large"
              component={RouterLink}
              to="/register"
              sx={{ px: 4, py: 1.5 }}
            >
              Start Practicing Now
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={RouterLink}
              to="/login"
              sx={{ px: 4, py: 1.5 }}
            >
              Log In
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ py: 8, bgcolor: theme.palette.background.paper }}>
        <Container maxWidth="lg">
          <Typography
            component="h2"
            variant="h3"
            align="center"
            color="text.primary"
            gutterBottom
          >
            How It Works
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: '100%',
                  textAlign: 'center',
                  backgroundColor: 'transparent',
                }}
              >
                <Typography variant="h4" color="primary" gutterBottom>
                  1
                </Typography>
                <Typography variant="h5" gutterBottom>
                  Select Interview Type
                </Typography>
                <Typography color="text.secondary">
                  Choose from technical, HR, or manager interviews based on your needs.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: '100%',
                  textAlign: 'center',
                  backgroundColor: 'transparent',
                }}
              >
                <Typography variant="h4" color="primary" gutterBottom>
                  2
                </Typography>
                <Typography variant="h5" gutterBottom>
                  Answer Questions
                </Typography>
                <Typography color="text.secondary">
                  Practice with real interview questions tailored to your experience level.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: '100%',
                  textAlign: 'center',
                  backgroundColor: 'transparent',
                }}
              >
                <Typography variant="h4" color="primary" gutterBottom>
                  3
                </Typography>
                <Typography variant="h5" gutterBottom>
                  Get Feedback
                </Typography>
                <Typography color="text.secondary">
                  Receive detailed AI-powered feedback to improve your interview skills.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                component="h2"
                variant="h3"
                color="text.primary"
                gutterBottom
              >
                Get Ready for Your Next Interview
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                paragraph
                sx={{ mb: 4 }}
              >
                Our platform helps you practice and improve your interview skills with:
              </Typography>
              <List>
                {features.map((feature, index) => (
                  <ListItem key={index} sx={{ p: 0, mb: 2 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <CheckIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={feature} />
                  </ListItem>
                ))}
              </List>
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                component={RouterLink}
                to="/register"
                sx={{ mt: 2 }}
              >
                Join for Free
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="https://via.placeholder.com/600x400?text=Interview+Preparation"
                alt="Interview preparation illustration"
                sx={{
                  width: '100%',
                  borderRadius: 2,
                  boxShadow: 3
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Interview Types */}
      <Box sx={{ py: 8, bgcolor: theme.palette.background.paper }}>
        <Container maxWidth="lg">
          <Typography
            component="h2"
            variant="h3"
            align="center"
            color="text.primary"
            gutterBottom
          >
            Interview Types
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            paragraph
            sx={{ mb: 6 }}
          >
            Prepare for different aspects of the interview process
          </Typography>
          <Grid container spacing={4}>
            {interviewTypes.map((type, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  elevation={3}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative'
                  }}
                >
                  {type.status === 'coming-soon' && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 20,
                        right: 0,
                        bgcolor: 'secondary.main',
                        color: 'secondary.contrastText',
                        px: 2,
                        py: 0.5,
                        borderTopLeftRadius: 16,
                        borderBottomLeftRadius: 16,
                        zIndex: 1
                      }}
                    >
                      <Typography variant="body2" fontWeight="medium">
                        Coming Soon
                      </Typography>
                    </Box>
                  )}
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mb: 2
                      }}
                    >
                      {type.icon}
                    </Box>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="h3"
                      align="center"
                    >
                      {type.title}
                    </Typography>
                    <Typography align="center" color="text.secondary">
                      {type.description}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0, justifyContent: 'center' }}>
                    <Button
                      size="large"
                      variant={type.status === 'active' ? 'contained' : 'outlined'}
                      color="primary"
                      component={RouterLink}
                      to={type.status === 'active' ? "/register" : "#"}
                      disabled={type.status !== 'active'}
                      sx={{ width: '100%' }}
                    >
                      {type.status === 'active' ? 'Start Practicing' : 'Coming Soon'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Pricing Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            component="h2"
            variant="h3"
            align="center"
            color="text.primary"
            gutterBottom
          >
            Simple, Transparent Pricing
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            paragraph
            sx={{ mb: 6 }}
          >
            Choose the plan that fits your needs
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {/* Free Plan */}
            <Grid item xs={12} md={5}>
              <Card
                elevation={3}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="h3"
                    align="center"
                  >
                    Free
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'baseline',
                      mb: 2,
                    }}
                  >
                    <Typography component="h4" variant="h3" color="text.primary">
                      ₽0
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      /mo
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <CheckIcon color="success" />
                      </ListItemIcon>
                      <ListItemText primary="2 technical interviews per day" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckIcon color="success" />
                      </ListItemIcon>
                      <ListItemText primary="Access to basic question bank" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckIcon color="success" />
                      </ListItemIcon>
                      <ListItemText primary="Interview history" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <LockIcon color="disabled" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="AI-powered detailed feedback" 
                        sx={{ color: 'text.disabled' }} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <LockIcon color="disabled" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Advanced question bank" 
                        sx={{ color: 'text.disabled' }} 
                      />
                    </ListItem>
                  </List>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0, justifyContent: 'center' }}>
                  <Button
                    size="large"
                    variant="outlined"
                    color="primary"
                    component={RouterLink}
                    to="/register"
                    sx={{ width: '100%' }}
                  >
                    Sign Up for Free
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            {/* Premium Plan */}
            <Grid item xs={12} md={5}>
              <Card
                elevation={3}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  border: `2px solid ${theme.palette.primary.main}`,
                  position: 'relative'
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 24,
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    px: 2,
                    py: 0.5,
                    borderBottomLeftRadius: 8,
                    borderBottomRightRadius: 8
                  }}
                >
                  <Typography variant="body2" fontWeight="medium">
                    Recommended
                  </Typography>
                </Box>
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="h3"
                    align="center"
                  >
                    Premium
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'baseline',
                      mb: 2,
                    }}
                  >
                    <Typography component="h4" variant="h3" color="text.primary">
                      ₽2,990
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      /mo
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <CheckIcon color="success" />
                      </ListItemIcon>
                      <ListItemText primary="Unlimited interviews" fontWeight="bold" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckIcon color="success" />
                      </ListItemIcon>
                      <ListItemText primary="AI-powered detailed feedback" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckIcon color="success" />
                      </ListItemIcon>
                      <ListItemText primary="Full access to question bank" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckIcon color="success" />
                      </ListItemIcon>
                      <ListItemText primary="Interview history and analytics" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckIcon color="success" />
                      </ListItemIcon>
                      <ListItemText primary="Priority customer support" />
                    </ListItem>
                  </List>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0, justifyContent: 'center' }}>
                  <Button
                    size="large"
                    variant="contained"
                    color="primary"
                    component={RouterLink}
                    to="/register"
                    sx={{ width: '100%' }}
                  >
                    Get Premium Access
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 6,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) => theme.palette.grey[900],
          color: 'white'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" color="white" gutterBottom>
                Interview Preparation Platform
              </Typography>
              <Typography variant="body2" color="white">
                Master your interview skills and land your dream job in tech.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" color="white" gutterBottom>
                Quick Links
              </Typography>
              <Link component={RouterLink} to="/register" color="inherit" display="block" gutterBottom>
                Sign Up
              </Link>
              <Link component={RouterLink} to="/login" color="inherit" display="block" gutterBottom>
                Log In
              </Link>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" color="white" gutterBottom>
                Legal
              </Typography>
              <Link component={RouterLink} to="#" color="inherit" display="block" gutterBottom>
                Terms of Service
              </Link>
              <Link component={RouterLink} to="#" color="inherit" display="block" gutterBottom>
                Privacy Policy
              </Link>
            </Grid>
          </Grid>
          <Typography variant="body2" color="white" align="center" sx={{ mt: 4 }}>
            © {new Date().getFullYear()} Interview Preparation Platform. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage; 