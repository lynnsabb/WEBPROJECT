import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

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
    if (passwordValue.trim().length === 0) {
      setPasswordError("Password cannot be empty");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErr("");
    setEmailError("");
    setPasswordError("");
    setLoading(true);

    // Validate form fields
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(pwd);

    if (!isEmailValid || !isPasswordValid) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password: pwd }
      );

      // Login successful
      if (res.data.token) {
        // Store token in localStorage
        localStorage.setItem("ctm_token", res.data.token);
      }

      // Store user data if provided
      if (res.data.user) {
        localStorage.setItem("ctms_user", JSON.stringify(res.data.user));
        
        // Trigger storage event to update auth context
        window.dispatchEvent(new Event("storage"));
      }

      // Redirect based on user role
      const user = res.data.user;
      if (user?.role === "student") {
        nav("/enrollments");
      } else if (user?.role === "instructor") {
        nav("/manage");
      } else {
        nav("/profile");
      }
    } catch (err) {
      // Handle error response
      if (err.response && err.response.data) {
        // Backend returned an error message
        const errorMessage = err.response.data.message || 
                            err.response.data.error || 
                            "Login failed. Please check your credentials.";
        setErr(errorMessage);
      } else if (err.request) {
        // Request was made but no response received
        setErr("Unable to connect to server. Please check if the backend is running.");
      } else {
        // Something else happened
        setErr("An unexpected error occurred. Please try again.");
      }
      setLoading(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid place-items-center">
        <div className="w-full max-w-lg rounded-2xl border bg-white shadow-sm p-6">
          {/* Logo and Title */}
          <div className="flex items-center gap-3 mb-4">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4431/4431898.png"
              alt="LearnHub Logo"
              className="w-10 h-10 object-contain rounded-lg"
            />
            <div className="text-xl font-semibold">LearnHub</div>
          </div>

          <h1 className="text-2xl font-bold mt-2">Welcome back</h1>
          <p className="text-gray-600 mt-1">
            Enter your credentials to access your account
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) validateEmail(e.target.value);
                }}
                onBlur={() => validateEmail(email)}
                className={`w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/20 ${
                  emailError ? 'border-red-500' : ''
                }`}
                placeholder="you@example.com"
              />
              {emailError && (
                <p className="text-xs text-red-600 mt-1">{emailError}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={pwd}
                onChange={(e) => {
                  setPwd(e.target.value);
                  if (passwordError) validatePassword(e.target.value);
                }}
                onBlur={() => validatePassword(pwd)}
                className={`w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/20 ${
                  passwordError ? 'border-red-500' : ''
                }`}
                placeholder="Enter your password"
              />
              {passwordError && (
                <p className="text-xs text-red-600 mt-1">{passwordError}</p>
              )}
            </div>

            {err && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-2">
                {err}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-black text-white py-2.5 hover:bg-black/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
