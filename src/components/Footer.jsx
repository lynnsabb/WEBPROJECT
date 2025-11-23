// src/components/Footer.jsx
// farah
import { Link } from "react-router-dom";
import { useAuth } from "../state/auth.jsx";

export default function Footer() {
  const { user } = useAuth();

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          <div>
            <Link
              to="/"
              className="flex items-center gap-3 font-semibold text-lg text-gray-900 dark:text-white mb-4"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/4431/4431898.png"
                alt="LearnHub Logo"
                className="w-10 h-10 object-contain rounded-lg"
              />
              LearnHub
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400">Course Tutorial Management System</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {user ? (
                <>
                  <li>
                    <Link
                      to="/"
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/courses"
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      Courses
                    </Link>
                  </li>

                  {user.role === "student" && (
                    <li>
                      <Link
                        to="/enrollments"
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        My Learning
                      </Link>
                    </li>
                  )}

                  {user.role === "instructor" && (
                    <li>
                      <Link
                        to="/manage"
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        Manage Courses
                      </Link>
                    </li>
                  )}

                  <li>
                    <Link
                      to="/profile"
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      Profile
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to="/login"
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                Email:{" "}
                <a
                  href="mailto:support@learnhub.com"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  support@learnhub.com
                </a>
              </li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: Beirut, Lebanon</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} LearnHub • Course Tutorial Management System. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
