// src/pages/CourseDetails.jsx
//farah
import { useState, useMemo, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../state/auth.jsx";

// Icons
function IconArrowLeft(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" {...props}>
      <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
    </svg>
  );
}

function IconStar(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" {...props}>
      <path fill="currentColor" d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

function IconUsers(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" {...props}>
      <path fill="currentColor" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0C9.66 11 11 9.66 11 8S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C18 14.17 13.33 13 11 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5C26 14.17 21.33 13 19 13z" />
    </svg>
  );
}

function IconClock(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" {...props}>
      <path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm.5 5H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
    </svg>
  );
}

function IconBook(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" {...props}>
      <path fill="currentColor" d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
    </svg>
  );
}

function IconChevronDown(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" {...props}>
      <path fill="currentColor" d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
    </svg>
  );
}

function IconGlobe(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" {...props}>
      <path fill="currentColor" d="M12 2C6.47 2 2 6.48 2 12s4.47 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" />
    </svg>
  );
}

function IconCertificate(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" {...props}>
      <path fill="currentColor" d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z" />
    </svg>
  );
}

function IconCheckCircle(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" {...props}>
      <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  );
}

function IconPlayCircle(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" {...props}>
      <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
    </svg>
  );
}

export default function CourseDetails({ course: courseProp, onBack }) {
  const { id: idParam } = useParams();
  const navigate = useNavigate();
  const authContext = useAuth();
  const user = authContext?.user || null;

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState(null); // Store enrollment progress and completion
  const [showToast, setShowToast] = useState(false);
  const [userReview, setUserReview] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [expandedModule, setExpandedModule] = useState(null);

  // Fetch course from API
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError("");

        if (!idParam) {
          setError("Course ID is required");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/courses/${idParam}`
        );

        setCourse(response.data);
      } catch (err) {
        if (err.response && err.response.data) {
          setError(err.response.data.message || "Failed to load course");
        } else if (err.request) {
          setError("Unable to connect to server. Please check if the backend is running.");
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    // Use prop if provided, otherwise fetch from API
    if (courseProp) {
      setCourse(courseProp);
      setLoading(false);
      setError("");
    } else if (idParam) {
      fetchCourse();
    } else {
      setError("Course ID is required");
      setLoading(false);
      setCourse(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idParam, courseProp]);

  // Check enrollment status when course is loaded
  useEffect(() => {
    // Only check enrollment if we have a course loaded
    if (!course || !course._id) {
      setIsEnrolled(false);
      setEnrollmentData(null);
      return;
    }

    // Only check if user is a student
    if (!user || user.role !== "student") {
      setIsEnrolled(false);
      setEnrollmentData(null);
      return;
    }

    const token = localStorage.getItem("ctm_token");
    if (!token) {
      setIsEnrolled(false);
      setEnrollmentData(null);
      return;
    }

    const checkEnrollment = async () => {
      try {
        const enrollmentsResponse = await axios.get(
          "http://localhost:5000/api/enrollments/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const enrollment = (enrollmentsResponse.data || []).find(
          (e) => {
            const courseId = e.courseId?._id || e.courseId;
            return courseId && String(courseId) === String(course._id);
          }
        );
        if (enrollment) {
          setIsEnrolled(true);
          setEnrollmentData({
            progress: enrollment.progress || 0,
            completed: enrollment.completed || false,
            enrollmentId: enrollment._id
          });
        } else {
          setIsEnrolled(false);
          setEnrollmentData(null);
        }
      } catch (err) {
        console.error("Error fetching enrollment:", err);
        setIsEnrolled(false);
        setEnrollmentData(null);
      }
    };

    checkEnrollment();
  }, [course?._id, user?.role]);

  // Total lessons from curriculum topics
  const totalLessons = useMemo(
    () => (course?.curriculum || []).reduce((sum, m) => sum + (m.topics?.length || 0), 0),
    [course?.curriculum]
  );

  // Check if user is a student
  const isStudent = user?.role === "student";
  const canEnroll = isStudent && user;

  // Handle enrollment
  const handleEnroll = async () => {
    if (!canEnroll || isEnrolled || !course?._id) return;

    try {
      setEnrolling(true);
      const token = localStorage.getItem("ctm_token");
      
      if (!token) {
        setError("Please log in to enroll in courses");
        setEnrolling(false);
        return;
      }

      await axios.post(
        "http://localhost:5000/api/enrollments",
        { courseId: course._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsEnrolled(true);
      setEnrollmentData({
        progress: 0,
        completed: false,
        enrollmentId: null
      });
      setShowToast(true);
      setTimeout(() => {
        navigate("/enrollments");
      }, 1500);
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Failed to enroll in course");
      } else if (err.request) {
        setError("Unable to connect to server. Please check if the backend is running.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setEnrolling(false);
    }
  };

  // Get the first lesson ID for "Start Learning" button
  const firstLessonId = course?.curriculum?.[0]?.topics?.[0]?.id || 1;

  // Close toast after timeout
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);


  // Fetch user's review if they're a student
  useEffect(() => {
    const fetchUserReview = async () => {
      if (!course?._id || !user || user.role !== "student") {
        setUserReview(null);
        return;
      }

      try {
        const token = localStorage.getItem("ctm_token");
        if (!token) return;

        const response = await axios.get(
          `http://localhost:5000/api/reviews/user/${course._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserReview(response.data);
        setRating(response.data.rating);
      } catch (err) {
        // User hasn't reviewed yet, that's okay
        if (err.response?.status !== 404) {
          console.error("Error fetching user review:", err);
        }
      }
    };

    fetchUserReview();
  }, [course?._id, user]);

  // Handle rating submission
  const handleSubmitReview = async () => {
    if (!course?._id || !user || user.role !== "student" || rating === 0) {
      return;
    }

    try {
      setSubmittingReview(true);
      const token = localStorage.getItem("ctm_token");
      
      if (!token) {
        setError("Please log in to submit a review");
        setSubmittingReview(false);
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/reviews",
        {
          courseId: course._id,
          rating,
          comment: "",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUserReview(response.data);
      
      // Refresh course to get updated rating
      const courseResponse = await axios.get(`http://localhost:5000/api/courses/${course._id}`);
      const updatedCourse = courseResponse.data;
      setCourse(updatedCourse);
      
      // Log for debugging - verify rating update
      console.log('Course rating updated:', updatedCourse.rating);
      
      setShowToast(true);
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to submit review. Please try again.");
      }
    } finally {
      setSubmittingReview(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-3">⏳</div>
          <p className="text-gray-500 dark:text-gray-400 text-lg">Loading course...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !course) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-3">⚠️</div>
          <p className="text-red-600 dark:text-red-400 text-lg mb-4">{error}</p>
          <Link
            to="/courses"
            className="inline-flex items-center justify-center rounded-xl bg-black dark:bg-white dark:text-black text-white px-4 py-2 hover:bg-black/90 dark:hover:bg-gray-200 transition-colors"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  // No course found
  if (!course) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-3">📚</div>
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">Course not found</p>
          <Link
            to="/courses"
            className="inline-flex items-center justify-center rounded-xl bg-black dark:bg-white dark:text-black text-white px-4 py-2 hover:bg-black/90 dark:hover:bg-gray-200 transition-colors"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  // Resolve instructor information (with safety checks)
  const instructorName = course?.instructor 
    ? (typeof course.instructor === "string" 
        ? course.instructor 
        : course.instructor?.name || course.createdBy?.name || "Instructor")
    : course?.createdBy?.name || "Instructor";
  
  const instructorAvatar = course?.instructor?.photo || course?.instructor?.avatar || 
    course?.createdBy?.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(instructorName) + "&background=6366f1&color=fff";

  // Safety check - if course is still null at this point, show error
  if (!course) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-3">📚</div>
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">Course not found</p>
          <Link
            to="/courses"
            className="inline-flex items-center justify-center rounded-xl bg-black dark:bg-white dark:text-black text-white px-4 py-2 hover:bg-black/90 dark:hover:bg-gray-200 transition-colors"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <main className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {onBack ? (
          <button onClick={onBack} className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition">
            <IconArrowLeft />
            <span className="font-medium">Back to Courses</span>
          </button>
        ) : (
          <Link to="/courses" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition">
            <IconArrowLeft />
            <span className="font-medium">Back to Courses</span>
          </Link>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <span className="px-3 py-1 bg-gray-900 dark:bg-gray-700 text-white text-sm font-medium rounded-full mr-2">
                {course.category}
              </span>
              <span className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-full">
                {course.level}
              </span>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mt-4">{course.title}</h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">{course.description}</p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <IconStar className="text-yellow-400" />
                <span className="font-semibold text-gray-900 dark:text-white">
                  {course.rating ? course.rating.toFixed(1) : '0.0'}
                </span>
                <span>rating</span>
              </div>
              <div className="flex items-center gap-1">
                <IconUsers />
                <span className="font-semibold text-gray-900 dark:text-white">{(course.students || 0).toLocaleString()}</span>
                <span>students</span>
              </div>
              <div className="flex items-center gap-1">
                <IconClock />
                <span className="font-semibold text-gray-900 dark:text-white">{course.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <IconBook />
                <span className="font-semibold text-gray-900 dark:text-white">{totalLessons}</span>
                <span>lessons</span>
              </div>
            </div>

            {/* What you'll learn */}
            {course.learningPoints && course.learningPoints.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">What You'll Learn</h2>
                {course.learningPoints.map((p, i) => (
                  <div key={i} className="flex items-start gap-3 mb-2">
                    <IconCheckCircle className="text-green-500 dark:text-green-400 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{p}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Curriculum */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Course Curriculum</h2>
                {isEnrolled && course.curriculum && course.curriculum[0]?.topics && course.curriculum[0].topics[0] && (
                  <Link
                    to={`/courses/${course._id}/learn/${firstLessonId}`}
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium flex items-center gap-1"
                  >
                    <IconPlayCircle className="w-4 h-4" />
                    Start Learning
                  </Link>
                )}
              </div>
              {course.curriculum && course.curriculum.length > 0 ? (
                course.curriculum.map((mod, idx) => {
                  const key = mod.id ?? idx;
                  const open = key === expandedModule;
                  return (
                    <div key={key} className="border border-gray-200 dark:border-gray-700 rounded-lg mb-3">
                      <button
                        onClick={() => setExpandedModule(open ? null : key)}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition text-left"
                      >
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{`Module ${idx + 1}: ${mod.title}`}</h3>
                          {mod.description && <p className="text-sm text-gray-600 dark:text-gray-400">{mod.description}</p>}
                        </div>
                        <IconChevronDown className={`text-gray-400 dark:text-gray-500 transition-transform ${open ? "rotate-180" : ""}`} />
                      </button>
                      {open && (
                        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                          {(mod.topics || []).map((t, i) => {
                            const topicId = t.id || `${idx}-${i}`;
                            return (
                              <div key={i} className="px-4 py-3 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-800 transition group">
                                <span className="text-gray-700 dark:text-gray-300">{t.title}</span>
                                <div className="flex items-center gap-3">
                                  {t.duration && <span className="text-sm text-gray-500 dark:text-gray-400">{t.duration}</span>}
                                  {isEnrolled && (
                                    <Link
                                      to={`/courses/${course._id}/learn/${topicId}`}
                                      className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                                      title="Start this lesson"
                                    >
                                      <IconPlayCircle className="w-4 h-4" />
                                    </Link>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500">No curriculum available for this course.</p>
              )}
            </div>

            {/* Instructor */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About the Instructor</h2>
              <div className="flex items-start gap-4">
                <img src={instructorAvatar} alt={instructorName} className="w-20 h-20 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{instructorName}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Instructor</p>
                  {course.createdBy?.email && (
                    <p className="text-gray-600 dark:text-gray-300 mb-3 text-sm">{course.createdBy.email}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Rate This Course - Only for enrolled students */}
            {isEnrolled && user?.role === "student" && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {userReview ? "Your Rating" : "Rate This Course"}
                </h2>
                
                {/* Star Rating */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="focus:outline-none transition-transform hover:scale-110"
                        disabled={submittingReview}
                      >
                        <IconStar
                          className={`w-8 h-8 ${
                            star <= (hoveredRating || rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      </button>
                    ))}
                    {rating > 0 && (
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                        {rating} out of 5
                      </span>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmitReview}
                  disabled={rating === 0 || submittingReview}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                >
                  {submittingReview ? "Submitting..." : userReview ? "Update Rating" : "Submit Rating"}
                </button>
              </div>
            )}
          </div>

          {/* RIGHT — Info only */}
          <aside className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 sticky top-8 overflow-hidden">
              {course.image ? (
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-64 object-cover" 
                />
              ) : (
                <div className="w-full h-64 bg-gradient-to-br from-indigo-100 dark:from-indigo-900/30 to-purple-100 dark:to-purple-900/30 flex items-center justify-center">
                  <span className="text-6xl">🎓</span>
                </div>
              )}
              <div className="p-6 space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Rating</span>
                    <span className="font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                      <IconStar className="text-yellow-400 w-4 h-4" />
                      {course.rating ? course.rating.toFixed(1) : '0.0'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Duration</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{course.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Lessons</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{totalLessons}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Category</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{course.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Level</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{course.level}</span>
                  </div>
                </div>

                {/* Progress Bar - Show only if enrolled */}
                {isEnrolled && enrollmentData && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Your Progress</span>
                      {enrollmentData.completed && (
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                          <IconCheckCircle className="w-4 h-4" />
                          Completed
                        </span>
                      )}
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${
                          enrollmentData.completed 
                            ? 'bg-green-500 dark:bg-green-600' 
                            : 'bg-indigo-600 dark:bg-indigo-500'
                        }`}
                        style={{ width: `${enrollmentData.completed ? 100 : Math.max(0, Math.min(100, enrollmentData.progress))}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                      <span>{enrollmentData.completed ? '100%' : `${Math.round(enrollmentData.progress)}%`} Complete</span>
                      {!enrollmentData.completed && (
                        <span className="text-gray-500 dark:text-gray-500">In Progress</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Enrollment button for students */}
                {canEnroll ? (
                  <>
                    {isEnrolled ? (
                      <>
                        <button
                          disabled
                          className={`w-full inline-flex justify-center items-center gap-2 px-6 py-3 rounded-lg font-semibold cursor-not-allowed border ${
                            enrollmentData?.completed
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700'
                              : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-700'
                          }`}
                        >
                          <span>{enrollmentData?.completed ? '✅' : '📚'}</span>
                          {enrollmentData?.completed ? 'Course Completed' : 'Already Enrolled'}
                        </button>
                        {/* START LEARNING BUTTON */}
                        {course.curriculum && course.curriculum[0]?.topics && course.curriculum[0].topics[0] ? (
                          <Link
                            to={`/courses/${course._id}/learn/${firstLessonId}`}
                            className="w-full inline-flex justify-center items-center gap-2 px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition shadow-lg hover:shadow-xl"
                          >
                            <IconPlayCircle />
                            Start Learning
                          </Link>
                        ) : (
                          <div className="w-full inline-flex justify-center items-center gap-2 px-6 py-3 bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg font-semibold cursor-not-allowed">
                            <IconPlayCircle />
                            No Lessons Available
                          </div>
                        )}
                      </>
                    ) : (
                      <button
                        onClick={handleEnroll}
                        disabled={enrolling}
                        className="w-full inline-flex justify-center px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {enrolling ? "Enrolling..." : "Enroll Now"}
                      </button>
                    )}
                    <Link
                      to="/enrollments"
                      className="w-full inline-flex justify-center px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition border border-gray-300 dark:border-gray-600"
                    >
                      My Learning
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/courses"
                    className="w-full inline-flex justify-center px-6 py-3 bg-gray-900 dark:bg-white dark:text-black text-white rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition"
                  >
                    Browse More Courses
                  </Link>
                )}

                {/* Toast notification */}
                {showToast && (
                  <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg z-50 flex items-center gap-2">
                    <span>✅</span>
                    <span>Enrolled successfully! Redirecting to My Learning...</span>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
