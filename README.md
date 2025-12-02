**CSC443 – Fall 2025 | Project Part 2: Full-Stack Application Integration**


---

## Team Members

- **Farah Mazeh**
- **Adam Sahili**
- **Micheal Geha**
- **Lynn Sabbagh**

---

# Project Overview

## Topic  
The Course Tutorial Management (CTM) System is a full-stack web application that allows instructors to create and manage online courses while enabling students to enroll, complete lessons, track their progress, and submit course reviews.

## Primary Data Entities  
1. Users  
   - Students: browse courses, enroll, track progress, submit reviews  
   - Instructors: create, edit, and manage course content  

2. Courses  
   - Title, description, category, level, duration, rating  
   - Curriculum (modules and topics)  
   - Learning objectives  
   - Video content (YouTube, Vimeo, direct video URLs)

3. Enrollments  
   - Tracks student-course relationships  
   - Progress (0–100%)  
   - Completed lessons  
   - Completion status  

4. Reviews  
   - Rating (1–5 stars)  

---
## Deployed Application Links

### Frontend
🔗 **Live Frontend Application:**  https://webproject-blush-chi.vercel.app/

### Backend API
🔗 **Live Backend API:** https://webproject-1-kssl.onrender.com
- Deployed on: Render
- Base URL: https://webproject-1-kssl.onrender.com/api

---

## GitHub Repository

🔗 **Repository Link:** https://github.com/lynnsabb/WEBPROJECT

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
git clone (https://github.com/lynnsabb/WEBPROJECT)
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

MONGO_URI="mongodb+srv://Webaholic:farhat123@cluster0.egsdcdf.mongodb.net/ctm?retryWrites=true&w=majority&appName=Cluster0"
PORT=5000
JWT_SECRET=supersecret123

5. Start the backend server:
```bash
npm run dev

# Production mode
npm start
```

The backend server will run on `http://localhost:5000`

### Step 3: Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

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
- **Production:** https://webproject-1-kssl.onrender.com/api


### Authentication Endpoints

## API Documentation

### Base URLs
Local: `http://localhost:5000/api`  
Production: `https://webproject-1-kssl.onrender.com/api`

---

# Authentication Endpoints

### 1. Register User
**Endpoint:** `POST /auth/register`  
**Access:** Public  
**Description:** Creates a new user account.  
**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
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


### Course Endpoints

#### 1. Get All Courses
- **Endpoint:** `GET /api/courses`
- **Access:** Public
- **Description:** Retrieve all available courses

#### 2. Get Course by ID
- **Endpoint:** `GET /api/courses/:id`
- **Access:** Public
- **Description:** Retrieve a single course by ID
- **URL Parameters:**
  - `id` - Course MongoDB ObjectId


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

#### 2. Get My Enrollments
- **Endpoint:** `GET /api/enrollments/me`
- **Access:** Private (JWT required)
- **Description:** Get current user's enrollments with course details

#### 3. Get All Enrollments
- **Endpoint:** `GET /api/enrollments`
- **Access:** Private (JWT required)
- **Description:** Get enrollments (students see their own, instructors see enrollments for their courses)


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

#### 5. Delete Enrollment
- **Endpoint:** `DELETE /api/enrollments/:id`
- **Access:** Private (Student can delete own, Instructor can delete for their courses, JWT required)
- **Description:** Remove an enrollment
- **URL Parameters:**
  - `id` - Enrollment MongoDB ObjectId


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


#### 2. Get Course Reviews
- **Endpoint:** `GET /api/reviews/course/:courseId`
- **Access:** Public
- **Description:** Get all reviews for a specific course
- **URL Parameters:**
  - `courseId` - Course MongoDB ObjectId


#### 3. Get User Review for Course
- **Endpoint:** `GET /api/reviews/user/:courseId`
- **Access:** Private (Student only, JWT required)
- **Description:** Get current user's review for a specific course
- **URL Parameters:**
  - `courseId` - Course MongoDB ObjectId


#### 4. Delete Review
- **Endpoint:** `DELETE /api/reviews/:id`
- **Access:** Private (Student only, must be owner, JWT required)
- **Description:** Delete a review (only the creator can delete)
- **URL Parameters:**
  - `id` - Review MongoDB ObjectId


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

### Application Screenshots

![Screenshot 1](https://github.com/user-attachments/assets/553bba17-5622-4ef0-a608-4eb5ba422c08)

![Screenshot 2](https://github.com/user-attachments/assets/46a8c0ad-a85e-41a7-815b-e2e0b7820938)

![Screenshot 3](https://github.com/user-attachments/assets/a7b88067-cdea-4c09-aaeb-f7f2673e0db4)

![Screenshot 4](https://github.com/user-attachments/assets/d806f4c0-f349-4167-8cfa-b49c4ac6fd5f)

![Screenshot 5](https://github.com/user-attachments/assets/039bcf35-0eab-4ae4-99ee-e0e8f2b2bfba)

![Screenshot 6](https://github.com/user-attachments/assets/df8ab62a-6dba-4176-97e1-1152848d8182)

![Screenshot 7](https://github.com/user-attachments/assets/4229150e-92f9-4877-a806-b091166ca5e6)

![Screenshot 8](https://github.com/user-attachments/assets/e9664455-f45d-4a39-91ba-187355156c41)

![Screenshot 9](https://github.com/user-attachments/assets/2edd0be4-5fae-4dd4-891e-a1d17e3b2f26)

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
  - Course Listing Page
  - Manage courses Page
  - Custom video player for course content

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


### Challenge 6: Frontend-Backend Integration
**Problem:** Replacing mock data with real API calls while maintaining smooth user experience and proper error handling.

**Solution:**
- Created centralized axios instance with interceptors for token management
- Implemented loading states and error handling in all components
- Added user feedback (toasts, alerts) for API operations
- Maintained backward compatibility during migration


### Challenge 7: Password Security
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




