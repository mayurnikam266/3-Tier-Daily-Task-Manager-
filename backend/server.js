// Import required packages
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import database initialization
const initializeDatabase = require('./initDb');

// Import routes
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

// Create Express application
const app = express();

// Get port from environment variable or use 5000 as default
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to enable CORS (Cross-Origin Resource Sharing)
// This allows the frontend (running on different port) to call our API
app.use(cors());

// Root endpoint - simple welcome message
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Daily Task Manager API' });
});

// Register authentication routes (login, register)
// All routes in auth.js will be prefixed with /auth
app.use('/auth', authRoutes);

// Register task routes (CRUD operations for tasks)
// All routes in tasks.js will be prefixed with /tasks
app.use('/tasks', taskRoutes);

// Initialize database schema and start server
async function startServer() {
  // Initialize database tables
  await initializeDatabase();
  
  // Start the server and listen on specified port
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

// Call the async function to start everything
startServer();
