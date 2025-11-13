import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import heroImg from "../assets/hero1.png";
import logo from "../assets/logo.png"; // your app logo
import { FaFacebook, FaTwitter, FaLinkedin, FaHeart, FaGithub, FaEnvelope, FaRocket, FaBook, FaBrain, FaStar, FaSearch, FaBullseye, FaWhatsapp, FaBug, FaArrowUp, FaCheckCircle, FaQuestionCircle, FaGraduationCap, FaChartLine, FaTrophy, FaUsers, FaLightbulb, FaAward, FaClock, FaBookOpen, FaChartBar, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [typedText, setTypedText] = useState("");
  const fullText = "Learn Smarter, Not Harder.";
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Toggle FAQ
  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Typing effect with continuous loop
  useEffect(() => {
    if (typedText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText(fullText.slice(0, typedText.length + 1));
      }, 50); // Faster speed: 50ms per character
      return () => clearTimeout(timeout);
    } else {
      setIsTypingComplete(true);
      // Wait 2 seconds then restart typing
      const restartTimeout = setTimeout(() => {
        setTypedText("");
        setIsTypingComplete(false);
      }, 2000);
      return () => clearTimeout(restartTimeout);
    }
  }, [typedText, fullText]);

  // Smooth scroll function
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
              {typedText.length > 0 && (
                <>
                  <span style={{
                    background: 'var(--gradient-primary)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    {typedText.slice(0, 14)}
                  </span>
                  {typedText.length > 14 && (
                    <>
                      {" "}
                      <br />
                      <span style={{
                        background: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      }}>
                        {typedText.slice(14)}
                      </span>
                    </>
                  )}
                </>
              )}
              {!isTypingComplete && (
                <span className="animate-pulse" style={{ color: 'var(--color-primary)' }}>|</span>
              )}
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
                <FaUsers style={{ color: 'var(--color-warning)' }} />
                <span style={{ color: 'var(--color-text-secondary)' }}>10k+ Students</span>
              </div>
              <div className="flex items-center gap-2">
                <FaGraduationCap style={{ color: 'var(--color-primary)' }} />
                <span style={{ color: 'var(--color-text-secondary)' }}>500+ Courses</span>
              </div>
              <div className="flex items-center gap-2">
                <FaLightbulb style={{ color: 'var(--color-secondary)' }} />
                <span style={{ color: 'var(--color-text-secondary)' }}>AI-Powered Learning</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-20 scroll-mt-20" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
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

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 scroll-mt-20" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-4 text-center" style={{
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            How It Works
          </h2>
          <p className="mb-16 max-w-2xl mx-auto text-center text-lg" style={{ color: 'var(--color-text-secondary)' }}>
            Get started with Acadence in just 4 simple steps
          </p>
          
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Step 1 */}
              <div className="flex gap-6 p-6 rounded-2xl border hover:shadow-xl transition-all duration-300" style={{
                backgroundColor: 'var(--color-bg-elevated)',
                borderColor: 'var(--color-primary)'
              }}>
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold" style={{
                    background: 'var(--gradient-primary)',
                    color: 'var(--color-text-inverse)'
                  }}>
                    1
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
                    <FaBullseye style={{ color: 'var(--color-primary)' }} />
                    Choose Your Course
                  </h3>
                  <p className="leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                    Browse our AI-powered course catalog or let our recommendation engine suggest the perfect course based on your goals and skill level.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-6 p-6 rounded-2xl border hover:shadow-xl transition-all duration-300" style={{
                backgroundColor: 'var(--color-bg-elevated)',
                borderColor: 'var(--color-accent)'
              }}>
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold" style={{
                    background: 'var(--gradient-vibrant)',
                    color: 'var(--color-text-inverse)'
                  }}>
                    2
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
                    <FaBookOpen style={{ color: 'var(--color-accent)' }} />
                    Learn at Your Pace
                  </h3>
                  <p className="leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                    Access lessons anytime, anywhere. Our adaptive learning system adjusts to your schedule and learning speed.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-6 p-6 rounded-2xl border hover:shadow-xl transition-all duration-300" style={{
                backgroundColor: 'var(--color-bg-elevated)',
                borderColor: 'var(--color-secondary)'
              }}>
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold" style={{
                    background: 'linear-gradient(135deg, var(--color-secondary), var(--color-accent))',
                    color: 'var(--color-text-inverse)'
                  }}>
                    3
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
                    <FaTrophy style={{ color: 'var(--color-secondary)' }} />
                    Earn Rewards
                  </h3>
                  <p className="leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                    Gain points for completing lessons, maintain daily streaks, and unlock achievements as you progress through your learning journey.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-6 p-6 rounded-2xl border hover:shadow-xl transition-all duration-300" style={{
                backgroundColor: 'var(--color-bg-elevated)',
                borderColor: 'var(--color-accent)'
              }}>
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold" style={{
                    background: 'linear-gradient(135deg, var(--color-accent), var(--color-primary))',
                    color: 'var(--color-text-inverse)'
                  }}>
                    4
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
                    <FaChartLine style={{ color: 'var(--color-accent)' }} />
                    Track Progress
                  </h3>
                  <p className="leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                    Monitor your learning journey with detailed analytics, see your improvement over time, and celebrate your achievements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 scroll-mt-20" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
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
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold flex-shrink-0" style={{
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

      {/* FAQ Section */}
      <section id="faq" className="py-20 scroll-mt-20" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-4 text-center" style={{
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Frequently Asked Questions
          </h2>
          <p className="mb-12 max-w-2xl mx-auto text-center text-lg" style={{ color: 'var(--color-text-secondary)' }}>
            Everything you need to know about Acadence
          </p>

          <div className="max-w-4xl mx-auto space-y-4">
            {/* FAQ 1 */}
            <div 
              className="rounded-xl border transition-all duration-300 cursor-pointer" 
              style={{
                backgroundColor: 'var(--color-bg-elevated)',
                borderColor: openFaqIndex === 0 ? 'var(--color-primary)' : 'var(--color-border-light)'
              }}
            >
              <div 
                className="p-6 flex items-center justify-between"
                onClick={() => toggleFaq(0)}
              >
                <div className="flex items-center gap-4 flex-1">
                  <FaQuestionCircle className="text-2xl flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
                  <h3 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                    How does AI course generation work?
                  </h3>
                </div>
                {openFaqIndex === 0 ? (
                  <FaChevronUp className="text-xl flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
                ) : (
                  <FaChevronDown className="text-xl flex-shrink-0" style={{ color: 'var(--color-text-secondary)' }} />
                )}
              </div>
              {openFaqIndex === 0 && (
                <div className="px-6 pb-6 pl-20">
                  <p className="leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                    Our AI analyzes your learning goals, skill level, and interests to generate personalized courses with comprehensive lessons, quizzes, and learning materials. Each course is tailored to help you achieve your specific objectives efficiently.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 2 */}
            <div 
              className="rounded-xl border transition-all duration-300 cursor-pointer" 
              style={{
                backgroundColor: 'var(--color-bg-elevated)',
                borderColor: openFaqIndex === 1 ? 'var(--color-primary)' : 'var(--color-border-light)'
              }}
            >
              <div 
                className="p-6 flex items-center justify-between"
                onClick={() => toggleFaq(1)}
              >
                <div className="flex items-center gap-4 flex-1">
                  <FaQuestionCircle className="text-2xl flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
                  <h3 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                    Can I learn at my own pace?
                  </h3>
                </div>
                {openFaqIndex === 1 ? (
                  <FaChevronUp className="text-xl flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
                ) : (
                  <FaChevronDown className="text-xl flex-shrink-0" style={{ color: 'var(--color-text-secondary)' }} />
                )}
              </div>
              {openFaqIndex === 1 && (
                <div className="px-6 pb-6 pl-20">
                  <p className="leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                    Absolutely! Acadence is designed for flexible, self-paced learning. Access your courses anytime, anywhere, and progress through lessons at a speed that works for you. There are no deadlines or pressure—just pure learning.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 3 */}
            <div 
              className="rounded-xl border transition-all duration-300 cursor-pointer" 
              style={{
                backgroundColor: 'var(--color-bg-elevated)',
                borderColor: openFaqIndex === 2 ? 'var(--color-primary)' : 'var(--color-border-light)'
              }}
            >
              <div 
                className="p-6 flex items-center justify-between"
                onClick={() => toggleFaq(2)}
              >
                <div className="flex items-center gap-4 flex-1">
                  <FaQuestionCircle className="text-2xl flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
                  <h3 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                    How does the points and streak system work?
                  </h3>
                </div>
                {openFaqIndex === 2 ? (
                  <FaChevronUp className="text-xl flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
                ) : (
                  <FaChevronDown className="text-xl flex-shrink-0" style={{ color: 'var(--color-text-secondary)' }} />
                )}
              </div>
              {openFaqIndex === 2 && (
                <div className="px-6 pb-6 pl-20">
                  <p className="leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                    You earn 5 points for each lesson completed and 20 points for finishing quizzes. Maintain daily learning streaks by completing at least one lesson per day. Your streak counter motivates you to stay consistent, and you can track your longest streak ever!
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 4 */}
            <div 
              className="rounded-xl border transition-all duration-300 cursor-pointer" 
              style={{
                backgroundColor: 'var(--color-bg-elevated)',
                borderColor: openFaqIndex === 3 ? 'var(--color-primary)' : 'var(--color-border-light)'
              }}
            >
              <div 
                className="p-6 flex items-center justify-between"
                onClick={() => toggleFaq(3)}
              >
                <div className="flex items-center gap-4 flex-1">
                  <FaQuestionCircle className="text-2xl flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
                  <h3 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                    Is Acadence suitable for beginners?
                  </h3>
                </div>
                {openFaqIndex === 3 ? (
                  <FaChevronUp className="text-xl flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
                ) : (
                  <FaChevronDown className="text-xl flex-shrink-0" style={{ color: 'var(--color-text-secondary)' }} />
                )}
              </div>
              {openFaqIndex === 3 && (
                <div className="px-6 pb-6 pl-20">
                  <p className="leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                    Yes! We offer courses for all skill levels—beginner, intermediate, and advanced. Our AI ensures the content matches your current knowledge level and gradually increases in complexity as you progress. Start learning from scratch or jump into advanced topics.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 5 */}
            <div 
              className="rounded-xl border transition-all duration-300 cursor-pointer" 
              style={{
                backgroundColor: 'var(--color-bg-elevated)',
                borderColor: openFaqIndex === 4 ? 'var(--color-primary)' : 'var(--color-border-light)'
              }}
            >
              <div 
                className="p-6 flex items-center justify-between"
                onClick={() => toggleFaq(4)}
              >
                <div className="flex items-center gap-4 flex-1">
                  <FaQuestionCircle className="text-2xl flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
                  <h3 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                    What makes Acadence different from other platforms?
                  </h3>
                </div>
                {openFaqIndex === 4 ? (
                  <FaChevronUp className="text-xl flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
                ) : (
                  <FaChevronDown className="text-xl flex-shrink-0" style={{ color: 'var(--color-text-secondary)' }} />
                )}
              </div>
              {openFaqIndex === 4 && (
                <div className="px-6 pb-6 pl-20">
                  <p className="leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                    Acadence combines AI-powered personalization, gamification, real-time progress tracking, and an intelligent chatbot assistant. We focus on making learning engaging, effective, and tailored to your unique needs. Plus, our AI generates comprehensive courses on any topic you want to learn!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Still have questions CTA */}
          <div className="mt-12 text-center">
            <p className="text-lg mb-6" style={{ color: 'var(--color-text-secondary)' }}>
              Still have questions?
            </p>
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=aanyasinghal32@gmail.com&su=Inquiry%20about%20Acadence&body=Hi%20Acadence%20Team,%0A%0AI%20have%20a%20question%20about:%0A%0A"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition-all duration-200"
              style={{
                background: 'var(--gradient-primary)',
                color: 'var(--color-text-inverse)'
              }}
              title="Contact us via Gmail"
            >
              <FaEnvelope className="text-xl" />
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t mt-16 scroll-mt-20" style={{
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
              href="https://wa.me/9837985368?text=Hi%20Acadence%20Team!%20👋%0A%0AI%20would%20like%20to%20report%20an%20issue%20or%20share%20feedback:%0A%0A📝%20*Issue/Bug%20Description:*%0A[Please%20describe%20the%20issue]%0A%0A🔄%20*Steps%20to%20reproduce:*%0A1.%20%0A2.%20%0A3.%20%0A%0A✅%20*Expected%20behavior:*%0A[What%20should%20happen]%0A%0A❌%20*Actual%20behavior:*%0A[What%20actually%20happens]%0A%0A💡%20*Additional%20context:*%0A[Browser,%20device,%20screenshots,%20etc.]%0A%0AThank%20you!"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 hover:scale-105 shadow-md"
              style={{
                background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                color: 'white'
              }}
              title="Report a bug or issue via WhatsApp"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(37, 211, 102, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
              }}
            >
              <FaWhatsapp className="text-lg" />
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

        html {
          scroll-behavior: smooth;
        }
      `}</style>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-4 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 z-50 animate-bounce"
          style={{
            background: 'var(--gradient-primary)',
            color: 'var(--color-text-inverse)'
          }}
          title="Scroll to top"
          aria-label="Scroll to top"
        >
          <FaArrowUp className="text-xl" />
        </button>
      )}
    </div>
  );
}
