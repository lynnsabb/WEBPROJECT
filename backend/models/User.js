// models/User.js
// adam
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['student', 'instructor'],
      default: 'student',
    },
  },
  {
    timestamps: true,
  }
);

<<<<<<< Updated upstream
=======
// Note: Email index is automatically created by unique: true option above
// No need for explicit index() call as it creates a duplicate

// Ensure email is unique with better error message
userSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('Email already exists'));
  } else {
    next(error);
  }
});

>>>>>>> Stashed changes
const User = mongoose.model('User', userSchema);

export default User;

