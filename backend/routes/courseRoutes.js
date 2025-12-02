// routes/courseRoutes.js\
// micheal 
import express from 'express';
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getInstructorUniqueStudents,
} from '../controllers/courseController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { requireInstructor } from '../middleware/roleMiddleware.js';
import { validateObjectId } from '../utils/validateObjectId.js';

const router = express.Router();

/**
 * @route   GET /api/courses
 * @desc    Get all courses
 * @access  Public
 */
router.get('/', getAllCourses);

/**
 * @route   GET /api/courses/instructor/:instructorId/students
 * @desc    Get unique student count for an instructor
 * @access  Public
 */
router.get('/instructor/:instructorId/students', getInstructorUniqueStudents);

/**
 * @route   GET /api/courses/:id
 * @desc    Get single course by ID
 * @access  Public
 */
router.get('/:id', validateObjectId, getCourseById);

/**
 * @route   POST /api/courses
 * @desc    Create a new course
 * @access  Private (Instructor only)
 */
router.post('/', authMiddleware, requireInstructor, createCourse);

/**
 * @route   PUT /api/courses/:id
 * @desc    Update a course
 * @access  Private (Instructor only, must be creator)
 */
router.put('/:id', authMiddleware, requireInstructor, validateObjectId, updateCourse);

/**
 * @route   DELETE /api/courses/:id
 * @desc    Delete a course
 * @access  Private (Instructor only, must be creator)
 */
router.delete('/:id', authMiddleware, requireInstructor, validateObjectId, deleteCourse);

export default router;

