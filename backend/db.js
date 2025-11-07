// Load environment variables from .env file
require('dotenv').config();

// Import the Pool class from pg library to manage database connections
const { Pool } = require('pg');

// Create a connection pool to PostgreSQL database
// A pool manages multiple connections and reuses them for efficiency
const pool = new Pool({
  host: process.env.DB_HOST,       // Database server address
  port: process.env.DB_PORT,       // PostgreSQL port (default: 5432)
  user: process.env.DB_USER,       // Database username
  password: process.env.DB_PASSWORD, // Database password
  database: process.env.DB_NAME    // Database name
});

// Test the database connection
pool.connect((err, client, release) => {
  if (err) {
    // If connection fails, log the error
    console.error('Error connecting to database:', err.stack);
  } else {
    // If connection succeeds, log success message
    console.log('Connected to PostgreSQL database');
    release(); // Release the client back to the pool
  }
});

// Export the pool so other files can use it to query the database
module.exports = pool;
