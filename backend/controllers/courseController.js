// controllers/courseController.js
// micheal 
import mongoose from 'mongoose';
import Course from '../models/Course.js';
import User from '../models/User.js';
import Enrollment from '../models/Enrollment.js';
import Review from '../models/Review.js';

// GET /api/courses - Get all courses (public)
export const getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().populate('createdBy', 'name email').sort({ createdAt: -1 });
    
    // Recalculate student counts and ratings for all courses to ensure accuracy
    // This fixes any inconsistencies from old data
    const updatedCourses = await Promise.all(courses.map(async (course) => {
      try {
        // Recalculate student count from enrollments
        const actualStudentCount = await Enrollment.countDocuments({ courseId: course._id });
        if (course.students !== actualStudentCount) {
          await Course.findByIdAndUpdate(course._id, { students: actualStudentCount });
          course.students = actualStudentCount;
        }
        
        // Recalculate rating from reviews
        const reviews = await Review.find({ courseId: course._id });
        const averageRating = reviews.length > 0
          ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
          : 0;
        if (course.rating !== averageRating) {
          await Course.findByIdAndUpdate(course._id, { rating: averageRating });
          course.rating = averageRating;
        }
        
        return course;
      } catch (err) {
        console.error(`Error recalculating stats for course ${course._id}:`, err);
        return course; // Return original course if recalculation fails
      }
    }));
    
    res.json(updatedCourses);
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
    
    // Recalculate student count from enrollments to ensure accuracy
    const actualStudentCount = await Enrollment.countDocuments({ courseId: course._id });
    if (course.students !== actualStudentCount) {
      await Course.findByIdAndUpdate(course._id, { students: actualStudentCount });
      course.students = actualStudentCount;
    }
    
    // Recalculate rating from reviews to ensure accuracy
    const reviews = await Review.find({ courseId: course._id });
    const averageRating = reviews.length > 0
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
      : 0;
    if (course.rating !== averageRating) {
      await Course.findByIdAndUpdate(course._id, { rating: averageRating });
      course.rating = averageRating;
    }
    
    // Return course with corrected values
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
    const course = await Course.create({
      title,
      description,
      instructor: user.name,
      category,
      level,
      duration,
      rating: 0, // Automatically calculated from student reviews
      students: 0, // Automatically calculated from enrollments
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
      image,
      curriculum,
      learningPoints,
    } = req.body;

    if (title) course.title = title;
    if (description) course.description = description;
    if (category) course.category = category;
    if (level) course.level = level;
    if (duration !== undefined) course.duration = duration;
    // Rating is managed by the review system, not manually by instructors
    // Students count is automatically calculated from enrollments
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

// GET /api/courses/instructor/:instructorId/students - Get unique student count for an instructor
export const getInstructorUniqueStudents = async (req, res, next) => {
  try {
    const { instructorId } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(instructorId)) {
      return res.status(400).json({ message: 'Invalid instructor ID format' });
    }

    // Get all courses created by this instructor
    const courses = await Course.find({ createdBy: new mongoose.Types.ObjectId(instructorId) }).select('_id');
    const courseIds = courses.map(c => c._id);

    if (courseIds.length === 0) {
      return res.json({ uniqueStudents: 0 });
    }

    // Get all unique user IDs from enrollments across all instructor's courses
    // Using distinct to get unique userIds only
    const uniqueStudentIds = await Enrollment.distinct('userId', {
      courseId: { $in: courseIds }
    });

    // Convert to strings and filter out any null/undefined values
    const validStudentIds = uniqueStudentIds.filter(id => id != null);

    console.log(`Instructor ${instructorId}: Found ${courseIds.length} courses, ${validStudentIds.length} unique students`);

    res.json({ uniqueStudents: validStudentIds.length });
  } catch (error) {
    console.error('Get instructor unique students error:', error);
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

