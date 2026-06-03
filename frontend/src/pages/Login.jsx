// src/pages/Login.jsx
// Connects to real backend auth API — register + login with JWT.

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const Login = () => {
  const { login, register } = useApp();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm]       = useState({ name: "", email: "", password: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!isLogin && !form.name) {
      setError("Please enter your name.");
      return;
    }

    setLoading(true);
    try {
      const email = form.email.trim();
      const name = form.name.trim();
      if (isLogin) {
        await login(email, form.password);
      } else {
        await register(name, email, form.password);
      }
      navigate("/");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl border border-orange-100 overflow-hidden">
          {/* Top banner */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 px-8 py-8 text-white text-center">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <span className="text-3xl">🍽</span>
            </div>
            <h2 className="text-xl font-black">
              {isLogin ? "Welcome back!" : "Create account"}
            </h2>
            <p className="text-orange-100 text-sm mt-1">
              {isLogin ? "Sign in to continue ordering" : "Start your food journey"}
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            {/* Toggle */}
            <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
              <button
                onClick={() => { setIsLogin(true); setError(""); }}
                className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${isLogin ? "bg-white text-orange-500 shadow-sm" : "text-gray-500"}`}
              >
                Login
              </button>
              <button
                onClick={() => { setIsLogin(false); setError(""); }}
                className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${!isLogin ? "bg-white text-orange-500 shadow-sm" : "text-gray-500"}`}
              >
                Sign Up
              </button>
            </div>

            <div className="space-y-4" onKeyDown={handleKeyDown}>
              {!isLogin && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              {error && (
                <p className="text-red-500 text-xs font-semibold bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
                  ⚠️ {error}
                </p>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-3.5 rounded-2xl transition-colors shadow-md shadow-orange-200 mt-2 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    {isLogin ? "Signing in..." : "Creating account..."}
                  </>
                ) : (
                  isLogin ? "Sign In →" : "Create Account →"
                )}
              </button>
            </div>

            <p className="text-center text-xs text-gray-400 mt-5">
              🔒 Your data is safe with us. We never share it.
            </p>
          </div>
        </div>

        <div className="text-center mt-4">
          <Link to="/" className="text-sm text-gray-500 hover:text-orange-500 font-semibold transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
