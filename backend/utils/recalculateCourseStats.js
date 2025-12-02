// utils/recalculateCourseStats.js
// Script to recalculate course student counts and ratings from actual data
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import Review from '../models/Review.js';
import connectDB from '../config/db.js';

dotenv.config();

/**
 * Recalculates student count for all courses based on actual enrollments
 */
const recalculateStudentCounts = async () => {
  try {
    console.log('🔄 Recalculating student counts...');
    
    const courses = await Course.find({});
    let updated = 0;

    for (const course of courses) {
      const enrollmentCount = await Enrollment.countDocuments({ 
        courseId: course._id 
      });
      
      if (course.students !== enrollmentCount) {
        await Course.findByIdAndUpdate(course._id, { 
          students: enrollmentCount 
        });
        console.log(`  ✓ Course "${course.title}": ${course.students} → ${enrollmentCount} students`);
        updated++;
      }
    }

    console.log(`✅ Updated ${updated} course(s) with correct student counts`);
    return updated;
  } catch (error) {
    console.error('❌ Error recalculating student counts:', error);
    throw error;
  }
};

/**
 * Recalculates rating for all courses based on actual reviews
 */
const recalculateRatings = async () => {
  try {
    console.log('🔄 Recalculating course ratings...');
    
    const courses = await Course.find({});
    let updated = 0;

    for (const course of courses) {
      const reviews = await Review.find({ courseId: course._id });
      
      const averageRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;
      
      const roundedRating = Math.round(averageRating * 10) / 10;
      
      if (course.rating !== roundedRating) {
        await Course.findByIdAndUpdate(course._id, { 
          rating: roundedRating 
        });
        console.log(`  ✓ Course "${course.title}": ${course.rating} → ${roundedRating} rating (${reviews.length} review(s))`);
        updated++;
      }
    }

    console.log(`✅ Updated ${updated} course(s) with correct ratings`);
    return updated;
  } catch (error) {
    console.error('❌ Error recalculating ratings:', error);
    throw error;
  }
};

/**
 * Main function to recalculate all course statistics
 */
const recalculateAll = async () => {
  try {
    await connectDB();
    console.log('📊 Starting course statistics recalculation...\n');
    
    const studentsUpdated = await recalculateStudentCounts();
    console.log('');
    const ratingsUpdated = await recalculateRatings();
    
    console.log('\n✅ Recalculation complete!');
    console.log(`   - ${studentsUpdated} course(s) had student counts updated`);
    console.log(`   - ${ratingsUpdated} course(s) had ratings updated`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
};

// Run if called directly
recalculateAll();

export { recalculateStudentCounts, recalculateRatings, recalculateAll };

