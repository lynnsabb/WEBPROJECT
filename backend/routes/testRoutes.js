// routes/testRoutes.js
// micheal
import express from 'express';
import mongoose from 'mongoose';
import Course from '../models/Course.js';

const router = express.Router();

/**
 * @route   GET /api/test/db
 * @desc    Test MongoDB Atlas connection
 * @access  Public
 */
router.get('/db', async (req, res) => {
  try {
    // Check if mongoose is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        connected: false,
        error: 'MongoDB connection not established',
        readyState: mongoose.connection.readyState,
        readyStateText: getReadyStateText(mongoose.connection.readyState),
      });
    }

    // Attempt a simple query to verify connection works
    const testQuery = await Course.findOne().limit(1);

    // If query succeeds, connection is working
    res.json({
      connected: true,
      message: 'MongoDB Atlas connection is working',
      database: mongoose.connection.name,
      host: mongoose.connection.host,
      readyState: mongoose.connection.readyState,
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({
      connected: false,
      error: error.message,
      readyState: mongoose.connection.readyState,
      readyStateText: getReadyStateText(mongoose.connection.readyState),
    });
  }
});

// Helper function to get readable readyState text
function getReadyStateText(state) {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return states[state] || 'unknown';
}

export default router;

