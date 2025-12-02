// controllers/reviewController.js
import Review from '../models/Review.js';
import Course from '../models/Course.js';

// POST /api/reviews - Create or update a review
export const createOrUpdateReview = async (req, res, next) => {
  try {
    const { courseId, rating, comment } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!courseId || !rating) {
      return res.status(400).json({
        message: 'Please provide courseId and rating',
      });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: 'Rating must be between 1 and 5',
      });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Create or update review
    const review = await Review.findOneAndUpdate(
      { courseId, userId },
      { rating, comment: comment || '' },
      { new: true, upsert: true }
    ).populate('userId', 'name email');

    // Calculate average rating for the course
    const reviews = await Review.find({ courseId });
    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    // Update course rating
    await Course.findByIdAndUpdate(courseId, {
      rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
    });

    res.status(201).json(review);
  } catch (error) {
    console.error('Create/update review error:', error);
    next(error);
  }
};

// GET /api/reviews/course/:courseId - Get all reviews for a course
export const getCourseReviews = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const reviews = await Review.find({ courseId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error('Get course reviews error:', error);
    next(error);
  }
};

// GET /api/reviews/user/:courseId - Get user's review for a specific course
export const getUserReview = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const review = await Review.findOne({ courseId, userId })
      .populate('userId', 'name email');

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json(review);
  } catch (error) {
    console.error('Get user review error:', error);
    next(error);
  }
};

// DELETE /api/reviews/:id - Delete a review
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user is the owner of the review
    if (String(review.userId) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    const courseId = review.courseId;

    // Delete the review
    await Review.findByIdAndDelete(req.params.id);

    // Recalculate average rating for the course
    const reviews = await Review.find({ courseId });
    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    // Update course rating
    await Course.findByIdAndUpdate(courseId, {
      rating: Math.round(averageRating * 10) / 10,
    });

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    next(error);
  }
};

