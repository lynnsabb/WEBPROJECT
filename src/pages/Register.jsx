// farah
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const validatePassword = (password) => {
    const errors = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };
    setPasswordErrors(errors);
    return Object.values(errors).every(Boolean);
  };

  const onChange = (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, [e.target.name]: value }));
    
    // Validate password in real-time
    if (e.target.name === "password") {
      validatePassword(value);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validate form fields
    if (!form.name || !form.email || !form.password || !form.role) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    // Validate password complexity
    if (!validatePassword(form.password)) {
      setError("Password does not meet complexity requirements. Please check the requirements below.");
      setLoading(false);
      return;
    }

    // Validate role
    if (!['student', 'instructor'].includes(form.role)) {
      setError("Please select a valid role");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        }
      );

      // Registration successful
      if (response.data.token) {
        // Store token in localStorage (optional, for auto-login)
        localStorage.setItem("ctm_token", response.data.token);
        
        // Store user data if provided
        if (response.data.user) {
          localStorage.setItem("ctms_user", JSON.stringify(response.data.user));
        }
      }

      setSuccess("Registration successful! Redirecting to login...");
      
      // Redirect to login after a short delay
      setTimeout(() => {
        nav("/login");
      }, 1500);
    } catch (err) {
      // Handle error response
      if (err.response && err.response.data) {
        // Backend returned an error message
        const errorMessage = err.response.data.message || 
                            err.response.data.error || 
                            "Registration failed. Please try again.";
        setError(errorMessage);
      } else if (err.request) {
        // Request was made but no response received
        setError("Unable to connect to server. Please check if the backend is running.");
      } else {
        // Something else happened
        setError("An unexpected error occurred. Please try again.");
      }
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[80vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 border border-gray-200 dark:border-gray-700">
        {/* Logo + Header */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4431/4431898.png"
            alt="LearnHub Logo"
            className="w-10 h-10 object-contain rounded-lg"
          />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">LearnHub</h1>
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm text-center mb-6">
          Create an account to start your learning journey.
        </p>

        {/* Success Message */}
        {success && (
          <div className="mb-4 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-3">
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">Full Name</label>
            <input
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 placeholder-gray-400 dark:placeholder-gray-500"
              name="name"
              placeholder="Jane Doe"
              value={form.name}
              onChange={onChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">Email</label>
            <input
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 placeholder-gray-400 dark:placeholder-gray-500"
              name="email"
              type="email"
              placeholder="jane@example.com"
              value={form.email}
              onChange={onChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">Password</label>
            <input
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 placeholder-gray-400 dark:placeholder-gray-500"
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={onChange}
              required
            />
            {form.password && (
              <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Password Requirements:</p>
                <div className="space-y-1 text-xs">
                  <div className={`flex items-center gap-2 ${passwordErrors.length ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    <span>{passwordErrors.length ? '✓' : '○'}</span>
                    <span>At least 8 characters</span>
                  </div>
                  <div className={`flex items-center gap-2 ${passwordErrors.uppercase ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    <span>{passwordErrors.uppercase ? '✓' : '○'}</span>
                    <span>One uppercase letter</span>
                  </div>
                  <div className={`flex items-center gap-2 ${passwordErrors.lowercase ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    <span>{passwordErrors.lowercase ? '✓' : '○'}</span>
                    <span>One lowercase letter</span>
                  </div>
                  <div className={`flex items-center gap-2 ${passwordErrors.number ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    <span>{passwordErrors.number ? '✓' : '○'}</span>
                    <span>One number</span>
                  </div>
                  <div className={`flex items-center gap-2 ${passwordErrors.special ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    <span>{passwordErrors.special ? '✓' : '○'}</span>
                    <span>One special character</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">Role</label>
            <select
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
              name="role"
              value={form.role}
              onChange={onChange}
              required
            >
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Select your role: Student to enroll in courses, Instructor to create and manage courses.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-black dark:bg-white dark:text-black text-white py-2.5 hover:bg-black/90 dark:hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-black dark:text-white font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </section>
  );
}
