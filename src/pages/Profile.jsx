import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../state/auth.jsx";

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [instructorCourses, setInstructorCourses] = useState([]);
  const [uniqueStudentsCount, setUniqueStudentsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("ctm_token");
        
        if (!token) {
          setError("Please log in to view your profile");
          setLoading(false);
          return;
        }

        // Fetch enrollments for students
        if (user.role === "student") {
          try {
            const enrollmentsResponse = await axios.get(
              "http://localhost:5000/api/enrollments/me",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            setEnrollments(enrollmentsResponse.data || []);
          } catch (err) {
            console.error("Error fetching enrollments:", err);
            setEnrollments([]);
          }
        }

        // Fetch instructor's courses
        if (user.role === "instructor") {
          try {
            const coursesResponse = await axios.get("http://localhost:5000/api/courses", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            // Filter to only courses created by this instructor
            const myCourses = coursesResponse.data.filter(
              (course) => course.createdBy && String(course.createdBy._id || course.createdBy) === String(user._id)
            );
            setInstructorCourses(myCourses);

            // Fetch unique student count across all instructor's courses
            try {
              const studentsResponse = await axios.get(
                `http://localhost:5000/api/courses/instructor/${user._id}/students`
              );
              const uniqueCount = studentsResponse.data.uniqueStudents || 0;
              console.log('Unique students count from API:', uniqueCount);
              setUniqueStudentsCount(uniqueCount);
            } catch (err) {
              console.error("Error fetching unique students count:", err);
              console.error("Error details:", err.response?.data || err.message);
              // Don't use fallback - it would give wrong count. Set to 0 if API fails.
              setUniqueStudentsCount(0);
            }
          } catch (err) {
            console.error("Error fetching courses:", err);
            setInstructorCourses([]);
            setUniqueStudentsCount(0);
          }
        }
      } catch (err) {
        if (err.response && err.response.data) {
          setError(err.response.data.message || "Failed to load profile data");
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  if (!user) return null;

  const role = user.role ?? "student";
  const isStudent = role === "student";
  const initials = (user?.name ?? user?.email ?? "U").slice(0, 1).toUpperCase();

  // Calculate stats for students
  const stats = {
    enrolled: enrollments.length,
    completed: enrollments.filter((e) => e.completed).length,
    certificates: enrollments.filter((e) => e.completed).length,
  };

  // Calculate member since date (from user creation timestamp if available)
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "Recently";

  return (
    <section className="max-w-7xl mx-auto w-full px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
        <div className="flex gap-3">
          <Link
            to="/profile/edit"
            className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium text-gray-900 dark:text-white transition-colors"
          >
            Edit Profile
          </Link>
          <Link
            to="/profile/change-password"
            className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium text-gray-900 dark:text-white transition-colors"
          >
            Change Password
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
        <div className="flex items-start gap-6">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {initials}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name ?? "User"}</h2>
                <p className="text-gray-600 dark:text-gray-300 mt-1">{user?.email}</p>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                  <span>Member since {memberSince}</span>
                  <span className="inline-flex items-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30 px-3 py-1 text-indigo-700 dark:text-indigo-400 font-medium">
                    {isStudent ? "Student" : "Instructor"}
                  </span>
                  {!isStudent && user?.specialty && (
                    <span className="inline-flex items-center rounded-lg bg-gray-100 dark:bg-gray-700 px-3 py-1 text-gray-700 dark:text-gray-300">
                      {user.specialty}
                    </span>
                  )}
                </div>
                {!isStudent && user?.bio && (
                  <p className="text-gray-600 dark:text-gray-300 mt-3 max-w-2xl">{user.bio}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">⏳</div>
          <p className="text-gray-500 dark:text-gray-400 text-lg">Loading profile data...</p>
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">⚠️</div>
          <p className="text-red-600 dark:text-red-400 text-lg mb-4">{error}</p>
        </div>
      ) : (
        <>
              {isStudent && (
            <>
              <div className="grid gap-4 md:grid-cols-3">
                <StatCard title="Courses Enrolled" value={stats.enrolled} icon="📚" />
                <StatCard title="Courses Completed" value={stats.completed} icon="🏆" />
                <StatCard title="Certificates Earned" value={stats.certificates} icon="🎓" />
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Courses & Progress</h2>
                {enrollments.length === 0 ? (
                  <EmptyEnrollments />
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {enrollments.map((enrollment) => {
                      const course = enrollment.courseId;
                      if (!course) return null;
                      
                      const progress = enrollment.progress || 0;
                      const completed = enrollment.completed || false;
                      const p = completed ? 100 : progress;

                      return (
                        <div key={enrollment._id} className="group overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm transition-all hover:shadow-lg dark:hover:shadow-xl">
                          <div className="aspect-video bg-gradient-to-br from-indigo-100 dark:from-indigo-900/30 to-purple-100 dark:to-purple-900/30 relative overflow-hidden">
                            {course.image ? (
                              <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-gray-400 dark:text-gray-500 text-4xl absolute inset-0 grid place-items-center">🎓</span>
                            )}
                            {completed && (
                              <span className="absolute right-2 top-2 rounded-full bg-green-600 dark:bg-green-500 text-white text-xs px-2 py-1">
                                Completed
                              </span>
                            )}
                          </div>

                          <div className="p-5">
                            <h3 className="font-semibold text-lg leading-tight line-clamp-2 mb-2 text-gray-900 dark:text-white">{course.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                              Instructor:{" "}
                              <span className="font-medium text-gray-900 dark:text-white">
                                {typeof course.instructor === "string" ? course.instructor : course.instructor?.name || "Unknown"}
                              </span>
                            </p>

                            <div className="mb-4">
                              <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
                                <span className="font-medium">{p === 100 ? "Completed ✅" : "In Progress"}</span>
                                <span className="font-semibold">Progress: {p}%</span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all duration-300 ${p === 100 ? "bg-green-500 dark:bg-green-400" : "bg-indigo-600 dark:bg-indigo-500"}`}
                                  style={{ width: `${p}%` }}
                                />
                              </div>
                            </div>

                            <div className="flex flex-col gap-2">
                              <Link
                                to={`/courses/${course._id}`}
                                className="w-full inline-flex items-center justify-center rounded-xl bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2.5 hover:bg-indigo-700 dark:hover:bg-indigo-600 font-medium text-sm transition-colors"
                              >
                                Continue Learning
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}

          {!isStudent && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <StatCard title="Your Courses" value={instructorCourses.length} icon="📘" />
                <StatCard
                  title="Total Students"
                  value={uniqueStudentsCount}
                  icon="👥"
                />
                <StatCard
                  title="Average Rating"
                  value={
                    instructorCourses.length
                      ? (instructorCourses.reduce((s, c) => s + (c.rating || 0), 0) / instructorCourses.length).toFixed(1)
                      : 0
                  }
                  icon="⭐"
                />
              </div>

              <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Courses</h2>
                  <div className="flex gap-3">
                    <Link to="/manage" className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white hover:bg-black/90 dark:hover:bg-gray-200 transition-colors">
                      Manage Courses
                    </Link>
                    <Link to="/courses" className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      Browse Catalog
                    </Link>
                  </div>
                </div>

                {instructorCourses.length === 0 ? (
                  <p className="text-gray-600 dark:text-gray-300">You don't have courses yet. Go to "Manage Courses" to create one.</p>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {instructorCourses.map((c) => (
                      <div key={c._id} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden hover:shadow-md dark:hover:shadow-lg transition">
                        <div className="aspect-video bg-gray-100 dark:bg-gray-700">
                          {c.image ? (
                            <img src={c.image} alt={c.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full grid place-items-center text-3xl">📘</div>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                            <span>{c.category}</span>
                            <span>⭐ {c.rating || 0}</span>
                          </div>
                          <h3 className="font-semibold line-clamp-2 text-gray-900 dark:text-white">{c.title}</h3>
                          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mt-2">
                            <span>👥 {(c.students || 0).toLocaleString()}</span>
                            <Link to={`/courses/${c._id}`} className="text-indigo-600 dark:text-indigo-400 hover:underline">
                              View
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{title}</div>
        <div className="text-2xl">{icon}</div>
      </div>
      <div className="text-3xl font-bold text-gray-900 dark:text-white">{value}</div>
    </div>
  );
}

function EmptyEnrollments() {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-12 text-center shadow-sm">
      <div className="text-5xl mb-3">📚</div>
      <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">No Enrollments Yet</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        You haven't enrolled in any courses yet. Browse our catalog to start learning!
      </p>
      <Link
        to="/courses"
        className="inline-flex items-center justify-center rounded-xl bg-black dark:bg-white dark:text-black text-white px-6 py-3 hover:bg-black/90 dark:hover:bg-gray-200 transition-colors"
      >
        Browse Courses
      </Link>
    </div>
  );
}

