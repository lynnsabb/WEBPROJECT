import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config/api.js";

// === Inline SVG icons ===
function IconSearch(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden {...props}>
      <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79L20 21.5 21.5 20l-6-6zM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
    </svg>
  );
}
function IconFilter(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden {...props}>
      <path fill="currentColor" d="M3 5h18v2H3V5zm4 6h10v2H7v-2zm3 6h4v2h-4v-2z" />
    </svg>
  );
}
function IconChevronDown(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden {...props}>
      <path fill="currentColor" d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
    </svg>
  );
}
function IconStar(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden {...props}>
      <path fill="currentColor" d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}
function IconUsers(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden {...props}>
      <path fill="currentColor" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0C9.66 11 11 9.66 11 8S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C18 14.17 13.33 13 11 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5C26 14.17 21.33 13 19 13z" />
    </svg>
  );
}
function IconClock(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden {...props}>
      <path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
    </svg>
  );
}

export default function CourseCatalog() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedSort, setSelectedSort] = useState('Most Popular');

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError("");
        
        const response = await axios.get(`${API_BASE_URL}/courses`);
        setCourses(response.data || []);
      } catch (err) {
        if (err.response && err.response.data) {
          setError(err.response.data.message || "Failed to load courses");
        } else if (err.request) {
          setError("Unable to connect to server. Please check if the backend is running.");
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(courses.map(c => c.category).filter(Boolean)));
    return ['All', ...cats];
  }, [courses]);

  const levels = useMemo(() => {
    const levs = Array.from(new Set(courses.map(c => c.level).filter(Boolean)));
    return ['All', ...levs];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    let list = [...courses];
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      list = list.filter(c => {
        const instructorName = typeof c.instructor === 'string' 
          ? c.instructor 
          : c.instructor?.name || '';
        return [c.title, c.description, c.category, instructorName].join(' ').toLowerCase().includes(query);
      });
    }
    if (selectedCategory !== 'All') list = list.filter(c => c.category === selectedCategory);
    if (selectedLevel !== 'All') list = list.filter(c => c.level === selectedLevel);
    if (selectedSort === 'Highest Rated') list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else list.sort((a, b) => (b.students || 0) - (a.students || 0));
    return list;
  }, [courses, searchQuery, selectedCategory, selectedLevel, selectedSort]);

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner': return 'bg-green-500';
      case 'Intermediate': return 'bg-blue-500';
      case 'Advanced': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">All Courses</h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            {loading ? "Loading courses..." : `Explore our collection of ${courses.length} courses and start learning today`}
          </p>
        </div>

        {/* === Filters Section === */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-indigo-500"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <IconChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Level Filter */}
            <div className="relative">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
              <IconChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Sort Filter */}
            <div className="relative">
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="Most Popular">Most Popular</option>
                <option value="Highest Rated">Highest Rated</option>
              </select>
              <IconChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* === Course Grid === */}
        {loading ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">⏳</div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">Loading courses...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">⚠️</div>
            <p className="text-red-600 dark:text-red-400 text-lg mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center rounded-xl bg-black dark:bg-white dark:text-black text-white px-4 py-2 hover:bg-black/90 dark:hover:bg-gray-200 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <Link key={course._id} to={`/courses/${course._id}`} className="block">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">

                  {/* Image + Level Badge */}
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-100 dark:from-purple-900/30 to-blue-100 dark:to-blue-900/30">
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                    <span className={`absolute top-4 right-4 px-3 py-1 ${getLevelColor(course.level)} text-white text-sm font-medium rounded-full`}>
                      {course.level}
                    </span>
                  </div>

                  {/* Course Content */}
                  <div className="p-6">
                    <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-full mb-3">
                      {course.category}
                    </span>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{course.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{course.description}</p>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Instructor: <span className="font-medium text-gray-800 dark:text-gray-200">
                        {typeof course.instructor === 'string' 
                          ? course.instructor 
                          : course.instructor?.name || 'Unknown'}
                      </span>
                    </p>

                    {/* Icons: Rating / Students / Duration */}
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-3">
                      <div className="flex items-center gap-1">
                        <IconStar className="text-yellow-400" />
                        <span className="font-semibold text-gray-900 dark:text-white">{course.rating}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <IconUsers className="text-gray-600 dark:text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">{(course.students || 0).toLocaleString()}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <IconClock className="text-gray-600 dark:text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">{course.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No courses found matching your filters.</p>
          </div>
        )}
      </main>
    </div>
  );
}
