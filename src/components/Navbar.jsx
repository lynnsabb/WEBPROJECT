//farah
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../state/auth.jsx";
import { useEffect, useState } from "react";

// Dark mode icons
function IconSun(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function IconMoon(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage or system preference
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('darkMode');
      if (stored !== null) return stored === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const onLogout = () => {
    logout();
    navigate("/"); // redirect instantly after logout
  };

  // Optional: close mobile menu on route change
  useEffect(() => {
    const close = () => setMenuOpen(false);
    window.addEventListener("popstate", close);
    return () => window.removeEventListener("popstate", close);
  }, []);

  return (
    <header className="border-b bg-white dark:bg-gray-900 dark:border-gray-800">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-semibold text-lg text-gray-900 dark:text-white"
          >
          <img
            src="https://cdn-icons-png.flaticon.com/512/4431/4431898.png"
            alt="LearnHub Logo"
            className="w-8 h-8 object-contain rounded-lg"
          />
          LearnHub
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm font-medium ${
                isActive 
                  ? "text-black dark:text-white" 
                  : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/courses"
            className={({ isActive }) =>
              `text-sm font-medium ${
                isActive 
                  ? "text-black dark:text-white" 
                  : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
              }`
            }
          >
            Courses
          </NavLink>

          {/* Student-only link */}
          {user?.role === "student" && (
            <NavLink
              to="/enrollments"
              className={({ isActive }) =>
                `text-sm font-medium ${
                  isActive ? "text-black" : "text-gray-600 hover:text-black"
                }`
              }
            >
              My Learning
            </NavLink>
          )}

          {/* Instructor-only link */}
          {user?.role === "instructor" && (
            <NavLink
              to="/manage"
              className={({ isActive }) =>
                `text-sm font-medium ${
                  isActive ? "text-black" : "text-gray-600 hover:text-black"
                }`
              }
            >
              Manage Courses
            </NavLink>
          )}
        </div>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <IconSun /> : <IconMoon />}
          </button>
          
          {user ? (
            <>
              <NavLink
                to="/profile"
                className="text-sm text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
              >
                {user.name?.split(" ")[0] ?? "Profile"}
              </NavLink>
              <button
                onClick={onLogout}
                className="rounded-xl bg-black dark:bg-white dark:text-black text-white text-sm px-4 py-2 hover:bg-black/90 dark:hover:bg-gray-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-black dark:bg-white dark:text-black text-white text-sm px-4 py-2 hover:bg-black/90 dark:hover:bg-gray-200"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <IconSun /> : <IconMoon />}
          </button>
          <button
            className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 px-4 py-3 space-y-3">
          <NavLink to="/" onClick={() => setMenuOpen(false)} className="block text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white">
            Home
          </NavLink>
          <NavLink to="/courses" onClick={() => setMenuOpen(false)} className="block text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white">
            Courses
          </NavLink>

          {user?.role === "student" && (
            <NavLink to="/enrollments" onClick={() => setMenuOpen(false)} className="block text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white">
              My Learning
            </NavLink>
          )}
          {user?.role === "instructor" && (
            <NavLink to="/manage" onClick={() => setMenuOpen(false)} className="block text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white">
              Manage Courses
            </NavLink>
          )}

          <hr className="border-gray-200 dark:border-gray-800" />

          {user ? (
            <>
              <NavLink to="/profile" onClick={() => setMenuOpen(false)} className="block text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white">
                Profile
              </NavLink>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onLogout();
                }}
                className="w-full text-left text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={() => setMenuOpen(false)} className="block text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white">
                Log in
              </NavLink>
              <NavLink to="/register" onClick={() => setMenuOpen(false)} className="block text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white">
                Sign up
              </NavLink>
            </>
          )}
        </div>
      )}
    </header>
  );
}
