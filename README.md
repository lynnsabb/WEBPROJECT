# Course Training Management (CTM) System

**CSC443 – Fall 2025 | Project Part 2: Full-Stack Application Integration**

**Due Date:** November 25, 2025

---

## Team Members

- **Farah**
- **Adam**
- **Micheal**
- **Lynn**

---

## Project Overview

### Topic
**Course Training Management System** - An online learning platform that enables instructors to create and manage courses, and students to enroll, learn, and track their progress.

### Primary Data Entities

1. **Users** - System users with two roles:
   - **Students**: Can enroll in courses, track progress, and submit reviews
   - **Instructors**: Can create, update, and delete courses

2. **Courses** - Educational content containing:
   - Course metadata (title, description, category, level, duration, rating)
   - Curriculum organized into modules and topics
   - Learning points and course materials
   - Video content (supports YouTube, Vimeo, and direct video URLs)

3. **Enrollments** - Student-course relationships tracking:
   - Enrollment status and progress (0-100%)
   - Completion status
   - Number of completed lessons

4. **Reviews** - Student feedback on courses:
   - Rating (1-5 stars)
   - Comment/feedback text

---

## Deployed Application Links

### Frontend
🔗 **Live Frontend Application:** [Add your deployed frontend URL here]
- Deployed on: Vercel/Netlify (specify your platform)

### Backend API
🔗 **Live Backend API:** [Add your deployed backend URL here]
- Deployed on: Render/Cyclic/Heroku (specify your platform)
- Base URL: `https://your-backend-url.com/api`

---

## GitHub Repository

🔗 **Repository Link:** [Add your GitHub repository URL here]

---

## Technology Stack

### Frontend
- **React 19.1.1** - UI library
- **Vite 7.1.7** - Build tool and dev server
- **React Router DOM 7.9.4** - Client-side routing
- **Axios 1.13.2** - HTTP client for API calls
- **Tailwind CSS 4.1.14** - Utility-first CSS framework

### Backend
- **Node.js** - Runtime environment
- **Express.js 4.18.2** - Web framework
- **MongoDB Atlas** - Cloud database (MongoDB)
- **Mongoose 8.0.3** - MongoDB object modeling
- **JSON Web Token (JWT) 9.0.2** - Authentication
- **bcrypt 5.1.1** - Password hashing
- **CORS 2.8.5** - Cross-origin resource sharing
- **dotenv 16.3.1** - Environment variable management

---

## Local Setup Instructions

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **MongoDB Atlas account** (or local MongoDB instance)
- **Git** (for cloning the repository)

### Step 1: Clone the Repository

```bash
git clone [your-repository-url]
cd WEBPROJECT
```

### Step 2: Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `backend` directory:
```bash
# Create .env file
touch .env  # On Windows: type nul > .env
```

4. Add the following environment variables to `.env`:
```env
MONGO_URI="mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ctm?retryWrites=true&w=majority&appName=Cluster0"
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

**Important:** 
- Replace `username`, `password`, and the cluster URL with your MongoDB Atlas credentials
- Use a strong, random string for `JWT_SECRET` in production

5. (Optional) Seed the database with initial data:
```bash
# Seed all data (users, courses, enrollments)
npm run seed:all

# Or seed individually:
npm run seed:users      # Seed users only
npm run seed:courses    # Seed courses only
npm run seed:enrollments # Seed enrollments only
```

6. Start the backend server:
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The backend server will run on `http://localhost:5000`

### Step 3: Frontend Setup

1. Navigate to the project root (or frontend directory if separate):
```bash
# From project root
cd ..
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Create a `.env` file in the root directory for frontend environment variables:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or the port shown in terminal)

### Step 4: Verify Installation

1. **Backend Health Check:**
   - Open browser: `http://localhost:5000/api/health`
   - Should return: `{ "status": "ok" }`

2. **Frontend:**
   - Open browser: `http://localhost:5173`
   - You should see the CTM homepage

### Running the Full Stack Locally

1. **Terminal 1** - Backend:
```bash
cd backend
npm run dev
```

2. **Terminal 2** - Frontend:
```bash
npm run dev
```

3. Access the application at `http://localhost:5173`

---

## API Documentation

### Base URL
- **Local:** `http://localhost:5000/api`
- **Production:** `[Your deployed backend URL]/api`

### Authentication

Most endpoints require authentication via JWT token. Include the token in the request header:
```
Authorization: Bearer <your-jwt-token>
```

---

### Authentication Endpoints

#### 1. Register User
- **Endpoint:** `POST /api/auth/register`
- **Access:** Public
- **Description:** Register a new user account
- **Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"  // or "instructor"
}
```
- **Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "createdAt": "2025-11-20T10:00:00.000Z",
    "updatedAt": "2025-11-20T10:00:00.000Z"
  }
}
```

#### 2. Login User
- **Endpoint:** `POST /api/auth/login`
- **Access:** Public
- **Description:** Authenticate user and receive JWT token
- **Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

#### 3. Get User Profile
- **Endpoint:** `GET /api/auth/profile`
- **Access:** Private (JWT required)
- **Description:** Get current authenticated user's profile
- **Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "student",
  "createdAt": "2025-11-20T10:00:00.000Z",
  "updatedAt": "2025-11-20T10:00:00.000Z"
}
```

#### 4. Update Profile
- **Endpoint:** `PUT /api/auth/update-profile`
- **Access:** Private (JWT required)
- **Description:** Update user's name and email
- **Request Body:**
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com"
}
```
- **Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "role": "student",
  "updatedAt": "2025-11-20T11:00:00.000Z"
}
```

#### 5. Change Password
- **Endpoint:** `PUT /api/auth/change-password`
- **Access:** Private (JWT required)
- **Description:** Change user's password
- **Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```
- **Response (200):**
```json
{
  "message": "Password updated successfully"
}
```

---

### Course Endpoints

#### 1. Get All Courses
- **Endpoint:** `GET /api/courses`
- **Access:** Public
- **Description:** Retrieve all available courses
- **Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Python for Beginners",
    "description": "Start your programming journey with Python...",
    "instructor": "Emma Thompson",
    "category": "Programming",
    "level": "Beginner",
    "duration": "20h",
    "rating": 4.6,
    "students": 3421,
    "image": "https://example.com/image.jpg",
    "curriculum": [...],
    "learningPoints": [...],
    "createdBy": "507f1f77bcf86cd799439012",
    "createdAt": "2025-11-20T10:00:00.000Z",
    "updatedAt": "2025-11-20T10:00:00.000Z"
  }
]
```

#### 2. Get Course by ID
- **Endpoint:** `GET /api/courses/:id`
- **Access:** Public
- **Description:** Retrieve a single course by ID
- **URL Parameters:**
  - `id` - Course MongoDB ObjectId
- **Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Python for Beginners",
  "description": "Start your programming journey with Python...",
  "instructor": "Emma Thompson",
  "category": "Programming",
  "level": "Beginner",
  "duration": "20h",
  "rating": 4.6,
  "students": 3421,
  "image": "https://example.com/image.jpg",
  "curriculum": [
    {
      "id": 1,
      "title": "Getting Started with Python",
      "description": "Introduction to Python programming",
      "topics": [
        {
          "id": 1,
          "title": "What is Python?",
          "duration": "8m",
          "videoUrl": "https://example.com/video.mp4",
          "content": "Learn about Python..."
        }
      ]
    }
  ],
  "learningPoints": [
    "Master Python syntax",
    "Build real-world projects"
  ],
  "createdBy": "507f1f77bcf86cd799439012",
  "createdAt": "2025-11-20T10:00:00.000Z",
  "updatedAt": "2025-11-20T10:00:00.000Z"
}
```

#### 3. Create Course
- **Endpoint:** `POST /api/courses`
- **Access:** Private (Instructor only, JWT required)
- **Description:** Create a new course
- **Request Body:**
```json
{
  "title": "Advanced JavaScript",
  "description": "Master advanced JavaScript concepts...",
  "instructor": "Jane Doe",
  "category": "Programming",
  "level": "Advanced",
  "duration": "30h",
  "image": "https://example.com/image.jpg",
  "curriculum": [
    {
      "id": 1,
      "title": "Module 1",
      "description": "Introduction",
      "topics": [
        {
          "id": 1,
          "title": "Topic 1",
          "duration": "10m",
          "videoUrl": "https://example.com/video.mp4",
          "content": "Content here"
        }
      ]
    }
  ],
  "learningPoints": [
    "Learn advanced concepts",
    "Build complex applications"
  ]
}
```
- **Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "title": "Advanced JavaScript",
  "description": "Master advanced JavaScript concepts...",
  "createdBy": "507f1f77bcf86cd799439012",
  "createdAt": "2025-11-20T10:00:00.000Z",
  "updatedAt": "2025-11-20T10:00:00.000Z",
  ...
}
```

#### 4. Update Course
- **Endpoint:** `PUT /api/courses/:id`
- **Access:** Private (Instructor only, must be creator, JWT required)
- **Description:** Update an existing course (only the creator can update)
- **URL Parameters:**
  - `id` - Course MongoDB ObjectId
- **Request Body:** (Same as Create Course, all fields optional)
```json
{
  "title": "Updated Course Title",
  "description": "Updated description",
  "rating": 4.8
}
```
- **Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Updated Course Title",
  "description": "Updated description",
  "rating": 4.8,
  "updatedAt": "2025-11-20T11:00:00.000Z",
  ...
}
```

#### 5. Delete Course
- **Endpoint:** `DELETE /api/courses/:id`
- **Access:** Private (Instructor only, must be creator, JWT required)
- **Description:** Delete a course (only the creator can delete)
- **URL Parameters:**
  - `id` - Course MongoDB ObjectId
- **Response (200):**
```json
{
  "message": "Course deleted successfully"
}
```

---

### Enrollment Endpoints

#### 1. Create Enrollment
- **Endpoint:** `POST /api/enrollments`
- **Access:** Private (Student only, JWT required)
- **Description:** Enroll a student in a course
- **Request Body:**
```json
{
  "courseId": "507f1f77bcf86cd799439011",
  "progress": 0,
  "completed": false,
  "completedLessons": 0
}
```
- **Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "userId": "507f1f77bcf86cd799439015",
  "courseId": "507f1f77bcf86cd799439011",
  "progress": 0,
  "completed": false,
  "completedLessons": 0,
  "createdAt": "2025-11-20T10:00:00.000Z",
  "updatedAt": "2025-11-20T10:00:00.000Z"
}
```

#### 2. Get My Enrollments
- **Endpoint:** `GET /api/enrollments/me`
- **Access:** Private (JWT required)
- **Description:** Get current user's enrollments with course details
- **Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439014",
    "userId": "507f1f77bcf86cd799439015",
    "courseId": {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Python for Beginners",
      "description": "...",
      "instructor": "Emma Thompson",
      ...
    },
    "progress": 45,
    "completed": false,
    "completedLessons": 5,
    "createdAt": "2025-11-20T10:00:00.000Z",
    "updatedAt": "2025-11-20T10:00:00.000Z"
  }
]
```

#### 3. Get All Enrollments
- **Endpoint:** `GET /api/enrollments`
- **Access:** Private (JWT required)
- **Description:** Get enrollments (students see their own, instructors see enrollments for their courses)
- **Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439014",
    "userId": "507f1f77bcf86cd799439015",
    "courseId": "507f1f77bcf86cd799439011",
    "progress": 45,
    "completed": false,
    "completedLessons": 5
  }
]
```

#### 4. Update Enrollment
- **Endpoint:** `PUT /api/enrollments/:id`
- **Access:** Private (Student can update own, Instructor can update for their courses, JWT required)
- **Description:** Update enrollment progress
- **URL Parameters:**
  - `id` - Enrollment MongoDB ObjectId
- **Request Body:**
```json
{
  "progress": 75,
  "completed": false,
  "completedLessons": 8
}
```
- **Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "userId": "507f1f77bcf86cd799439015",
  "courseId": "507f1f77bcf86cd799439011",
  "progress": 75,
  "completed": false,
  "completedLessons": 8,
  "updatedAt": "2025-11-20T11:00:00.000Z"
}
```

#### 5. Delete Enrollment
- **Endpoint:** `DELETE /api/enrollments/:id`
- **Access:** Private (Student can delete own, Instructor can delete for their courses, JWT required)
- **Description:** Remove an enrollment
- **URL Parameters:**
  - `id` - Enrollment MongoDB ObjectId
- **Response (200):**
```json
{
  "message": "Enrollment deleted successfully"
}
```

---

### Review Endpoints

#### 1. Create or Update Review
- **Endpoint:** `POST /api/reviews`
- **Access:** Private (Student only, JWT required)
- **Description:** Create a new review or update existing review for a course
- **Request Body:**
```json
{
  "courseId": "507f1f77bcf86cd799439011",
  "rating": 5,
  "comment": "Excellent course! Very well explained."
}
```
- **Response (200/201):**
```json
{
  "_id": "507f1f77bcf86cd799439016",
  "courseId": "507f1f77bcf86cd799439011",
  "userId": "507f1f77bcf86cd799439015",
  "rating": 5,
  "comment": "Excellent course! Very well explained.",
  "createdAt": "2025-11-20T10:00:00.000Z",
  "updatedAt": "2025-11-20T10:00:00.000Z"
}
```

#### 2. Get Course Reviews
- **Endpoint:** `GET /api/reviews/course/:courseId`
- **Access:** Public
- **Description:** Get all reviews for a specific course
- **URL Parameters:**
  - `courseId` - Course MongoDB ObjectId
- **Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439016",
    "courseId": "507f1f77bcf86cd799439011",
    "userId": {
      "_id": "507f1f77bcf86cd799439015",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "rating": 5,
    "comment": "Excellent course!",
    "createdAt": "2025-11-20T10:00:00.000Z",
    "updatedAt": "2025-11-20T10:00:00.000Z"
  }
]
```

#### 3. Get User Review for Course
- **Endpoint:** `GET /api/reviews/user/:courseId`
- **Access:** Private (Student only, JWT required)
- **Description:** Get current user's review for a specific course
- **URL Parameters:**
  - `courseId` - Course MongoDB ObjectId
- **Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439016",
  "courseId": "507f1f77bcf86cd799439011",
  "userId": "507f1f77bcf86cd799439015",
  "rating": 5,
  "comment": "Excellent course!",
  "createdAt": "2025-11-20T10:00:00.000Z",
  "updatedAt": "2025-11-20T10:00:00.000Z"
}
```

#### 4. Delete Review
- **Endpoint:** `DELETE /api/reviews/:id`
- **Access:** Private (Student only, must be owner, JWT required)
- **Description:** Delete a review (only the creator can delete)
- **URL Parameters:**
  - `id` - Review MongoDB ObjectId
- **Response (200):**
```json
{
  "message": "Review deleted successfully"
}
```

---

### Health Check Endpoint

#### Health Check
- **Endpoint:** `GET /api/health`
- **Access:** Public
- **Description:** Check if the API server is running
- **Response (200):**
```json
{
  "status": "ok"
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "message": "Validation error",
  "errors": ["Field is required", "Invalid format"]
}
```

### 401 Unauthorized
```json
{
  "message": "Invalid token"
}
```
or
```json
{
  "message": "Token expired"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied. Instructor role required."
}
```

### 404 Not Found
```json
{
  "message": "Course not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error"
}
```

---

## Database Schema

### User Schema
```javascript
{
  name: String (required, 2-50 chars),
  email: String (required, unique, validated),
  password: String (required, min 8 chars, hashed with bcrypt),
  role: String (enum: ['student', 'instructor'], default: 'student'),
  createdAt: Date,
  updatedAt: Date
}
```

### Course Schema
```javascript
{
  title: String (required),
  description: String (required),
  instructor: String (required),
  category: String (required),
  level: String (required),
  duration: String (required, e.g., "20h"),
  rating: Number (default: 0),
  students: Number (default: 0),
  image: String,
  curriculum: [{
    id: Number,
    title: String,
    description: String,
    topics: [{
      id: Number,
      title: String,
      duration: String,
      videoUrl: String,
      content: String
    }]
  }],
  learningPoints: [String],
  createdBy: ObjectId (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

### Enrollment Schema
```javascript
{
  userId: ObjectId (required, ref: 'User'),
  courseId: ObjectId (required, ref: 'Course'),
  progress: Number (0-100, default: 0),
  completed: Boolean (default: false),
  completedLessons: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
// Unique index on (userId, courseId)
```

### Review Schema
```javascript
{
  courseId: ObjectId (required, ref: 'Course'),
  userId: ObjectId (required, ref: 'User'),
  rating: Number (required, 1-5),
  comment: String (max 1000 chars),
  createdAt: Date,
  updatedAt: Date
}
// Unique index on (courseId, userId)
```

---

## Screenshots / Application Demo

### Application Screenshots

*[Add screenshots or a GIF showcasing the final, fully functional application here]*

**Suggested screenshots to include:**
1. Homepage with featured courses
2. Course listing page with filters
3. Course details page
4. Lesson viewer with video player
5. Student enrollment dashboard
6. Instructor course management page
7. User profile page
8. Login/Registration pages

---

## Team Member Contributions

### Phase 1 (Frontend Development)
- **Farah**: 
  - Frontend routing and navigation (App.jsx)
  - User registration and authentication UI
  - Footer component
  - Overall frontend architecture

- **Adam**: 
  - Course enrollment functionality
  - Enrollment management pages
  - Student dashboard

- **Micheal**: 
  - Course listing and filtering
  - Course display components

- **Lynn**: 
  - Course details pages
  - UI/UX design and styling
  - Mock data structure

### Phase 2 (Backend Integration)
- **Farah**: 
  - Authentication system (User model, auth routes, auth controller)
  - User registration and login endpoints
  - Profile management (update profile, change password)
  - Frontend authentication integration

- **Adam**: 
  - Enrollment system (Enrollment model, enrollment routes, enrollment controller)
  - Enrollment CRUD operations
  - Role-based middleware (requireStudent, requireInstructor)
  - Database seeding (users, courses, enrollments)

- **Micheal**: 
  - Course management system (Course routes, course controller)
  - Course CRUD operations
  - Instructor-specific endpoints
  - Test routes and utilities

- **Lynn**: 
  - Course model design and schema
  - Database seeding scripts
  - Enrollment model collaboration
  - Frontend-backend integration support

**Collaborative Work:**
- All team members contributed to:
  - Database schema design and refinement
  - API endpoint planning and documentation
  - Testing and debugging
  - Code reviews and quality assurance

---

## Technical Challenges and Solutions

### Challenge 1: JWT Token Management
**Problem:** Managing JWT tokens across frontend and backend, ensuring secure storage and automatic token refresh.

**Solution:** 
- Implemented token storage in localStorage with automatic inclusion in axios request headers via interceptors
- Created auth middleware to validate tokens on protected routes
- Added token expiration handling with user-friendly error messages

### Challenge 2: Role-Based Access Control
**Problem:** Implementing different access levels for students and instructors, ensuring users can only modify their own resources.

**Solution:**
- Created role-based middleware (`roleMiddleware.js`) to check user roles
- Implemented ownership verification in controllers (e.g., instructors can only edit/delete their own courses)
- Added authorization checks in enrollment and review endpoints

### Challenge 3: Complex Course Curriculum Structure
**Problem:** Managing nested curriculum data (modules → topics) with video URLs, ensuring proper data validation and retrieval.

**Solution:**
- Designed nested Mongoose schemas for modules and topics within the Course model
- Implemented proper validation for curriculum structure
- Created flexible video URL handling supporting YouTube, Vimeo, and direct video links in the frontend

### Challenge 4: Enrollment Progress Tracking
**Problem:** Accurately tracking student progress through courses with multiple lessons, ensuring progress updates are atomic and consistent.

**Solution:**
- Implemented progress calculation based on completed lessons
- Added `completedLessons` counter to enrollment model
- Created utility functions to recalculate course statistics
- Ensured progress updates are synchronized with lesson completion

### Challenge 5: Database Seeding and Data Consistency
**Problem:** Seeding the database with realistic data while maintaining referential integrity between users, courses, and enrollments.

**Solution:**
- Created sequential seeding scripts that run in order (users → courses → enrollments)
- Implemented `seedAll.js` to orchestrate all seed scripts
- Added error handling to ensure data consistency
- Used MongoDB ObjectId references to maintain relationships

### Challenge 6: Frontend-Backend Integration
**Problem:** Replacing mock data with real API calls while maintaining smooth user experience and proper error handling.

**Solution:**
- Created centralized axios instance with interceptors for token management
- Implemented loading states and error handling in all components
- Added user feedback (toasts, alerts) for API operations
- Maintained backward compatibility during migration

### Challenge 7: CORS and Deployment Configuration
**Problem:** Configuring CORS for local development and production, ensuring frontend can communicate with deployed backend.

**Solution:**
- Configured CORS middleware to allow requests from frontend origin
- Set up environment variables for different deployment environments
- Created separate configuration for local development and production

### Challenge 8: Password Security
**Problem:** Ensuring user passwords are stored securely and cannot be retrieved in plain text.

**Solution:**
- Implemented bcrypt hashing with salt rounds (10) for password storage
- Added password validation (minimum 8 characters, complexity requirements)
- Ensured passwords are never returned in API responses
- Implemented secure password change functionality with current password verification

---

## Additional Features

### Implemented Features
- ✅ User authentication and authorization
- ✅ Role-based access control (Student/Instructor)
- ✅ Course creation, reading, updating, and deletion
- ✅ Student enrollment in courses
- ✅ Progress tracking for enrolled courses
- ✅ Course reviews and ratings
- ✅ Video lesson player with support for multiple video sources
- ✅ Responsive design with Tailwind CSS
- ✅ Protected routes based on authentication and roles
- ✅ Profile management (update profile, change password)
- ✅ Database seeding for development and testing

### Future Enhancements (Not Implemented)
- Email verification for user registration
- Password reset functionality
- Course search and advanced filtering
- Course categories management
- Instructor analytics dashboard
- Student certificates upon course completion
- Discussion forums for courses
- File uploads for course materials
- Payment integration (if applicable)
- Admin panel for system management

---

## Project Structure

```
WEBPROJECT/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── courseController.js  # Course CRUD operations
│   │   ├── enrollmentController.js # Enrollment operations
│   │   └── reviewController.js   # Review operations
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification
│   │   └── roleMiddleware.js     # Role-based access control
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Course.js            # Course schema
│   │   ├── Enrollment.js        # Enrollment schema
│   │   └── Review.js            # Review schema
│   ├── routes/
│   │   ├── authRoutes.js        # Authentication routes
│   │   ├── courseRoutes.js      # Course routes
│   │   ├── enrollmentRoutes.js  # Enrollment routes
│   │   ├── reviewRoutes.js      # Review routes
│   │   └── testRoutes.js        # Test routes
│   ├── seed/
│   │   ├── seedAll.js          # Master seed script
│   │   ├── seedUsers.js        # User seed data
│   │   ├── seedCourses.js     # Course seed data
│   │   └── seedEnrollments.js # Enrollment seed data
│   ├── utils/
│   │   ├── validateObjectId.js # MongoDB ID validation
│   │   └── recalculateCourseStats.js # Course statistics
│   ├── server.js               # Express server setup
│   ├── package.json            # Backend dependencies
│   └── .env                    # Environment variables (not in repo)
│
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Navigation component
│   │   ├── Footer.jsx          # Footer component
│   │   └── Protected.jsx      # Route protection
│   ├── pages/
│   │   ├── Home.jsx           # Homepage
│   │   ├── Courses.jsx        # Course listing
│   │   ├── CourseDetails.jsx # Course details page
│   │   ├── LessonViewer.jsx  # Video lesson player
│   │   ├── Enrollments.jsx   # Student enrollments
│   │   ├── ManageCourse.jsx  # Instructor course management
│   │   ├── Profile.jsx       # User profile
│   │   ├── EditProfile.jsx  # Edit profile page
│   │   ├── ChangePassword.jsx # Change password page
│   │   ├── Login.jsx         # Login page
│   │   ├── Register.jsx     # Registration page
│   │   └── NotFound.jsx     # 404 page
│   ├── state/
│   │   └── auth.jsx          # Authentication context
│   ├── data/
│   │   └── mock.jsx         # Mock data (legacy)
│   ├── App.jsx              # Main app component
│   ├── main.jsx            # React entry point
│   └── index.css           # Global styles
│
├── public/                  # Static assets
├── package.json            # Frontend dependencies
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── README.md              # This file
```

---

## Environment Variables

### Backend (.env)
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ctm?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

### Frontend (.env) - Optional
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## Scripts

### Backend Scripts
```bash
npm start              # Start production server
npm run dev           # Start development server with auto-reload
npm run seed:all      # Seed all data (users, courses, enrollments)
npm run seed:users    # Seed users only
npm run seed:courses  # Seed courses only
npm run seed:enrollments # Seed enrollments only
npm run recalculate:stats # Recalculate course statistics
```

### Frontend Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## Testing the API

### Using cURL

**Register User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","role":"student"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Get All Courses:**
```bash
curl http://localhost:5000/api/courses
```

**Create Course (with token):**
```bash
curl -X POST http://localhost:5000/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title":"New Course","description":"Course description","instructor":"Instructor Name","category":"Programming","level":"Beginner","duration":"10h"}'
```

---

## Deployment Notes

### Backend Deployment (Render/Cyclic/Heroku)
1. Set environment variables in deployment platform
2. Ensure MongoDB Atlas allows connections from deployment IP
3. Update CORS settings to allow frontend domain
4. Set `NODE_ENV=production`

### Frontend Deployment (Vercel/Netlify)
1. Update API base URL to production backend URL
2. Set environment variables if needed
3. Ensure CORS is configured on backend for frontend domain

---

## License

This project is developed for educational purposes as part of CSC443 - Fall 2025.

---

## Contact & Support

For questions or issues, please contact the development team or create an issue in the GitHub repository.

---

**Last Updated:** November 2025
