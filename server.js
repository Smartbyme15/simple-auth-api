// Import required modules
const express = require('express');
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// In-memory storage for users (simulating a database)
let users = [];

// Helper function to validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Helper function to validate password length
function isValidPassword(password) {
  return password && password.length >= 6;
}

// Helper function to find user by email
function findUserByEmail(email) {
  return users.find(user => user.email === email);
}

// Route 1: POST /register - Register a new user
app.post('/register', (req, res) => {
  const { email, password } = req.body;

  // Step 1: Validate that email and password are provided
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  // Step 2: Validate email format
  if (!isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email format'
    });
  }

  // Step 3: Validate password length
  if (!isValidPassword(password)) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long'
    });
  }

  // Step 4: Check if user already exists
  const existingUser = findUserByEmail(email);
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'User with this email already exists'
    });
  }

  // Step 5: Create new user object
  const newUser = {
    id: users.length + 1,
    email: email,
    password: password,
    createdAt: new Date().toISOString()
  };

  // Step 6: Add user to the array
  users.push(newUser);

  // Step 7: Return success response (without password for security)
  return res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user: {
      id: newUser.id,
      email: newUser.email,
      createdAt: newUser.createdAt
    }
  });
});

// Route 2: POST /login - Authenticate an existing user
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Step 1: Validate that email and password are provided
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  // Step 2: Validate email format
  if (!isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email format'
    });
  }

  // Step 3: Find user by email
  const user = findUserByEmail(email);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  // Step 4: Verify password matches
  if (user.password !== password) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  // Step 5: Return success response
  return res.status(200).json({
    success: true,
    message: 'Login successful',
    user: {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt
    }
  });
});

// Bonus Route: GET /users - View all registered users (for testing)
app.get('/users', (req, res) => {
  // Return users without passwords
  const usersWithoutPasswords = users.map(user => ({
    id: user.id,
    email: user.email,
    createdAt: user.createdAt
  }));

  return res.status(200).json({
    success: true,
    count: users.length,
    users: usersWithoutPasswords
  });
});

// Root route for server health check
app.get('/', (req, res) => {
  res.json({
    message: 'Authentication API is running',
    endpoints: {
      register: 'POST /register',
      login: 'POST /login',
      users: 'GET /users'
    }
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📝 Available endpoints:`);
  console.log(`   - POST http://localhost:${PORT}/register`);
  console.log(`   - POST http://localhost:${PORT}/login`);
  console.log(`   - GET  http://localhost:${PORT}/users`);
});