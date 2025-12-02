// controllers/enrollmentController.js
// adam 
import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import mongoose from 'mongoose';

// POST /api/enrollments - Enroll a student in a course
export const createEnrollment = async (req, res, next) => {
  try {
    const { courseId, progress = 0, completed = false, completedLessons = 0 } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!courseId) {
      return res.status(400).json({ message: 'Course ID is required' });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID format' });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if enrollment already exists
    const existingEnrollment = await Enrollment.findOne({
      userId,
      courseId,
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      userId: new mongoose.Types.ObjectId(userId),
      courseId: new mongoose.Types.ObjectId(courseId),
      progress: Math.max(0, Math.min(100, progress)),
      completed,
      completedLessons: Math.max(0, completedLessons),
    });

<<<<<<< Updated upstream
    // Increment the course's student count
    await Course.findByIdAndUpdate(courseId, {
      $inc: { students: 1 }
    });
=======
    // Update course students count
    const enrollmentCount = await Enrollment.countDocuments({ courseId });
    await Course.findByIdAndUpdate(courseId, { students: enrollmentCount });
>>>>>>> Stashed changes

    const populatedEnrollment = await Enrollment.findById(enrollment._id)
      .populate('userId', 'name email')
      .populate('courseId', 'title description instructor category level duration image');

    res.status(201).json(populatedEnrollment);
  } catch (error) {
    console.error('Create enrollment error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }
    next(error);
  }
};

// GET /api/enrollments/me - Get current user's enrollments
export const getMyEnrollments = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get only enrollments for the authenticated user
    const enrollments = await Enrollment.find({ userId: new mongoose.Types.ObjectId(userId) })
      .populate('courseId', 'title description instructor category level duration image rating students curriculum')
      .sort({ createdAt: -1 });

<<<<<<< Updated upstream
    // Filter out enrollments where courseId is null or course was deleted
    const validEnrollments = enrollments.filter(enrollment => {
      // Check if courseId exists and is populated
      if (!enrollment.courseId) {
        return false;
      }
      // Check if it's an object (populated) not just an ID string
      if (typeof enrollment.courseId === 'string') {
        return false;
      }
      // Check if course has required fields
      if (!enrollment.courseId._id || !enrollment.courseId.title) {
        return false;
      }
      return true;
    });
=======
    // Filter out enrollments where the course was deleted (courseId is null after population)
    const validEnrollments = enrollments.filter(enrollment => enrollment.courseId !== null);
>>>>>>> Stashed changes

    res.json(validEnrollments);
  } catch (error) {
    console.error('Get my enrollments error:', error);
    next(error);
  }
};

// GET /api/enrollments - Get all enrollments (for authenticated user)
export const getAllEnrollments = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let query = {};

    // Students can only see their own enrollments
    // Instructors can see all enrollments (for their courses)
    if (userRole === 'student') {
      query.userId = userId;
    } else if (userRole === 'instructor') {
      // Instructors see enrollments for courses they created
      const instructorCourses = await Course.find({ createdBy: new mongoose.Types.ObjectId(userId) }).select('_id');
      const courseIds = instructorCourses.map(c => c._id);
      query.courseId = { $in: courseIds };
    }

    const enrollments = await Enrollment.find(query)
      .populate('userId', 'name email')
      .populate('courseId', 'title description instructor category level duration image rating students')
      .sort({ createdAt: -1 });

    // Filter out enrollments where the course was deleted (courseId is null after population)
    const validEnrollments = enrollments.filter(enrollment => enrollment.courseId !== null);

    res.json(validEnrollments);
  } catch (error) {
    console.error('Get all enrollments error:', error);
    next(error);
  }
};

// GET /api/enrollments/:studentId - Get enrollments for a specific student
export const getEnrollmentsByStudent = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: 'Invalid student ID format' });
    }

    // Students can only see their own enrollments
    // Instructors can see any student's enrollments
    if (userRole === 'student' && String(studentId) !== String(userId)) {
      return res.status(403).json({ message: 'Not authorized to view other students\' enrollments' });
    }

    const enrollments = await Enrollment.find({ userId: studentId })
      .populate('userId', 'name email')
      .populate('courseId', 'title description instructor category level duration image rating students')
      .sort({ createdAt: -1 });

    // Filter out enrollments where the course was deleted (courseId is null after population)
    const validEnrollments = enrollments.filter(enrollment => enrollment.courseId !== null);

    res.json(validEnrollments);
  } catch (error) {
    console.error('Get enrollments by student error:', error);
    next(error);
  }
};

// PUT /api/enrollments/:id - Update enrollment progress
export const updateEnrollment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { progress, completed, completedLessons } = req.body;
    const userId = req.user.id;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid enrollment ID format' });
    }

    const enrollment = await Enrollment.findById(id);

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Students can only update their own enrollments
    if (String(enrollment.userId) !== String(userId)) {
      return res.status(403).json({ message: 'Not authorized to update this enrollment' });
    }

    // Get course to validate total lessons
    const course = await Course.findById(enrollment.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Calculate total lessons from curriculum
    const totalLessons = (course.curriculum || []).reduce((total, module) => {
      return total + (module.topics || []).length;
    }, 0);

    // Update fields
    if (progress !== undefined) {
      enrollment.progress = Math.max(0, Math.min(100, progress));
    }
    if (completed !== undefined) {
      enrollment.completed = completed;
      // Auto-update progress to 100 if completed
      if (completed && enrollment.progress < 100) {
        enrollment.progress = 100;
      }
    }
    if (completedLessons !== undefined) {
      // Ensure completedLessons doesn't exceed total lessons
      enrollment.completedLessons = Math.max(0, Math.min(completedLessons, totalLessons));
    }

    await enrollment.save();

    const updatedEnrollment = await Enrollment.findById(enrollment._id)
      .populate('userId', 'name email')
      .populate('courseId', 'title description instructor category level duration image');

    res.json(updatedEnrollment);
  } catch (error) {
    console.error('Update enrollment error:', error);
    next(error);
  }
};

// DELETE /api/enrollments/:id - Remove an enrollment
export const deleteEnrollment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid enrollment ID format' });
    }

    const enrollment = await Enrollment.findById(id);

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Students can only delete their own enrollments
    // Instructors can delete enrollments for their courses
    if (String(enrollment.userId) !== String(userId)) {
      // Check if user is instructor and owns the course
      const course = await Course.findById(enrollment.courseId);
      if (!course || String(course.createdBy) !== String(userId)) {
        return res.status(403).json({ message: 'Not authorized to delete this enrollment' });
      }
    }

<<<<<<< Updated upstream
    // Decrement the course's student count before deleting enrollment
    await Course.findByIdAndUpdate(enrollment.courseId, {
      $inc: { students: -1 }
    });

=======
    const courseId = enrollment.courseId;
    
>>>>>>> Stashed changes
    await Enrollment.findByIdAndDelete(id);

    // Update course students count
    const enrollmentCount = await Enrollment.countDocuments({ courseId });
    await Course.findByIdAndUpdate(courseId, { students: enrollmentCount });

    res.json({ message: 'Enrollment removed successfully' });
  } catch (error) {
    console.error('Delete enrollment error:', error);
    next(error);
  }
};

