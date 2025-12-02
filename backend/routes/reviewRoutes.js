// routes/reviewRoutes.js
import express from 'express';
import {
  createOrUpdateReview,
  getCourseReviews,
  getUserReview,
  deleteReview,
} from '../controllers/reviewController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { requireStudent } from '../middleware/roleMiddleware.js';
import { validateObjectId } from '../utils/validateObjectId.js';

const router = express.Router();

/**
 * @route   POST /api/reviews
 * @desc    Create or update a review
 * @access  Private (Student only)
 */
router.post('/', authMiddleware, requireStudent, createOrUpdateReview);

/**
 * @route   GET /api/reviews/course/:courseId
 * @desc    Get all reviews for a course
 * @access  Public
 */
router.get('/course/:courseId', validateObjectId, getCourseReviews);

/**
 * @route   GET /api/reviews/user/:courseId
 * @desc    Get user's review for a specific course
 * @access  Private (Student only)
 */
router.get('/user/:courseId', authMiddleware, requireStudent, validateObjectId, getUserReview);

/**
 * @route   DELETE /api/reviews/:id
 * @desc    Delete a review
 * @access  Private (Student only, must be owner)
 */
router.delete('/:id', authMiddleware, requireStudent, validateObjectId, deleteReview);

export default router;

