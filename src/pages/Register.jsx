import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Validate name
  const validateName = (nameValue) => {
    if (!nameValue || nameValue.trim().length === 0) {
      setNameError("Name is required");
      return false;
    }
    if (nameValue.trim().length < 2) {
      setNameError("Name must be at least 2 characters long");
      return false;
    }
    setNameError("");
    return true;
  };

  // Validate email format
  const validateEmail = (emailValue) => {
    if (!emailValue) {
      setEmailError("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  // Validate password
  const validatePassword = (passwordValue) => {
    if (!passwordValue) {
      setPasswordError("Password is required");
      return false;
    }
    if (passwordValue.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return false;
    }
    if (passwordValue.length > 128) {
      setPasswordError("Password must be less than 128 characters");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    
    // Real-time validation
    if (name === 'name') {
      if (value.trim().length > 0) validateName(value);
    } else if (name === 'email') {
      if (value.trim().length > 0) validateEmail(value);
    } else if (name === 'password') {
      if (value.length > 0) validatePassword(value);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setLoading(true);

    // Validate all fields
    const isNameValid = validateName(form.name);
    const isEmailValid = validateEmail(form.email);
    const isPasswordValid = validatePassword(form.password);

    if (!isNameValid || !isEmailValid || !isPasswordValid) {
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
    <section className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8 border">
        {/* Logo + Header */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4431/4431898.png"
            alt="LearnHub Logo"
            className="w-10 h-10 object-contain rounded-lg"
          />
          <h1 className="text-2xl font-bold text-gray-900">LearnHub</h1>
        </div>

        <p className="text-gray-600 text-sm text-center mb-6">
          Create an account to start your learning journey.
        </p>

        {/* Success Message */}
        {success && (
          <div className="mb-4 text-sm text-green-600 bg-green-50 border border-green-200 rounded-xl p-3">
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              className={`w-full rounded-xl border bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/20 ${
                nameError ? 'border-red-500' : 'border-gray-200'
              }`}
              name="name"
              placeholder="Jane Doe"
              value={form.name}
              onChange={onChange}
              onBlur={() => validateName(form.name)}
              required
            />
            {nameError && (
              <p className="text-xs text-red-600 mt-1">{nameError}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              className={`w-full rounded-xl border bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/20 ${
                emailError ? 'border-red-500' : 'border-gray-200'
              }`}
              name="email"
              type="email"
              placeholder="jane@example.com"
              value={form.email}
              onChange={onChange}
              onBlur={() => validateEmail(form.email)}
              required
            />
            {emailError && (
              <p className="text-xs text-red-600 mt-1">{emailError}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              className={`w-full rounded-xl border bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/20 ${
                passwordError ? 'border-red-500' : 'border-gray-200'
              }`}
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={onChange}
              onBlur={() => validatePassword(form.password)}
              required
            />
            {passwordError && (
              <p className="text-xs text-red-600 mt-1">{passwordError}</p>
            )}
            {!passwordError && form.password.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 6 characters long
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/20"
              name="role"
              value={form.role}
              onChange={onChange}
              required
            >
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Select your role: Student to enroll in courses, Instructor to create and manage courses.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-black text-white py-2.5 hover:bg-black/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-black font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </section>
  );
}
