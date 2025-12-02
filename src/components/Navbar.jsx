//farah
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../state/auth.jsx";
import { useEffect, useState } from "react";

// Dark mode icons
function IconSun(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...props}
    >
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
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...props}
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export default function Navbar({ isHome = false }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("darkMode");
      if (stored !== null) return stored === "true";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  const [isScrolled, setIsScrolled] = useState(false);

  // only transparent on top of home hero
  const useTransparent = isHome && !isScrolled;

  // dark mode side-effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  // scroll effect: on home → watch scroll; on other pages → always treated as "scrolled"
  useEffect(() => {
    if (!isHome) {
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  // close mobile menu on back/forward
  useEffect(() => {
    const close = () => setMenuOpen(false);
    window.addEventListener("popstate", close);
    return () => window.removeEventListener("popstate", close);
  }, []);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const onLogout = () => {
    logout();
    navigate("/");
  };

  // classes for links depending on state
  const navActive =
    useTransparent ? "text-white" : "text-black dark:text-white";
  const navInactive = useTransparent
    ? "text-white/80 hover:text-white"
    : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white";

  const textLink = useTransparent
    ? "text-white/90 hover:text-white"
    : "text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white";

  const darkToggleClasses = useTransparent
    ? "p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
    : "p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors";

  return (
    <header
      className={`${isHome ? "fixed top-0 left-0 right-0 z-50" : ""} ${
        useTransparent
          ? "border-b border-transparent bg-transparent"
          : "border-b bg-white dark:bg-gray-900 dark:border-gray-800"
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        
        <Link
          to="/"
          className={`flex items-center gap-2 font-semibold text-lg ${
            useTransparent
              ? "text-white"
              : "text-gray-900 dark:text-white"
          }`}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/4431/4431898.png"
            alt="LearnHub Logo"
            className="w-8 h-8 object-contain rounded-lg"
          />
          LearnHub
        </Link>

        
        <div className="hidden md:flex items-center gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm font-medium ${
                isActive ? navActive : navInactive
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/courses"
            className={({ isActive }) =>
              `text-sm font-medium ${
                isActive ? navActive : navInactive
              }`
            }
          >
            Courses
          </NavLink>

          
          {user?.role === "student" && (
            <NavLink
              to="/enrollments"
              className={({ isActive }) =>
                `text-sm font-medium ${
                  isActive ? navActive : navInactive
                }`
              }
            >
              My Learning
            </NavLink>
          )}

          
          {user?.role === "instructor" && (
            <NavLink
              to="/manage"
              className={({ isActive }) =>
                `text-sm font-medium ${
                  isActive ? navActive : navInactive
                }`
              }
            >
              Manage Courses
            </NavLink>
          )}
        </div>

        
        <div className="hidden md:flex items-center gap-4">
      
          <button
            onClick={toggleDarkMode}
            className={darkToggleClasses}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <IconSun /> : <IconMoon />}
          </button>

          {user ? (
            <>
              <NavLink
                to="/profile"
                className={`text-sm ${textLink}`}
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
              <Link to="/login" className={`text-sm ${textLink}`}>
                Log in
              </Link>
              <Link
                to="/register"
                className={`rounded-xl text-sm px-4 py-2 font-semibold transition-colors ${
                  useTransparent
                    ? "bg-white text-indigo-700 hover:bg-indigo-50"
                    : "bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                }`}
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
            className={darkToggleClasses}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <IconSun /> : <IconMoon />}
          </button>
          <button
            className={`text-lg ${
              useTransparent
                ? "text-white hover:text-gray-100"
                : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
            }`}
            onClick={() => setMenuOpen((open) => !open)}
          >
            ☰
          </button>
        </div>
      </nav>

    
      {menuOpen && (
        <div className="md:hidden border-t bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 px-4 py-3 space-y-3">
          <NavLink
            to="/"
            onClick={() => setMenuOpen(false)}
            className="block text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
          >
            Home
          </NavLink>
          <NavLink
            to="/courses"
            onClick={() => setMenuOpen(false)}
            className="block text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
          >
            Courses
          </NavLink>

          {user?.role === "student" && (
            <NavLink
              to="/enrollments"
              onClick={() => setMenuOpen(false)}
              className="block text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
            >
              My Learning
            </NavLink>
          )}
          {user?.role === "instructor" && (
            <NavLink
              to="/manage"
              onClick={() => setMenuOpen(false)}
              className="block text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
            >
              Manage Courses
            </NavLink>
          )}

          <hr className="border-gray-200 dark:border-gray-800" />

          {user ? (
            <>
              <NavLink
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="block text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
              >
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
              <NavLink
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
              >
                Log in
              </NavLink>
              <NavLink
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="block text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
              >
                Sign up
              </NavLink>
            </>
          )}
        </div>
      )}
    </header>
  );
}
