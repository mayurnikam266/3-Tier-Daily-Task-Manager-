// Import required packages
const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

// Create a router object to define routes
const router = express.Router();

// GET /tasks - Get all tasks for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Get user ID from request (set by authMiddleware)
    const userId = req.userId;

    // Query database for all tasks belonging to this user
    // Order by created_at descending (newest first)
    const result = await pool.query(
      'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    // Return the tasks
    res.json(result.rows);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Server error while fetching tasks' });
  }
});

// POST /tasks - Create a new task
router.post('/', authMiddleware, async (req, res) => {
  try {
    // Get task data from request body
    const { title, description } = req.body;
    const userId = req.userId;

    // Validate input - title is required
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    // Insert new task into database
    const result = await pool.query(
      'INSERT INTO tasks (user_id, title, description) VALUES ($1, $2, $3) RETURNING *',
      [userId, title, description || '']
    );

    // Return the newly created task
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Server error while creating task' });
  }
});

// PUT /tasks/:id - Update a task
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.userId;
    const { title, description, completed } = req.body;

    // First, check if task exists and belongs to this user
    const checkResult = await pool.query(
      'SELECT * FROM tasks WHERE id = $1 AND user_id = $2',
      [taskId, userId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }

    // Update the task
    // Only update fields that are provided in request
    const result = await pool.query(
      'UPDATE tasks SET title = $1, description = $2, completed = $3 WHERE id = $4 AND user_id = $5 RETURNING *',
      [
        title || checkResult.rows[0].title,
        description !== undefined ? description : checkResult.rows[0].description,
        completed !== undefined ? completed : checkResult.rows[0].completed,
        taskId,
        userId
      ]
    );

    // Return the updated task
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Server error while updating task' });
  }
});

// DELETE /tasks/:id - Delete a task
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.userId;

    // Delete the task (only if it belongs to this user)
    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *',
      [taskId, userId]
    );

    // Check if task was found and deleted
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }

    // Return success message
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Server error while deleting task' });
  }
});

// Export router to use in server.js
module.exports = router;
