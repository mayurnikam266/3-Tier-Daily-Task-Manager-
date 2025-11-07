// Import required packages
const jwt = require('jsonwebtoken');

// Middleware function to verify JWT token and authenticate users
const authMiddleware = (req, res, next) => {
  // Get token from request header
  // Expected format: "Bearer <token>"
  const authHeader = req.headers['authorization'];
  
  // Check if authorization header exists
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  // Extract token from "Bearer <token>" format
  const token = authHeader.split(' ')[1];

  // Check if token exists after splitting
  if (!token) {
    return res.status(401).json({ error: 'Invalid token format' });
  }

  try {
    // Verify the token using JWT_SECRET
    // If valid, jwt.verify returns the decoded payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user information to request object
    // This makes user ID available in route handlers
    req.userId = decoded.userId;
    
    // Call next() to pass control to the next middleware/route handler
    next();
  } catch (error) {
    // If token is invalid or expired, return error
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Export the middleware so it can be used in routes
module.exports = authMiddleware;
