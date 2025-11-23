// controllers/authController.js
// farah, micheal
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';

// Validation helper functions - Enhanced by Farah
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

const validateName = (name) => {
  const trimmedName = name.trim();
  
  if (trimmedName.length < 2) {
    return {
      isValid: false,
      message: 'Name must be at least 2 characters long',
    };
  }
  
  if (trimmedName.length > 50) {
    return {
      isValid: false,
      message: 'Name must be less than 50 characters',
    };
  }
  
  // Allow letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\s'-]+$/;
  if (!nameRegex.test(trimmedName)) {
    return {
      isValid: false,
      message: 'Name can only contain letters, spaces, hyphens, and apostrophes',
    };
  }
  
  return {
    isValid: true,
    name: trimmedName,
  };
};

// Register a new user - Enhanced by Farah
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: 'Please provide name, email, and password',
        errors: {
          name: !name ? 'Name is required' : null,
          email: !email ? 'Email is required' : null,
          password: !password ? 'Password is required' : null,
        }
      });
    }

    // Validate name format - Enhanced by Farah
    const nameValidation = validateName(name);
    if (!nameValidation.isValid) {
      return res.status(400).json({ 
        message: nameValidation.message,
        field: 'name'
      });
    }

    // Validate email format - Enhanced by Farah
    const normalizedEmail = email.trim().toLowerCase();
    if (!validateEmail(normalizedEmail)) {
      return res.status(400).json({ 
        message: 'Please provide a valid email address',
        field: 'email'
      });
    }

    // Validate password complexity - Enhanced by Farah
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ 
        message: 'Password does not meet complexity requirements',
        errors: passwordValidation.errors,
        field: 'password'
      });
    }

    // Validate role
    const validRoles = ['student', 'instructor'];
    const userRole = role || 'student';
    if (!validRoles.includes(userRole)) {
      return res.status(400).json({ 
        message: 'Invalid role. Must be either "student" or "instructor"',
        field: 'role'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email already exists',
        field: 'email'
      });
    }

    // Hash password with increased security - Enhanced by Farah
    const saltRounds = 12; // Increased from 10 for better security
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user with validated data
    const user = await User.create({
      name: nameValidation.name,
      email: normalizedEmail,
      password: hashedPassword,
      role: userRole,
    });

    // Generate JWT token with enhanced security
    const token = jwt.sign(
      {
        user: {
          _id: user._id,
          role: user.role,
          email: user.email,
        },
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Return token and user info (excluding password)
    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    
    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'User with this email already exists',
        field: 'email'
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation error',
        errors 
      });
    }
    
    next(error);
  }
};

// Login user - Enhanced by Farah
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Please provide email and password',
        errors: {
          email: !email ? 'Email is required' : null,
          password: !password ? 'Password is required' : null,
        }
      });
    }

    // Normalize email - Enhanced by Farah
    const normalizedEmail = email.trim().toLowerCase();
    
    // Validate email format
    if (!validateEmail(normalizedEmail)) {
      return res.status(400).json({ 
        message: 'Please provide a valid email address',
        field: 'email'
      });
    }

    // Find user by email
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid email or password',
        // Don't reveal which field is wrong for security
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'Invalid email or password',
        // Don't reveal which field is wrong for security
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        user: {
          _id: user._id,
          role: user.role,
          email: user.email,
        },
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Return token and user info (excluding password)
    res.json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    next(error);
  }
};

// GET /api/auth/check - Health check endpoint
export const checkAuth = async (req, res, next) => {
  try {
    res.json({ authenticated: true });
  } catch (error) {
    console.error('Check auth error:', error);
    next(error);
  }
};

// GET /api/auth/users - Get all users (for testing only)
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    next(error);
  }
};

// GET /api/auth/profile - Get logged-in user's profile - Enhanced by Farah
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Return user with additional metadata - Enhanced by Farah
    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    next(error);
  }
};

// GET /api/auth/users/:id - Get user by ID
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get user by ID error:', error);
    next(error);
  }
};

// PUT /api/auth/update-profile - Update user profile - Enhanced by Farah
export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, email } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ 
        message: 'Please provide name and email',
        errors: {
          name: !name ? 'Name is required' : null,
          email: !email ? 'Email is required' : null,
        }
      });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate name format - Enhanced by Farah
    const nameValidation = validateName(name);
    if (!nameValidation.isValid) {
      return res.status(400).json({ 
        message: nameValidation.message,
        field: 'name'
      });
    }

    // Validate email format - Enhanced by Farah
    const normalizedEmail = email.trim().toLowerCase();
    if (!validateEmail(normalizedEmail)) {
      return res.status(400).json({ 
        message: 'Please provide a valid email address',
        field: 'email'
      });
    }

    // Check if email is being changed and if it already exists for another user
    if (normalizedEmail !== user.email) {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser && String(existingUser._id) !== String(userId)) {
        return res.status(400).json({ 
          message: 'Email already exists for another account',
          field: 'email'
        });
      }
    }

    // Update user fields with validated data
    user.name = nameValidation.name;
    user.email = normalizedEmail;

    await user.save();

    // Return updated user without password
    const updatedUser = await User.findById(userId).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    
    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Email already exists for another account',
        field: 'email'
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation error',
        errors 
      });
    }
    
    next(error);
  }
};

// PUT /api/auth/change-password - Change user password - Enhanced by Farah
export const changePassword = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Validate required fields
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        message: 'Please provide current password and new password',
        errors: {
          currentPassword: !currentPassword ? 'Current password is required' : null,
          newPassword: !newPassword ? 'New password is required' : null,
        }
      });
    }

    // Validate new password complexity - Enhanced by Farah
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ 
        message: 'New password does not meet complexity requirements',
        errors: passwordValidation.errors,
        field: 'newPassword'
      });
    }

    // Check if new password is the same as current password
    if (currentPassword === newPassword) {
      return res.status(400).json({ 
        message: 'New password must be different from current password',
        field: 'newPassword'
      });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'Current password is incorrect',
        field: 'currentPassword'
      });
    }

    // Hash new password with increased security - Enhanced by Farah
    const saltRounds = 12; // Increased from 10 for better security
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.json({
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.error('Change password error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation error',
        errors 
      });
    }
    
    next(error);
  }
};

