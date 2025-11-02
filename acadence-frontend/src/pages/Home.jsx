import React from "react";
import { useNavigate } from "react-router-dom";
import heroImg from "../assets/hero1.png";
import logo from "../assets/logo.png"; // your app logo
import { FaFacebook, FaTwitter, FaLinkedin, FaHeart, FaGithub, FaEnvelope } from "react-icons/fa";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-900 text-white min-h-screen flex flex-col">
      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center pt-32"
        style={{
          backgroundImage: `url(${heroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/85 to-slate-900/40"></div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-snug">
            Acadence <br/><span className="text-indigo-400">Learn Smarter,</span>{" "}
              <br />
              <span className="text-indigo-400"> Not Harder.</span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl">
              Guiding every step of your journey — helping you grow, your way.
            </p>

            {/* Search bar */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                placeholder="Search for courses..."
                className="px-4 py-3 rounded-lg sm:rounded-l-lg sm:rounded-r-none w-full sm:w-2/3 max-w-md bg-white text-gray-900 focus:outline-none shadow-md"
              />
              <button className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 rounded-lg sm:rounded-l-none sm:rounded-r-lg font-semibold shadow-md">
                Search
              </button>
            </div>

            {/* CTA */}
            <div className="mt-6 flex">
              <button
                onClick={() => navigate("/dashboard")}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 rounded-lg font-bold shadow-lg"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-slate-900">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-10">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800 p-6 rounded-xl shadow-md">
              <h3 className="text-indigo-400 font-semibold text-lg mb-2">
                Expert Mentors
              </h3>
              <p className="text-gray-300">
                Learn from professionals with real-world experience.
              </p>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl shadow-md">
              <h3 className="text-indigo-400 font-semibold text-lg mb-2">
                Hands-on Learning
              </h3>
              <p className="text-gray-300">
                Practice with projects, not just theory.
              </p>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl shadow-md">
              <h3 className="text-indigo-400 font-semibold text-lg mb-2">
                Flexible Schedule
              </h3>
              <p className="text-gray-300">
                Learn at your own pace, anytime, anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-slate-900">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-10">What Our Learners Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800 p-6 rounded-xl shadow-md">
              <p className="text-gray-300 mb-4">
                "The courses are really well-structured and easy to follow. I
                loved the hands-on projects which made learning practical."
              </p>
              <h4 className="font-semibold">Riya Sharma</h4>
              <p className="text-indigo-400 text-sm">
                Student | Web Dev Course
              </p>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl shadow-md">
              <p className="text-gray-300 mb-4">
                "The chatbot is amazing! It instantly answered my questions and
                cleared doubts while I was stuck."
              </p>
              <h4 className="font-semibold">Amit Verma</h4>
              <p className="text-indigo-400 text-sm">
                Student | Data Science
              </p>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl shadow-md">
              <p className="text-gray-300 mb-4">
                "The progress tracking system helped me stay consistent. It
                motivated me to complete lessons on time."
              </p>
              <h4 className="font-semibold">Priya Nair</h4>
              <p className="text-indigo-400 text-sm">
                Student | Python Beginner
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer (inline context added here) */}
      <footer className="bg-slate-950 text-gray-400 border-t border-slate-800 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Logo + tagline */}
          <div className="flex items-center gap-3">
            <img src={logo} alt="Acadence Logo" className="h-10 w-10" />
            <div>
              <h2 className="text-lg font-bold text-white">Acadence</h2>
              <p className="text-sm text-gray-400">
                Empowering learners with knowledge & growth 
              </p>
            </div>
          </div>

          {/* Middle: Made with ❤️ */}
          <div className="text-sm flex items-center gap-2">
            <span>Made with</span>
            <FaHeart className="text-red-500 animate-pulse" />
            <span>by Team Acadence</span>
          </div>

          {/* Right: Socials + Bug Button */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-slate-800 transition"
            >
              <FaGithub className="text-xl" />
            </a>
            <a
              href="mailto:support@acadence.com"
              className="p-2 rounded-lg hover:bg-slate-800 transition"
            >
              <FaEnvelope className="text-xl" />
            </a>
            <a
              href="#"
              className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-500"
            >
              Report Bug
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 py-4 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Acadence. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
