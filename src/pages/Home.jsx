import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from "../state/auth.jsx";

import { 
  instructors,
  testimonials,
  howItWorksSteps,
  whyChooseUsData,
  platformStats,
  categories,
  learningPaths,
  newsletterContent
} from '../data/mock';

// Icon components
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

function IconGraduation(props) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden {...props}>
      <path fill="currentColor" d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
    </svg>
  );
}

function IconZap(props) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden {...props}>
      <path fill="currentColor" d="M7 2v11h3v9l7-12h-4l4-8z" />
    </svg>
  );
}

function IconPuzzle(props) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden {...props}>
      <path fill="currentColor" d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z" />
    </svg>
  );
}

function IconTrendingUp(props) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden {...props}>
      <path fill="currentColor" d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
    </svg>
  );
}

function IconArrowRight(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden {...props}>
      <path fill="currentColor" d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
    </svg>
  );
}

function IconSearch(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function IconBook(props) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function IconBookOpen(props) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function IconBarChart(props) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  );
}

function IconTrophy(props) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}

function IconLaptop(props) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect width="20" height="14" x="2" y="4" rx="2" ry="2" />
      <path d="M2 20h20" />
    </svg>
  );
}

function IconServer(props) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
      <rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" />
      <line x1="6" y1="18" x2="6.01" y2="18" />
    </svg>
  );
}

function IconCode(props) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function IconPalette(props) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="13.5" cy="6.5" r=".5" />
      <circle cx="17.5" cy="10.5" r=".5" />
      <circle cx="8.5" cy="7.5" r=".5" />
      <circle cx="6.5" cy="12.5" r=".5" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </svg>
  );
}

function IconChevronLeft(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function IconChevronRight(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

// Dynamic icon component
function DynamicIcon({ iconName, ...props }) {
  const icons = {
    Search: IconSearch,
    BookOpen: IconBookOpen,
    BarChart: IconBarChart,
    Graduation: IconGraduation,
    Zap: IconZap,
    Puzzle: IconPuzzle,
    Trophy: IconTrophy,
    Users: IconUsers,
    Book: IconBook,
    Star: IconStar,
    Laptop: IconLaptop,
    Server: IconServer,
    Code: IconCode,
    Palette: IconPalette,
    TrendingUp: IconTrendingUp,
  };
  
  const IconComponent = icons[iconName] || IconBook;
  return <IconComponent {...props} />;
}

export default function Home() {

  const { user, isAuthenticated } = useAuth(); 

  const [searchQuery, setSearchQuery] = useState("");
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/courses");
        setCourses(response.data || []);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Get top 6 courses sorted by rating (for popular section)
  const popularCourses = [...courses]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 6);

  // Filter courses based on search query
  const filteredPopularCourses = popularCourses.filter(course => {
    const instructorName = typeof course.instructor === 'string' 
      ? course.instructor 
      : course.instructor?.name || '';
    return course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      instructorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Get top 4 instructors
  const featuredInstructors = instructors.slice(0, 4);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you for subscribing! We'll send updates to ${newsletterEmail}`);
    setNewsletterEmail("");
  };

  // Get learning path courses
  const getPathCourses = (courseIds) => {
    // For learning paths, we'll use the first few courses from the fetched courses
    // since courseIds in mock data are numeric but MongoDB uses _id
    return courses.slice(0, courseIds.length);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 dark:from-indigo-800 dark:via-purple-800 dark:to-indigo-900 text-white overflow-hidden">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-700/50 via-purple-600/40 to-indigo-800/50 dark:from-indigo-900/60 dark:via-purple-900/50 dark:to-indigo-950/60"></div>
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
        
        {/* Decorative circles */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-36">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-sm font-medium text-white/90 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Free Online Learning Platform
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
              Empower Your
              <span className="block bg-gradient-to-r from-white via-purple-100 to-indigo-100 bg-clip-text text-transparent">
                Learning Journey
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 dark:text-white/80 mb-10 leading-relaxed max-w-2xl">
              Explore Free Courses and Learn Anytime, Anywhere. Join thousands of learners transforming their careers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/courses"
                className="group inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-600 dark:text-indigo-700 font-semibold rounded-2xl hover:bg-indigo-50 dark:hover:bg-gray-50 transition-all duration-300 shadow-2xl hover:shadow-indigo-500/50 hover:scale-105 transform"
              >
                <span>Explore Courses</span>
                <IconArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>

              {isAuthenticated ? (
                <Link
                  to={user?.role === "instructor" ? "/manage" : "/enrollments"}
                  className="group inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white font-semibold rounded-2xl hover:bg-white/20 hover:border-white/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 transform"
                >
                  <span>{user?.role === "instructor" ? "Go to Manage Courses" : "Go to My Learning"}</span>
                  <IconArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="group inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white font-semibold rounded-2xl hover:bg-white/20 hover:border-white/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 transform"
                >
                  <span>Sign In</span>
                  <IconArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>
          </div>
        </div>
        
        {/* Smooth transition curve */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent via-white/5 to-white dark:via-gray-900/5 dark:to-gray-900"></div>
      </section>

      {/* Stats Banner Section */}
      <section className="relative -mt-20 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {platformStats.map((stat, index) => (
              <div 
                key={index} 
                className="group relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-3 p-3 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <DynamicIcon iconName={stat.icon} className="text-indigo-600 dark:text-indigo-400 w-6 h-6" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Start learning in 3 simple steps.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {howItWorksSteps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/40 dark:to-purple-900/30 rounded-full mb-4 shadow-sm">
                <DynamicIcon iconName={step.icon} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Platform Highlights / Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose LearnHub?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover what makes our platform the perfect choice for your learning journey
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyChooseUsData.map((feature, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4 shadow-sm ${
                feature.icon === 'Graduation' ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/40 dark:to-indigo-900/30' :
                feature.icon === 'Zap' ? 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/40 dark:to-pink-900/30' :
                feature.icon === 'Puzzle' ? 'bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/40 dark:to-purple-900/30' :
                'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/40 dark:to-emerald-900/30'
              }`}>
                <DynamicIcon 
                  iconName={feature.icon} 
                  className={
                    feature.icon === 'Graduation' ? 'text-blue-600 dark:text-blue-400' :
                    feature.icon === 'Zap' ? 'text-purple-600 dark:text-purple-400' :
                    feature.icon === 'Puzzle' ? 'text-indigo-600 dark:text-indigo-400' :
                    'text-green-600 dark:text-green-400'
                  } 
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      
      {/* Popular Courses Section with Search */}
      <section className="bg-white dark:bg-gray-900 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Popular Courses
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Start learning with our most highly-rated courses
              </p>
            </div>
            <Link
              to="/courses"
              className="inline-flex items-center mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-600 dark:hover:to-purple-600 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              View All Courses
              <IconArrowRight className="ml-2" />
            </Link>
          </div>

          {/* Search Bar */}
          <div className="mb-8 max-w-md">
            <div className="relative">
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search for a course, instructor, or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">Loading courses...</p>
              </div>
            ) : filteredPopularCourses.length > 0 ? (
              filteredPopularCourses.map((course) => (
                <div key={course._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg dark:hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-100 dark:from-purple-900/30 to-blue-100 dark:to-blue-900/30">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-4 right-4 px-3 py-1 bg-green-500 dark:bg-green-600 text-white text-sm font-medium rounded-full">
                      Free Course
                    </span>
                  </div>
                  <div className="p-6">
                    <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-full mb-3">
                      {course.category}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">{course.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Instructor: <span className="font-medium text-gray-800 dark:text-gray-200">
                        {typeof course.instructor === 'string' 
                          ? course.instructor 
                          : course.instructor?.name || 'Unknown'}
                      </span>
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
                      <div className="flex items-center gap-1">
                        <IconStar className="text-yellow-400" />
                        <span className="font-semibold text-gray-900 dark:text-white">{course.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <IconUsers className="text-gray-600 dark:text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">{(course.students || 0).toLocaleString()}</span>
                      </div>
                    </div>
                    <Link
                      to={`/courses/${course._id}`}
                      className="block w-full text-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-600 dark:hover:to-purple-600 transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">No courses found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Learning Paths Section */}
      <section className="bg-white dark:bg-gray-900 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Learning Paths</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Follow structured paths to master your skills</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {learningPaths.map((path, index) => {
              const pathCourses = getPathCourses(path.courses);
              return (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg dark:hover:shadow-xl transition-all duration-300">
                  <div className={`inline-block px-4 py-2 rounded-lg font-semibold mb-4 ${
                    path.level === 'Beginner' ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/40 dark:to-emerald-900/30 text-green-700 dark:text-green-400' :
                    path.level === 'Intermediate' ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/40 dark:to-indigo-900/30 text-blue-700 dark:text-blue-400' :
                    'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/40 dark:to-pink-900/30 text-purple-700 dark:text-purple-400'
                  }`}>
                    {path.level} Path
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{path.description}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{pathCourses.length} courses</p>
                  <div className="space-y-2">
                    {pathCourses.slice(0, 3).map((course) => (
                      <Link
                        key={course._id}
                        to={`/courses/${course._id}`}
                        className="block text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                      >
                        • {course.title}
                      </Link>
                    ))}
                    {pathCourses.length > 3 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">+{pathCourses.length - 3} more courses</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Instructor Highlights Section */}
      <section className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Meet Our Instructors
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Learn from industry experts with years of real-world experience
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredInstructors.map((instructor) => (
            <div
              key={instructor.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center"
            >
              <div className="mb-4">
                <img
                  src={instructor.photo}
                  alt={instructor.name}
                  className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-indigo-100 dark:border-indigo-900/50"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{instructor.name}</h3>
              <p className="text-indigo-600 dark:text-indigo-400 font-medium mb-2">{instructor.specialty}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                {instructor.yearsOfExperience} years of experience
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
                <span>{instructor.courses} Courses</span>
                <span>•</span>
                <span>{instructor.students.toLocaleString()} Students</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Carousel Section */}
      <section className="bg-white dark:bg-gray-900 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Students Say
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Real feedback from learners who transformed their careers
            </p>
          </div>
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 md:p-12">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <IconStar key={i} className="text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-200 mb-6 italic text-lg">
                "{testimonials[currentTestimonial].quote}"
              </p>
              <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <img
                  src={testimonials[currentTestimonial].avatar}
                  alt={testimonials[currentTestimonial].name}
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
                />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-lg">{testimonials[currentTestimonial].name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{testimonials[currentTestimonial].role}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                className="p-2 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
              >
                <IconChevronLeft />
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentTestimonial ? 'bg-indigo-600 dark:bg-indigo-400' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
                className="p-2 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
              >
                <IconChevronRight />
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* Call to Action / Join Section */}
      <section className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 dark:from-indigo-700 dark:via-purple-700 dark:to-indigo-800 rounded-2xl p-8 md:p-12 text-center text-white shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Level Up?
          </h2>
          <p className="text-xl text-white/90 dark:text-white/80 mb-8 max-w-2xl mx-auto">
            Join our community of learners today and start your journey towards mastery.
          </p>
          <Link
  to={
    isAuthenticated
      ? user?.role === "instructor"
        ? "/manage"
        : "/enrollments"
      : "/register"
  }
  className="inline-flex items-center px-8 py-4 bg-white/95 dark:bg-white text-indigo-600 dark:text-indigo-700 font-semibold rounded-xl hover:bg-white dark:hover:bg-gray-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
>
  {isAuthenticated ? "Go to Dashboard" : "Get Started"}
  <IconArrowRight className="ml-2" />
</Link>

        </div>
      </section>

      {/* Newsletter / Community Join Section */}
      <section className="bg-white dark:bg-gray-900 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 text-center shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{newsletterContent.title}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">{newsletterContent.text}</p>
            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex gap-3">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-400"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-600 dark:hover:to-purple-600 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
