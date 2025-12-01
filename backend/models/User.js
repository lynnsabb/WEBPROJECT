// models/User.js
// farah
import mongoose from 'mongoose';

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [50, 'Name must be less than 50 characters'],
      validate: {
        validator: function(v) {
          // Allow letters, spaces, hyphens, and apostrophes
          return /^[a-zA-Z\s'-]+$/.test(v);
        },
        message: 'Name can only contain letters, spaces, hyphens, and apostrophes'
      }
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function(v) {
          return emailRegex.test(v);
        },
        message: 'Please provide a valid email address'
      }
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
      // Note: Password complexity validation is handled in the controller
    },
    role: {
      type: String,
      enum: {
        values: ['student', 'instructor'],
        message: 'Role must be either "student" or "instructor"'
      },
      default: 'student',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster email lookups
userSchema.index({ email: 1 });

// Ensure email is unique with better error message
userSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('Email already exists'));
  } else {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

export default User;

