import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Signup() {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    
    if (form.name.trim().length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }
    
    if (!form.email.trim()) {
      toast.error("Email is required");
      return;
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Invalid email format. Example: user@gmail.com");
      return;
    }
    
    // Check for common email typos
    if (form.email.includes('.gmail@') || form.email.includes('.yahoo@')) {
      toast.error("Invalid email format. Did you mean @gmail.com or @yahoo.com?");
      return;
    }
    
    if (!form.password.trim()) {
      toast.error("Password is required");
      return;
    }
    
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    
    setLoading(true);
    try {
      const res = await signup(form.name, form.email, form.password);
      toast.success(res.message || "Signup successful!", { duration: 3000 });
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.message;
      
      // Detailed error messages
      if (errorMessage?.toLowerCase().includes('already exists') || errorMessage?.toLowerCase().includes('already registered')) {
        toast.error("Email already registered. Please login instead.");
      } else if (errorMessage?.toLowerCase().includes('invalid email')) {
        toast.error("Invalid email format. Please use a valid email address.");
      } else if (errorMessage?.toLowerCase().includes('password')) {
        toast.error(errorMessage || "Password requirements not met");
      } else {
        toast.error(errorMessage || "Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
      <form
        onSubmit={handleSubmit}
        className="p-8 rounded-xl w-full max-w-md shadow-custom-xl border"
        style={{
          backgroundColor: 'var(--color-bg-elevated)',
          borderColor: 'var(--color-border-light)'
        }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: 'var(--color-text-primary)' }}>
          Create Account
        </h2>
        <p className="text-center mb-6" style={{ color: 'var(--color-text-secondary)' }}>
          Join Acadence and start your learning journey
        </p>
        
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
            Full Name
          </label>
          <input
            name="name"
            placeholder="Enter your full name"
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
        
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
            Email Address
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email address"
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
            backgroundColor: loading ? 'var(--color-text-muted)' : 'var(--color-secondary)',
            color: 'var(--color-text-inverse)'
          }}
          onMouseEnter={(e) => {
            if (!loading) e.currentTarget.style.backgroundColor = 'var(--color-secondary-hover)';
          }}
          onMouseLeave={(e) => {
            if (!loading) e.currentTarget.style.backgroundColor = 'var(--color-secondary)';
          }}
        >
          {loading ? "Signing up..." : "Create Account"}
        </button>

        <p className="text-sm mt-6 text-center" style={{ color: 'var(--color-text-secondary)' }}>
          Already have an account?{" "}
          <Link to="/login" className="font-medium" style={{ color: 'var(--color-primary)' }}>
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
