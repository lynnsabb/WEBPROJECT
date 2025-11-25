// controllers/courseController.js
// micheal 
import mongoose from 'mongoose';
import Course from '../models/Course.js';
import User from '../models/User.js';

// GET /api/courses - Get all courses (public)
export const getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().populate('createdBy', 'name email').sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    console.error('Get all courses error:', error);
    next(error);
  }
};

// GET /api/courses/:id - Get single course (public)
export const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate('createdBy', 'name email');
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json(course);
  } catch (error) {
    console.error('Get course by ID error:', error);
    next(error);
  }
};

// POST /api/courses - Create course (instructor only)
export const createCourse = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      level,
      duration,
      rating,
      students,
      image,
      curriculum,
      learningPoints,
    } = req.body;

    // Validate required fields
    if (!title || !description || !category || !level || !duration) {
      return res.status(400).json({
        message: 'Please provide title, description, category, level, and duration',
      });
    }

    // Get instructor name from user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create course
    // Always start with 0 rating and 0 students (these should be calculated, not set manually)
    const course = await Course.create({
      title,
      description,
      instructor: user.name,
      category,
      level,
      duration,
      rating: 0, // New courses always start with 0 rating
      students: 0, // New courses always start with 0 students
      image: image || '',
      curriculum: curriculum || [],
      learningPoints: learningPoints || [],
      createdBy: new mongoose.Types.ObjectId(req.user.id),
    });

    const populatedCourse = await Course.findById(course._id).populate('createdBy', 'name email');

    res.status(201).json(populatedCourse);
  } catch (error) {
    console.error('Create course error:', error);
    next(error);
  }
};

// PUT /api/courses/:id - Update course (only instructor who created it)
export const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is the creator of the course
    if (String(course.createdBy) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }

    // Get instructor name from user (in case it changed)
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update course fields
    const {
      title,
      description,
      category,
      level,
      duration,
      rating,
      students,
      image,
      curriculum,
      learningPoints,
    } = req.body;

    if (title) course.title = title;
    if (description) course.description = description;
    if (category) course.category = category;
    if (level) course.level = level;
    if (duration !== undefined) course.duration = duration;
    // Don't allow manual updates to rating and students - these should be calculated
    // rating and students are managed automatically based on enrollments/reviews
    if (image !== undefined) course.image = image;
    if (curriculum !== undefined) course.curriculum = curriculum;
    if (learningPoints !== undefined) course.learningPoints = learningPoints;
    
    // Update instructor name
    course.instructor = user.name;

    await course.save();

    const updatedCourse = await Course.findById(course._id).populate('createdBy', 'name email');

    res.json(updatedCourse);
  } catch (error) {
    console.error('Update course error:', error);
    next(error);
  }
};

// DELETE /api/courses/:id - Delete course (only instructor who created it)
export const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is the creator of the course
    if (String(course.createdBy) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }

    await Course.findByIdAndDelete(req.params.id);

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    next(error);
  }
};

