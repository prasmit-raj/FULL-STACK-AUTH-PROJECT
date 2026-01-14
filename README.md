# Full-Stack Authentication System

A simple, clean authentication system built with React (frontend), Node.js + Express (backend), and MongoDB.

## Features

- ✅ User registration and login
- ✅ Password hashing using bcrypt
- ✅ JWT-based authentication
- ✅ Protected routes on backend
- ✅ Protected routes on frontend
- ✅ Basic error handling
- ✅ Clean, beginner-friendly architecture

Live Demo

Frontend (Vercel): https://full-stack-auth-project-seven.vercel.app

Backend (Render): https://full-stack-auth-project.onrender.com


## Project Structure

```
FULL-STACK AUTH PROJECT/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   └── authController.js    # Auth logic (register, login)
│   ├── middleware/
│   │   └── auth.js              # JWT verification middleware
│   ├── models/
│   │   └── User.js              # User schema with password hashing
│   ├── routes/
│   │   └── authRoutes.js        # Auth routes
│   ├── .env.example             # Environment variables template
│   ├── package.json
│   └── server.js                # Express server
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Login.js          # Login form
    │   │   ├── Register.js       # Registration form
    │   │   ├── Dashboard.js      # Protected dashboard
    │   │   ├── ProtectedRoute.js # Route protection
    │   │   ├── Auth.css
    │   │   └── Dashboard.css
    │   ├── services/
    │   │   └── api.js            # API service with JWT handling
    │   ├── App.js                # Main app with routing
    │   ├── App.css
    │   ├── index.js
    │   └── index.css
    ├── package.json
    └── README.md
```

## Authentication Flow

### Registration Flow
1. User fills registration form (username, email, password)
2. Frontend sends POST request to `/api/auth/register`
3. Backend validates input and checks for duplicates
4. Password is hashed using bcrypt (in User model pre-save hook)
5. User is saved to MongoDB
6. JWT token is generated and returned
7. Frontend stores token in localStorage
8. User is redirected to dashboard

### Login Flow
1. User fills login form (email/username, password)
2. Frontend sends POST request to `/api/auth/login`
3. Backend finds user by email or username
4. Password is compared with hashed password using bcrypt
5. If valid, JWT token is generated and returned
6. Frontend stores token in localStorage
7. User is redirected to dashboard

### Protected Route Flow
1. User tries to access protected route (e.g., `/dashboard`)
2. Frontend checks for token in localStorage
3. If no token, redirects to login
4. If token exists, request is sent with `Authorization: Bearer <token>` header
5. Backend middleware verifies token
6. If valid, user data is attached to request and route handler executes
7. If invalid/expired, returns 401 and frontend redirects to login

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```


4. **Start the server**
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

   App will open at `http://localhost:3000`

## API Endpoints

### Public Endpoints

- `POST /api/auth/register` - Register a new user
  ```json
  {
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

### Protected Endpoints

- `GET /api/auth/me` - Get current user information
  - Requires: `Authorization: Bearer <token>` header

## JWT Storage Explanation

**Why localStorage?**
- **Simplicity**: Easy to implement and understand for beginners
- **Persistence**: Token survives page refreshes
- **No backend changes needed**: Works with standard JWT flow

**Security Considerations:**
- localStorage is vulnerable to XSS (Cross-Site Scripting) attacks
- For production applications, consider:
  - httpOnly cookies (requires backend CORS and cookie configuration)
  - Token refresh mechanism
  - CSRF protection

For this beginner-friendly project, localStorage is acceptable and commonly used.

## Error Handling

### Backend Errors
- **400 Bad Request**: Invalid input or validation errors
- **401 Unauthorized**: Invalid credentials or missing/invalid token
- **500 Internal Server Error**: Server errors

### Frontend Errors
- Network errors are caught and displayed to user
- Invalid credentials show user-friendly messages
- Expired tokens automatically redirect to login

## Customization Ideas

This project is designed to be easily customizable:

1. **Add User Roles**: Add a `role` field to User model and check in middleware
2. **Add Profile Page**: Create a profile component and route
3. **Add Password Reset**: Implement forgot password flow
4. **Add Email Verification**: Send verification emails on registration
5. **Add Social Login**: Integrate OAuth (Google, GitHub, etc.)
6. **Add Refresh Tokens**: Implement token refresh mechanism

## Interview Talking Points

When explaining this project:

1. **Architecture**: "I used a simple MVC-like structure: routes → controllers → models"
2. **Security**: "Passwords are hashed with bcrypt before storage, and JWT tokens are used for stateless authentication"
3. **Middleware**: "I created auth middleware that verifies JWT tokens on protected routes"
4. **Error Handling**: "I implemented comprehensive error handling for both client and server-side errors"
5. **Scalability**: "The architecture is simple but can be extended with roles, permissions, etc."

## Troubleshooting

### Backend Issues

**MongoDB Connection Error**
- Ensure MongoDB is running (if local)
- Check MONGODB_URI in `.env` file
- Verify network access (if using MongoDB Atlas)

**Port Already in Use**
- Change PORT in `.env` file
- Or kill the process using the port

### Frontend Issues

**CORS Errors**
- Ensure FRONTEND_URL in backend `.env` matches your frontend URL
- Check that backend CORS middleware is configured correctly

**Token Not Working**
- Clear localStorage and login again
- Check that JWT_SECRET matches in backend
- Verify token format in browser DevTools → Application → Local Storage

## License

This project is open source and available for learning purposes.
