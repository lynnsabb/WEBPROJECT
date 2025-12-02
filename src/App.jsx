//farah
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Protected from "./components/Protected.jsx";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import Enrollments from "./pages/Enrollments";
import ManageCourse from "./pages/ManageCourse";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import ChangePassword from "./pages/ChangePassword";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import LessonViewer from "./pages/LessonViewer";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  const location = useLocation();

  // Hide Navbar and Footer on lesson viewer page
  const isLessonPage = location.pathname.includes("/learn/");
  const isHomePage = location.pathname === "/";

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {!isLessonPage && <Navbar isHome={isHomePage} />}

      <main className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetails />} />

          {/* Lesson Viewer - Full Screen */}
          <Route
            path="/courses/:id/learn/:lessonId"
            element={
              <Protected role="student">
                <LessonViewer />
              </Protected>
            }
          />

          <Route
            path="/enrollments"
            element={
              <Protected role="student">
                <Enrollments />
              </Protected>
            }
          />
          <Route
            path="/profile"
            element={
              <Protected>
                <Profile />
              </Protected>
            }
          />
          <Route
            path="/profile/edit"
            element={
              <Protected>
                <EditProfile />
              </Protected>
            }
          />
          <Route
            path="/profile/change-password"
            element={
              <Protected>
                <ChangePassword />
              </Protected>
            }
          />
          <Route
            path="/manage"
            element={
              <Protected role="instructor">
                <ManageCourse />
              </Protected>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </main>

      {!isLessonPage && <Footer />}
    </div>
  );
}
