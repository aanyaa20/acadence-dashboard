import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import heroImg from "../assets/hero1.png";
import logo from "../assets/logo.png"; // your app logo
import { FaFacebook, FaTwitter, FaLinkedin, FaHeart, FaGithub, FaEnvelope, FaRocket, FaBook, FaBrain, FaStar, FaSearch, FaBullseye } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)' }}>
      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center pt-32"
        style={{
          backgroundImage: `url(${heroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center 1%", // Shifted further downwards
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to right, var(--color-bg-primary) 0%, rgba(26, 29, 41, 0.85) 50%, rgba(26, 29, 41, 0.4) 100%)'
        }}></div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-snug animate-fade-in-up" style={{ color: 'var(--color-text-primary)' }}>
              Acadence <br/>
              <span style={{
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Learn Smarter,
              </span>{" "}
              <br />
              <span style={{
                background: 'var(--gradient-vibrant)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Not Harder.
              </span>
            </h1>
            <p className="text-lg md:text-xl leading-relaxed animate-fade-in-up delay-100" style={{ color: 'var(--color-text-secondary)' }}>
              Guiding every step of your journey — helping you grow, your way.
            </p>

            {/* Search bar */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 animate-fade-in-up delay-200">
              
              
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap gap-4 animate-fade-in-up delay-300">
              <button
                onClick={() => navigate("/dashboard")}
                className="px-8 py-4 rounded-xl font-bold shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                style={{
                  background: 'var(--gradient-primary)',
                  color: 'var(--color-text-inverse)'
                }}
              >
                <FaRocket />
                {user ? "Go to Dashboard" : "Get Started"}
              </button>
              <button
                onClick={() => navigate("/dashboard/allcourses")}
                className="px-8 py-4 backdrop-blur-sm rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2 border"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'var(--color-border-medium)',
                  color: 'var(--color-text-primary)'
                }}
              >
                <FaBook />
                Browse Courses
              </button>
            </div>

            {/* Stats */}
            <div className="mt-12 flex flex-wrap gap-6 text-sm animate-fade-in-up delay-400">
              <div className="flex items-center gap-2">
                <FaStar style={{ color: 'var(--color-warning)' }} />
                <span style={{ color: 'var(--color-text-secondary)' }}>10k+ Students</span>
              </div>
              <div className="flex items-center gap-2">
                <FaBook style={{ color: 'var(--color-primary)' }} />
                <span style={{ color: 'var(--color-text-secondary)' }}>500+ Courses</span>
              </div>
              <div className="flex items-center gap-2">
                <FaBrain style={{ color: 'var(--color-secondary)' }} />
                <span style={{ color: 'var(--color-text-secondary)' }}>AI-Powered Learning</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-4 text-center" style={{
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Why Choose Acadence?
          </h2>
          <p className="mb-12 max-w-2xl mx-auto text-center" style={{ color: 'var(--color-text-secondary)' }}>
            We don't just offer courses — we create personalized learning journeys.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border" style={{
              background: 'var(--gradient-soft)',
              borderColor: 'var(--color-primary)'
            }}>
              <FaRocket className="text-5xl mb-4" style={{ color: 'var(--color-primary)' }} />
              <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>AI-Powered Courses</h3>
              <p className="leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                Get course recommendations tailored just for you, powered by advanced AI.
              </p>
            </div>
            <div className="p-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border" style={{
              background: 'var(--gradient-soft)',
              borderColor: 'var(--color-accent)'
            }}>
              <FaBrain className="text-5xl mb-4" style={{ color: 'var(--color-accent)' }} />
              <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>Smart Progress Tracking</h3>
              <p className="leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                Real-time analytics and insights into your learning journey. See your growth!
              </p>
            </div>
            <div className="p-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border" style={{
              background: 'var(--gradient-soft)',
              borderColor: 'var(--color-secondary)'
            }}>
              <FaStar className="text-5xl mb-4" style={{ color: 'var(--color-secondary)' }} />
              <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>Gamified Learning</h3>
              <p className="leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                Earn points, complete challenges, and unlock achievements as you learn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-4 text-center" style={{
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            What Our Learners Say
          </h2>
          <p className="mb-12 max-w-2xl mx-auto text-center" style={{ color: 'var(--color-text-secondary)' }}>
            Real stories from real students who achieved their goals with Acadence.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border" style={{
              backgroundColor: 'var(--color-bg-elevated)',
              borderColor: 'var(--color-border-light)'
            }}>
              <div className="flex justify-center mb-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} style={{ color: 'var(--color-warning)' }} />
                  ))}
                </div>
              </div>
              <p className="mb-6 italic leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                "The courses are really well-structured and easy to follow. I loved the hands-on projects which made learning practical and fun!"
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold" style={{
                  background: 'var(--gradient-primary)',
                  color: 'var(--color-text-inverse)'
                }}>
                  RS
                </div>
                <div className="text-left">
                  <h4 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>Riya Sharma</h4>
                  <p className="text-sm" style={{ color: 'var(--color-primary)' }}>Web Development Student</p>
                </div>
              </div>
            </div>
            <div className="p-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border" style={{
              backgroundColor: 'var(--color-bg-elevated)',
              borderColor: 'var(--color-border-light)'
            }}>
              <div className="flex justify-center mb-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} style={{ color: 'var(--color-warning)' }} />
                  ))}
                </div>
              </div>
              <p className="mb-6 italic leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                "The AI chatbot is amazing! It instantly answered my questions and cleared all my doubts. Best learning experience ever!"
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold" style={{
                  background: 'var(--gradient-vibrant)',
                  color: 'var(--color-text-inverse)'
                }}>
                  AV
                </div>
                <div className="text-left">
                  <h4 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>Amit Verma</h4>
                  <p className="text-sm" style={{ color: 'var(--color-accent)' }}>Data Science Student</p>
                </div>
              </div>
            </div>
            <div className="p-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border" style={{
              backgroundColor: 'var(--color-bg-elevated)',
              borderColor: 'var(--color-border-light)'
            }}>
              <div className="flex justify-center mb-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} style={{ color: 'var(--color-warning)' }} />
                  ))}
                </div>
              </div>
              <p className="mb-6 italic leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                "The progress tracking system helped me stay consistent and motivated. I completed my course ahead of schedule!"
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold" style={{
                  background: 'linear-gradient(to bottom right, var(--color-accent), var(--color-secondary))',
                  color: 'var(--color-text-inverse)'
                }}>
                  PN
                </div>
                <div className="text-left">
                  <h4 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>Priya Nair</h4>
                  <p className="text-sm" style={{ color: 'var(--color-secondary)' }}>Python Beginner</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-16" style={{
        backgroundColor: 'var(--color-bg-tertiary)',
        color: 'var(--color-text-secondary)',
        borderColor: 'var(--color-border-light)'
      }}>
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Logo + tagline */}
          <div className="flex items-center gap-3">
            <img src={logo} alt="Acadence Logo" className="h-10 w-10" />
            <div>
              <h2 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>Acadence</h2>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Empowering learners with knowledge & growth 
              </p>
            </div>
          </div>

          {/* Middle: Made with ❤️ */}
          <div className="text-sm flex items-center gap-2">
            <span>Made with</span>
            <FaHeart className="animate-pulse" style={{ color: 'var(--color-danger)' }} />
            <span>by Team Acadence</span>
          </div>

          {/* Right: Socials + Bug Button */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg transition"
              style={{ color: 'var(--color-text-secondary)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <FaGithub className="text-xl" />
            </a>
            <a
              href="mailto:support@acadence.com"
              className="p-2 rounded-lg transition"
              style={{ color: 'var(--color-text-secondary)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <FaEnvelope className="text-xl" />
            </a>
            <a
              href="#"
              className="ml-2 px-4 py-2 rounded-lg text-sm font-medium transition"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-text-inverse)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              Report Bug
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t py-4 text-center text-xs" style={{
          borderColor: 'var(--color-border-light)',
          color: 'var(--color-text-muted)'
        }}>
          © {new Date().getFullYear()} Acadence. All rights reserved.
        </div>
      </footer>

      {/* Add custom animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }

        .delay-100 {
          animation-delay: 0.1s;
          animation-fill-mode: both;
        }

        .delay-200 {
          animation-delay: 0.2s;
          animation-fill-mode: both;
        }

        .delay-300 {
          animation-delay: 0.3s;
          animation-fill-mode: both;
        }

        .delay-400 {
          animation-delay: 0.4s;
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  );
}
