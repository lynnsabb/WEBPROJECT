import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../state/auth.jsx";

// Icon components
function IconPlus(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function IconEdit(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function IconTrash(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

function IconX(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
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

function IconStar(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}>
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

function IconCheck(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// ---------- helpers: map between curriculum <-> modules ----------

// our internal lesson shape
const createEmptyLesson = () => ({
  id: Date.now() + Math.random(),
  title: "",
  videoUrl: "",
  duration: "",
  description: "",
});

// our internal module shape
const createEmptyModule = () => ({
  id: Date.now() + Math.random(),
  title: "",
  description: "",
  lessons: [createEmptyLesson()],
});

// curriculum (sections) -> modules (for the form)
const mapCurriculumToModules = (curriculum = []) =>
  curriculum.map((section) => ({
    id: section.id ?? Date.now() + Math.random(),
    title: section.title || "",
    description: section.description || "",
    lessons: (section.topics || []).map((topic) => ({
      id: topic.id ?? Date.now() + Math.random(),
      title: topic.title || "",
      duration: topic.duration || "",
      videoUrl: topic.videoUrl || "",
      // description in the form is content from mock
      description: topic.content || "",
    })),
  }));

// modules (from form) -> curriculum (for the course object)
const mapModulesToCurriculum = (modules = []) =>
  modules.map((module, mIndex) => ({
    id: module.id ?? mIndex + 1,
    title: module.title,
    description: module.description,
    topics: (module.lessons || []).map((lesson, lIndex) => ({
      id: lesson.id ?? lIndex + 1,
      title: lesson.title,
      duration: lesson.duration,
      videoUrl: lesson.videoUrl,
      content: lesson.description, // back to mock's "content"
    })),
  }));

// ---------- component ----------

export default function ManageCourse() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Check if user is instructor
  useEffect(() => {
    if (user && user.role !== "instructor") {
      setError("Access denied: This page is only available to instructors.");
      setLoading(false);
    }
  }, [user]);

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError("");
        
        const token = localStorage.getItem("ctm_token");
        if (!token) {
          setError("Please log in to manage courses");
          setLoading(false);
          return;
        }

        // Fetch all courses, then filter to only instructor's courses
        const response = await axios.get("http://localhost:5000/api/courses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Filter to only courses created by this instructor
        const instructorCourses = response.data.filter(
          (course) => course.createdBy && String(course.createdBy._id || course.createdBy) === String(user?._id)
        );

        setCourses(instructorCourses);
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

    if (user && user.role === "instructor") {
      fetchCourses();
    }
  }, [user]);

  // form state (uses "modules", not "curriculum")
  const [formData, setFormData] = useState({
    title: "",
    category: "Programming",
    level: "Beginner",
    description: "",
    duration: "",
    image: "",
    modules: [],
  });

  // unique categories
  const categories = useMemo(() => {
    const cats = ["All", ...new Set(courses.map((c) => c.category))];
    return cats;
  }, [courses]);

  // search + filter
  const filteredCourses = useMemo(() => {
    let filtered = [...courses];

    if (selectedCategory !== "All") {
      filtered = filtered.filter((c) => c.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.title?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q) ||
          (typeof c.instructor === "string" ? c.instructor.toLowerCase() : c.instructor?.name?.toLowerCase() || "").includes(q) ||
          c.category?.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [courses, selectedCategory, searchQuery]);

  // toast
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // reset form
  const resetForm = () => {
    setFormData({
      title: "",
      category: "Programming",
      level: "Beginner",
      description: "",
      duration: "",
      image: "",
      modules: [],
    });
    setEditingCourse(null);
  };

  const handleAddCourse = () => {
    resetForm();
    setIsModalOpen(true);
  };

  // THIS is the important "link": map curriculum -> modules
  const handleEditCourse = (course) => {
    const modulesFromCurriculum = mapCurriculumToModules(course.curriculum);

    setFormData({
      title: course.title || "",
      category: course.category || "Programming",
      level: course.level || "Beginner",
      description: course.description || "",
      duration: course.duration || "",
      image: course.image || "",
      modules: modulesFromCurriculum,
    });

    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ------- modules & lessons handlers -------

  const handleAddModuleClick = () => {
    setFormData((prev) => ({
      ...prev,
      modules: [...prev.modules, createEmptyModule()],
    }));
  };

  const handleRemoveModule = (moduleIndex) => {
    setFormData((prev) => ({
      ...prev,
      modules: prev.modules.filter((_, i) => i !== moduleIndex),
    }));
  };

  const handleModuleFieldChange = (moduleIndex, field, value) => {
    setFormData((prev) => {
      const modules = [...prev.modules];
      modules[moduleIndex] = { ...modules[moduleIndex], [field]: value };
      return { ...prev, modules };
    });
  };

  const handleAddLesson = (moduleIndex) => {
    setFormData((prev) => {
      const modules = [...prev.modules];
      const mod = modules[moduleIndex];
      modules[moduleIndex] = {
        ...mod,
        lessons: [...mod.lessons, createEmptyLesson()],
      };
      return { ...prev, modules };
    });
  };

  const handleRemoveLesson = (moduleIndex, lessonIndex) => {
    setFormData((prev) => {
      const modules = [...prev.modules];
      const mod = modules[moduleIndex];
      modules[moduleIndex] = {
        ...mod,
        lessons: mod.lessons.filter((_, i) => i !== lessonIndex),
      };
      return { ...prev, modules };
    });
  };

  const handleLessonFieldChange = (
    moduleIndex,
    lessonIndex,
    field,
    value
  ) => {
    setFormData((prev) => {
      const modules = [...prev.modules];
      const mod = modules[moduleIndex];
      const lessons = [...mod.lessons];
      lessons[lessonIndex] = { ...lessons[lessonIndex], [field]: value };
      modules[moduleIndex] = { ...mod, lessons };
      return { ...prev, modules };
    });
  };

  // submit: map modules -> curriculum before saving
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem("ctm_token");
      if (!token) {
        showToast("❌ Please log in to save courses", "error");
        setSubmitting(false);
        return;
      }

      // Custom validation - only check top-level required fields
      if (!formData.title?.trim()) {
        showToast("❌ Course title is required", "error");
        setSubmitting(false);
        return;
      }
      if (!formData.description?.trim()) {
        showToast("❌ Description is required", "error");
        setSubmitting(false);
        return;
      }
      if (!formData.duration?.trim()) {
        showToast("❌ Duration is required", "error");
        setSubmitting(false);
        return;
      }
      if (!formData.image?.trim()) {
        showToast("❌ Image URL is required", "error");
        setSubmitting(false);
        return;
      }

      // Validate that at least one module is required
      if (!formData.modules || formData.modules.length === 0) {
        showToast("❌ At least one module is required", "error");
        setSubmitting(false);
        return;
      }

      // Validate all modules and lessons - all fields are required
      for (let mIndex = 0; mIndex < formData.modules.length; mIndex++) {
        const module = formData.modules[mIndex];
        
        if (!module.title?.trim()) {
          showToast(`❌ Module ${mIndex + 1} title is required`, "error");
          setSubmitting(false);
          return;
        }
        
        // Validate that each module has at least one lesson
        if (!module.lessons || module.lessons.length === 0) {
          showToast(`❌ Module ${mIndex + 1} must have at least one lesson`, "error");
          setSubmitting(false);
          return;
        }
        
        // Validate all lessons in the module
        for (let lIndex = 0; lIndex < module.lessons.length; lIndex++) {
          const lesson = module.lessons[lIndex];
          
          if (!lesson.title?.trim()) {
            showToast(`❌ Lesson ${lIndex + 1} in Module ${mIndex + 1} title is required`, "error");
            setSubmitting(false);
            return;
          }
          if (!lesson.videoUrl?.trim()) {
            showToast(`❌ Lesson ${lIndex + 1} in Module ${mIndex + 1} video URL is required`, "error");
            setSubmitting(false);
            return;
          }
        }
      }

      // Auto-format duration: add "h" if it's just a number
      let formattedDuration = formData.duration.trim();
      if (formattedDuration && /^\d+$/.test(formattedDuration)) {
        // If it's just numbers, add "h"
        formattedDuration = formattedDuration + "h";
      }

      const curriculum = mapModulesToCurriculum(formData.modules);
      const courseData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        level: formData.level,
        duration: formattedDuration,
        // Don't send rating or students - these are managed automatically by the backend
        // rating: 0 (new courses start with 0)
        // students: 0 (new courses start with 0, increments on enrollment)
        image: formData.image,
        curriculum: curriculum,
        learningPoints: [], // Can be added later if needed
      };

      if (editingCourse) {
        // Update existing course
        const response = await axios.put(
          `http://localhost:5000/api/courses/${editingCourse._id}`,
          courseData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCourses((prev) =>
          prev.map((c) => (c._id === editingCourse._id ? response.data : c))
        );
        showToast("✅ Course updated successfully", "success");
      } else {
        // Create new course
        const response = await axios.post(
          "http://localhost:5000/api/courses",
          courseData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCourses((prev) => [response.data, ...prev]);
        showToast("✅ Course added successfully", "success");
      }

      handleCloseModal();
    } catch (err) {
      if (err.response && err.response.data) {
        showToast(`❌ ${err.response.data.message || "Failed to save course"}`, "error");
      } else if (err.request) {
        showToast("❌ Unable to connect to server", "error");
      } else {
        showToast("❌ An unexpected error occurred", "error");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (course) => {
    setCourseToDelete(course);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!courseToDelete) {
      setIsDeleteModalOpen(false);
      setCourseToDelete(null);
      return;
    }

    try {
      const token = localStorage.getItem("ctm_token");
      if (!token) {
        showToast("❌ Please log in to delete courses", "error");
        setIsDeleteModalOpen(false);
        setCourseToDelete(null);
        return;
      }

      await axios.delete(
        `http://localhost:5000/api/courses/${courseToDelete._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCourses((prev) => prev.filter((c) => c._id !== courseToDelete._id));
      showToast("✅ Course deleted successfully", "success");
    } catch (err) {
      if (err.response && err.response.data) {
        showToast(`❌ ${err.response.data.message || "Failed to delete course"}`, "error");
      } else if (err.request) {
        showToast("❌ Unable to connect to server", "error");
      } else {
        showToast("❌ An unexpected error occurred", "error");
      }
    } finally {
      setIsDeleteModalOpen(false);
      setCourseToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setCourseToDelete(null);
  };

  // ---------- JSX ----------

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Manage Courses
              </h1>
              <p className="text-gray-600 text-lg">
                Add, edit, and organize your courses easily.
              </p>
            </div>
            <button
              onClick={handleAddCourse}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <IconPlus />
              Add New Course
            </button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses by title, instructor, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              />
            </div>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${selectedCategory === category
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </header>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <div className="text-5xl mb-3">⏳</div>
            <p className="text-gray-500 text-lg">Loading courses...</p>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="text-center py-16 bg-white rounded-xl border border-red-200">
            <div className="text-5xl mb-3">⚠️</div>
            <p className="text-red-600 text-lg mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center rounded-xl bg-black text-white px-4 py-2 hover:bg-black/90"
            >
              Retry
            </button>
          </div>
        )}

        {/* Courses grid */}
        {!loading && !error && filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100">
                  <img
                    src={
                      course.image ||
                      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop"
                    }
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                        {course.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                          {course.category}
                        </span>
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                          {course.level}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 mb-2">
                    Instructor:{" "}
                    <span className="font-medium text-gray-800">
                      {typeof course.instructor === "string"
                        ? course.instructor
                        : course.instructor?.name || "Unknown"}
                    </span>
                  </p>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-600 border-t border-gray-200 pt-4 mb-4">
                    <span className="text-gray-600">{course.duration}</span>
                    <span className="text-gray-600">
                      {course.students?.toLocaleString() || 0} students
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditCourse(course)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 font-medium rounded-lg hover:bg-indigo-100 transition-colors"
                    >
                      <IconEdit />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(course)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <IconTrash />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : !loading && !error ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500 text-lg mb-2">No courses found</p>
            <p className="text-gray-400 text-sm">
              {selectedCategory !== "All" || searchQuery.trim()
                ? "Try adjusting your filters or search query."
                : "Start by adding your first course!"}
            </p>
          </div>
        ) : null}

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4"
            onClick={handleCloseModal}
          >
            <div
              className="bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingCourse ? "Edit Course" : "Add New Course"}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <IconX />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {submitting && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
                    {editingCourse ? "Updating course..." : "Creating course..."}
                  </div>
                )}
                {/* basic fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Advanced React Patterns"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="Programming">Programming</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Design">Design</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="Language">Language</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Level *
                    </label>
                    <select
                      name="level"
                      value={formData.level}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration *
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="e.g., 20 hours"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL *
                  </label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Describe what students will learn in this course..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                {/* Modules & Lessons */}
                <div className="border border-gray-200 rounded-lg p-4 space-y-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Modules & Lessons *
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        All fields marked with * are required. At least one module with one lesson is required.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddModuleClick}
                      className="inline-flex items-center gap-2 px-3 py-1 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      <IconPlus />
                      Add Module
                    </button>
                  </div>


                  <div className="space-y-4">
                    {formData.modules.map((module, mIndex) => (
                      <div
                        key={module.id}
                        className="bg-white border border-gray-200 rounded-lg p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-semibold text-gray-800">
                            Module {mIndex + 1}
                          </h4>
                          <button
                            type="button"
                            onClick={() => handleRemoveModule(mIndex)}
                            className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
                          >
                            <IconTrash />
                            Remove Module
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Module Title *
                            </label>
                            <input
                              type="text"
                              value={module.title}
                              onChange={(e) =>
                                handleModuleFieldChange(
                                  mIndex,
                                  "title",
                                  e.target.value
                                )
                              }
                              placeholder="e.g., Getting Started"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Module Description
                            </label>
                            <input
                              type="text"
                              value={module.description}
                              onChange={(e) =>
                                handleModuleFieldChange(
                                  mIndex,
                                  "description",
                                  e.target.value
                                )
                              }
                              placeholder="Optional short description"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                        </div>

                        <div className="mt-3 space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-sm font-medium text-gray-800">
                                Lessons *
                              </span>
                              <p className="text-xs text-gray-600 mt-0.5">
                                At least one lesson required per module
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleAddLesson(mIndex)}
                              className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700"
                            >
                              <IconPlus />
                              Add Lesson
                            </button>
                          </div>
                          
                          {module.lessons.length === 0 && (
                            <div className="bg-blue-50 border border-blue-200 rounded-md p-2">
                              <p className="text-xs text-blue-800">
                                <span className="font-medium">Note:</span> This module must have at least one lesson. Click &quot;Add Lesson&quot; to add one.
                              </p>
                            </div>
                          )}

                          {module.lessons.map((lesson, lIndex) => (
                            <div
                              key={lesson.id}
                              className="border border-dashed border-gray-300 rounded-md p-3 space-y-2 bg-gray-50"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-gray-700">
                                  Lesson {lIndex + 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveLesson(mIndex, lIndex)
                                  }
                                  className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
                                >
                                  <IconTrash />
                                  Remove
                                </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Lesson Title *
                                  </label>
                                  <input
                                    type="text"
                                    value={lesson.title}
                                    onChange={(e) =>
                                      handleLessonFieldChange(
                                        mIndex,
                                        lIndex,
                                        "title",
                                        e.target.value
                                      )
                                    }
                                    placeholder="e.g., What is Python?"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Video URL *
                                  </label>
                                  <input
                                    type="url"
                                    value={lesson.videoUrl}
                                    onChange={(e) =>
                                      handleLessonFieldChange(
                                        mIndex,
                                        lIndex,
                                        "videoUrl",
                                        e.target.value
                                      )
                                    }
                                    placeholder="https://..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Duration
                                  </label>
                                  <input
                                    type="text"
                                    value={lesson.duration}
                                    onChange={(e) =>
                                      handleLessonFieldChange(
                                        mIndex,
                                        lIndex,
                                        "duration",
                                        e.target.value
                                      )
                                    }
                                    placeholder="e.g., 12m"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Lesson Description
                                  </label>
                                  <input
                                    type="text"
                                    value={lesson.description}
                                    onChange={(e) =>
                                      handleLessonFieldChange(
                                        mIndex,
                                        lIndex,
                                        "description",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Brief description of this lesson"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    {editingCourse ? "Update Course" : "Add Course"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {isDeleteModalOpen && courseToDelete && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4"
            onClick={handleCancelDelete}
          >
            <div
              className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Delete Course
              </h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete{" "}
                <strong>"{courseToDelete.title}"</strong>? This action cannot
                be undone.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={handleCancelDelete}
                  className="px-6 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div
            className={`fixed bottom-4 right-4 flex items-center gap-2 px-6 py-4 bg-white border-2 rounded-xl shadow-lg z-50 ${toast.type === "success" ? "border-green-500" : "border-red-500"
              }`}
          >
            <IconCheck className="text-green-500" />
            <span className="text-gray-900 font-medium">{toast.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
