# Interview Preparation Platform

A backend service for an online platform that helps users prepare for technical interviews at major Russian IT companies.

## Technology Stack

- **Runtime Environment:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** MongoDB
- **Authentication:** JWT-based authentication
- **API Design:** RESTful API
- **Documentation:** OpenAPI/Swagger

## Features

- User authentication (register, login, email verification)
- Password management (reset, change)
- Technical interview simulations at different levels (intern, junior, middle)
- AI-powered evaluation of interview answers
- Subscription management
- User profile management
- Support ticket system

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/interview-preparation-platform.git
   cd interview-preparation-platform
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a .env file in the root directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/interview-platform
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=7d
   EMAIL_SERVICE=smtp
   EMAIL_USER=your_email@example.com
   EMAIL_PASSWORD=your_email_password
   EMAIL_FROM=noreply@interviewplatform.com
   OPENAI_API_KEY=your_openai_api_key
   NODE_ENV=development
   ```

### Running the Application

- Development mode:
  ```
  npm run dev
  ```

- Production mode:
  ```
  npm start
  ```

## API Documentation

Once the server is running, you can access the Swagger API documentation at:
```
http://localhost:3000/api-docs
```

## Main API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/verify-email - Verify user email
- POST /api/auth/login - Authenticate user
- POST /api/auth/forgot-password - Request password reset
- POST /api/auth/reset-password - Reset password with token
- GET /api/auth/me - Get current user data

### User Management
- PUT /api/users/profile - Update user profile
- PUT /api/users/password - Change user password

### Interview Management
- GET /api/interviews/technical - Get available technical interview types
- POST /api/interviews/technical/start - Start new technical interview
- POST /api/interviews/technical/{interviewId}/answer - Submit answer
- POST /api/interviews/technical/{interviewId}/complete - Complete interview
- GET /api/interviews/history - Get interview history

### Subscription Management
- GET /api/subscriptions/status - Get subscription status
- POST /api/subscriptions/create - Create subscription
- POST /api/subscriptions/webhook - Payment webhook

### Support
- POST /api/support/contact - Submit support request

## License

This project is licensed under the MIT License. 