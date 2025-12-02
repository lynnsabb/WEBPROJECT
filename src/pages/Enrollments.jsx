import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../state/auth.jsx";

function IconCheckCircle(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...props}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 
      10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 
      1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  );
}

export default function Enrollments() {
  const { user } = useAuth();
  const location = useLocation();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  if (!user || user.role !== "student") {
    return (
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="rounded-2xl border bg-white p-10 text-center">
          <div className="text-4xl mb-3">🔒</div>
          <h1 className="text-2xl font-bold mb-2">Access denied</h1>
          <p className="text-gray-600 mb-6">This page is only available to students.</p>
          <Link
            to="/courses"
            className="inline-flex items-center justify-center rounded-xl bg-black text-white px-4 py-2 hover:bg-black/90"
          >
            Browse Courses
          </Link>
        </div>
      </section>
    );
  }

  // Fetch user's enrollments from API
<<<<<<< Updated upstream
  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        setError("");
        
        const token = localStorage.getItem("ctm_token");
        if (!token) {
          setError("Please log in to view your enrollments");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/enrollments/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const enrollmentsData = response.data || [];
        console.log('Fetched enrollments:', enrollmentsData);
        
        // Filter out enrollments with missing or invalid course data
        const validEnrollments = enrollmentsData.filter((enrollment) => {
          const course = enrollment.courseId || enrollment.course;
          // Check if course exists and has required fields
          if (!course) {
            console.warn('Enrollment missing course:', enrollment._id);
            return false;
          }
          // If courseId is just a string (not populated), skip it
          if (typeof course === 'string') {
            console.warn('Enrollment course not populated:', enrollment._id);
            return false;
          }
          // If course object exists but missing critical fields
          if (!course._id || !course.title) {
            console.warn('Enrollment course missing required fields:', enrollment._id, course);
            return false;
          }
          return true;
        });
        
        const filteredCount = enrollmentsData.length - validEnrollments.length;
        if (filteredCount > 0) {
          console.warn(`${filteredCount} enrollments filtered out due to missing course data`);
        }
        
        setEnrollments(validEnrollments);
      } catch (err) {
        if (err.response && err.response.data) {
          setError(err.response.data.message || "Failed to load enrollments");
        } else if (err.request) {
          setError("Unable to connect to server. Please check if the backend is running.");
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      } finally {
=======
  const fetchEnrollments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      
      const token = localStorage.getItem("ctm_token");
      if (!token) {
        setError("Please log in to view your enrollments");
>>>>>>> Stashed changes
        setLoading(false);
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/enrollments/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Filter out enrollments where the course was deleted (courseId is null)
      const validEnrollments = (response.data || []).filter(
        (enrollment) => enrollment.courseId && enrollment.courseId !== null
      );
      setEnrollments(validEnrollments);
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Failed to load enrollments");
      } else if (err.request) {
        setError("Unable to connect to server. Please check if the backend is running.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch enrollments on mount and when location changes (navigation back to page)
  useEffect(() => {
    fetchEnrollments();
  }, [location.pathname, fetchEnrollments]);

  // Also refresh when page becomes visible (user switches back to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchEnrollments();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchEnrollments]);

<<<<<<< Updated upstream
  // Refresh enrollments when page becomes visible (user navigates back)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const token = localStorage.getItem("ctm_token");
        if (token) {
          axios.get(
            "http://localhost:5000/api/enrollments/me",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ).then(response => {
            const enrollmentsData = response.data || [];
            // Filter out enrollments with missing or invalid course data
            const validEnrollments = enrollmentsData.filter((enrollment) => {
              const course = enrollment.courseId || enrollment.course;
              if (!course) return false;
              if (typeof course === 'string') return false;
              if (!course._id) return false;
              if (!course.title) return false;
              return true;
            });
            setEnrollments(validEnrollments);
          }).catch(err => {
            console.error("Error refreshing enrollments:", err);
          });
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const completedCount = enrollments.filter((e) => e.completed).length;
=======
  // Filter out any enrollments with deleted courses (safety check)
  const validEnrollments = enrollments.filter(
    (enrollment) => enrollment.courseId && enrollment.courseId !== null
  );
  
  // Count completed courses (only from valid enrollments)
  const completedCount = validEnrollments.filter((e) => e.completed === true).length;
>>>>>>> Stashed changes

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">My Learning</h1>
        <p className="text-gray-600 text-lg">Track your courses and continue learning</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <div className="rounded-2xl border bg-white p-5">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700 font-medium">Enrolled Courses</div>
            <div className="text-gray-400 text-lg">📘</div>
          </div>
          <div className="text-2xl font-bold mt-2">{validEnrollments.length}</div>
          <div className="text-xs text-gray-500">Active enrollments</div>
        </div>

        <div className="rounded-2xl border bg-white p-5">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700 font-medium">Completed</div>
            <div className="text-gray-400 text-lg">🥇</div>
          </div>
          <div className="text-2xl font-bold mt-2">{completedCount}</div>
          <div className="text-xs text-gray-500">Marked as finished</div>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border bg-white p-12 text-center">
          <div className="text-5xl mb-3">⏳</div>
          <h3 className="text-xl font-semibold mb-2">Loading...</h3>
          <p className="text-gray-600">Fetching your enrollments...</p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border bg-white p-12 text-center">
          <div className="text-5xl mb-3">⚠️</div>
          <h3 className="text-xl font-semibold mb-2">Error</h3>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center rounded-xl bg-black text-white px-4 py-2 hover:bg-black/90"
          >
            Retry
          </button>
        </div>
      ) : validEnrollments.length > 0 ? (
        <>
          <h2 className="text-2xl font-bold mb-4 mt-2">Your Courses</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
<<<<<<< Updated upstream
            {enrollments.map((enrollment) => {
              const course = enrollment.courseId || enrollment.course;
=======
            {validEnrollments.map((enrollment) => {
              const course = enrollment.courseId;
>>>>>>> Stashed changes
              const done = enrollment.completed;
              const progress = enrollment.progress || 0;
              
              if (!course) {
                console.warn('Enrollment missing course data:', enrollment);
                return null;
              }

              return (
                <div
                  key={enrollment._id}
                  className="group overflow-hidden rounded-2xl border bg-white transition-all hover:shadow-lg"
                >
                  <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 relative overflow-hidden">
                    {course.image ? (
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-3xl absolute inset-0 grid place-items-center">
                        🎓
                      </span>
                    )}
                    {done && (
                      <span className="absolute right-2 top-2 rounded-full bg-emerald-600 text-white text-xs px-2 py-0.5 flex items-center gap-1">
                        <IconCheckCircle className="w-3 h-3" />
                        Completed
                      </span>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="mb-2">
                      <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-700 px-2.5 py-0.5 text-xs">
                        {course.category}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg leading-snug line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mt-1">
                      {course.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mt-3 mb-2">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-black h-2 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-3 mb-3">
                      {done ? (
                        <span className="inline-flex items-center text-emerald-600 text-sm font-medium gap-1">
                          ✅ Completed
                        </span>
                      ) : (
                        <span className="text-gray-500 text-sm italic">
                          In Progress
                        </span>
                      )}
                    </div>

                    {course.instructor && (
                      <p className="text-xs text-gray-500 mb-3">
                        Instructor:{" "}
                        <span className="font-medium text-gray-700">
                          {typeof course.instructor === "string"
                            ? course.instructor
                            : course.instructor?.name || "Unknown"}
                        </span>
                      </p>
                    )}

                    <div className="mt-4 flex gap-2">
                      <Link
                        to={`/courses/${course._id}`}
                        className="flex-1 inline-flex items-center justify-center rounded-xl bg-black text-white px-4 py-2 hover:bg-black/90"
                      >
                        {done ? "Review Course" : "Continue Learning"}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="rounded-2xl border bg-white p-12 text-center">
          <div className="text-5xl mb-3">📘</div>
          <h3 className="text-xl font-semibold mb-2">No Enrollments Yet</h3>
          <p className="text-gray-600 mb-6">
            You haven't enrolled in any courses yet. Browse our catalog to start learning!
          </p>
          <Link
            to="/courses"
            className="inline-flex items-center justify-center rounded-xl bg-black text-white px-4 py-2 hover:bg-black/90"
          >
            Browse Courses
          </Link>
        </div>
      )}
    </section>
  );
}
