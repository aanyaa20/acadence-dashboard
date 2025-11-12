import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser(form.email, form.password);
      toast.success("Login successful!", { duration: 3000 });
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed", {
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-24" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
      <form
        onSubmit={handleSubmit}
        className="p-8 rounded-xl w-full max-w-md shadow-custom-xl border"
        style={{
          backgroundColor: 'var(--color-bg-elevated)',
          borderColor: 'var(--color-border-light)'
        }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: 'var(--color-text-primary)' }}>
          Welcome Back 👋
        </h2>
        <p className="text-center mb-6" style={{ color: 'var(--color-text-secondary)' }}>
          Login to continue your learning journey
        </p>
        
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
            Email Address
          </label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            className="w-full p-3 rounded-lg border outline-none transition-all"
            style={{
              backgroundColor: 'var(--color-bg-primary)',
              borderColor: 'var(--color-border-medium)',
              color: 'var(--color-text-primary)'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--color-border-medium)'}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            className="w-full p-3 rounded-lg border outline-none transition-all"
            style={{
              backgroundColor: 'var(--color-bg-primary)',
              borderColor: 'var(--color-border-medium)',
              color: 'var(--color-text-primary)'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--color-border-medium)'}
            onChange={handleChange}
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg font-medium transition-all shadow-custom-sm"
          style={{
            backgroundColor: loading ? 'var(--color-text-muted)' : 'var(--color-primary)',
            color: 'var(--color-text-inverse)'
          }}
          onMouseEnter={(e) => {
            if (!loading) e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
          }}
          onMouseLeave={(e) => {
            if (!loading) e.currentTarget.style.backgroundColor = 'var(--color-primary)';
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Forgot Password Link */}
        <div className="text-center mt-4">
          <Link
            to="/forgot-password"
            className="text-sm transition-colors"
            style={{ color: 'var(--color-text-secondary)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}
          >
            Forgot your password?
          </Link>
        </div>
        
        <p className="mt-6 text-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Don't have an account?{" "}
          <a href="/signup" className="font-medium" style={{ color: 'var(--color-primary)' }}>
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}
