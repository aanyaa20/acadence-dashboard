import React, { useState, useRef, useEffect, useContext } from "react";
import Modal from "react-modal";
import { FiMessageCircle, FiSend, FiX } from "react-icons/fi";
import { FaRobot, FaBook, FaChartLine, FaLightbulb } from "react-icons/fa";
import axios from "axios";
import API_BASE_URL from "../config";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

Modal.setAppElement("#root");

export default function ChatbotFloating() {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! I'm your Acadence AI assistant. I can help you find courses, explain concepts, or recommend a learning path. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [userCourses, setUserCourses] = useState([]);
  const inputRef = useRef();
  const messagesEndRef = useRef();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch user's courses when chatbot opens
  useEffect(() => {
    if (open && user) {
      fetchUserCourses();
    }
  }, [open, user]);

  const fetchUserCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/api/courses/user`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const send = async () => {
    if (!input.trim()) return;
    const msg = input.trim();
    setMessages((m) => [...m, { role: "user", text: msg }]);
    setInput("");
    setIsTyping(true);

    try {
      // Build context with user's courses
      let contextData = {
        message: msg,
        userId: user?._id || null,
        userName: user?.name || "Student",
        userEmail: user?.email || null,
        courses: userCourses.map(course => ({
          title: course.title,
          topic: course.topic,
          difficulty: course.difficulty,
          progress: `${course.completedLessons}/${course.totalLessons}`,
          completionPercentage: course.totalLessons > 0 
            ? Math.round((course.completedLessons / course.totalLessons) * 100)
            : 0,
          estimatedDuration: course.estimatedDuration
        })),
        conversationHistory: messages.slice(-4).map(m => ({
          role: m.role,
          text: m.text
        }))
      };

      console.log("Sending to backend:", contextData);

      // Send to backend API which will call Gemini
      const response = await axios.post(`${API_BASE_URL}/api/chat`, contextData);

      console.log("Got response from backend:", response.data);

      setIsTyping(false);
      setMessages((m) => [...m, {
        role: "bot",
        text: response.data.reply
      }]);
    } catch (error) {
      console.error("❌ Chatbot error:", error);
      console.error("Error response:", error.response?.data);
      
      setIsTyping(false);
      
      let errorMessage = "I'm having trouble right now. Please try again in a moment!";
      
      if (error.response?.status === 500) {
        errorMessage = "Server error. The AI service might be temporarily unavailable.";
      } else if (error.response?.status === 400) {
        errorMessage = "Invalid request. Please try rephrasing your question.";
      } else if (error.code === 'ECONNREFUSED') {
        errorMessage = "Cannot connect to server. Please make sure the backend is running on port 5000.";
      } else if (!navigator.onLine) {
        errorMessage = "No internet connection. Please check your network.";
      }
      
      setMessages((m) => [...m, {
        role: "bot",
        text: errorMessage
      }]);
      toast.error("Failed to get AI response");
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed right-8 bottom-8 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 animate-pulse"
        style={{
          background: 'var(--gradient-primary)',
          color: 'var(--color-text-inverse)'
        }}
        title="Chat with Acadence AI"
      >
        <FiMessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Modal */}
      <Modal
        isOpen={open}
        onRequestClose={() => setOpen(false)}
        style={{
          overlay: { 
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 9999 
          },
          content: { 
            right: "24px", 
            bottom: "24px", 
            left: "auto", 
            top: "auto", 
            width: "420px", 
            maxHeight: "600px",
            borderRadius: "16px", 
            padding: 0,
            border: "none",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
          }
        }}
      >
        <div style={{ 
          backgroundColor: 'var(--color-bg-elevated)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          color: 'var(--color-text-primary)'
        }}>
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{
            background: 'var(--gradient-primary)',
            borderColor: 'var(--color-border-light)',
            color: 'var(--color-text-inverse)'
          }}>
            <div className="flex items-center gap-3">
              <FaRobot className="w-7 h-7" />
              <div>
                <div className="font-bold text-lg">Acadence AI</div>
                <div className="text-xs opacity-90">Your Learning Assistant</div>
              </div>
            </div>
            <button 
              onClick={() => setOpen(false)} 
              className="p-2 rounded-lg transition-all hover:bg-white/20"
              style={{ color: 'var(--color-text-inverse)' }}
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-auto" style={{ 
            backgroundColor: 'var(--color-bg-secondary)',
            maxHeight: '400px'
          }}>
            {messages.map((m, i) => (
              <div key={i} className={`mb-4 ${m.role === "user" ? "text-right" : "text-left"}`}>
                <div className={`inline-block px-4 py-3 rounded-2xl max-w-[85%] shadow-md ${
                  m.role === "user" 
                    ? "rounded-tr-none" 
                    : "rounded-tl-none"
                }`} style={{
                  background: m.role === "user" 
                    ? 'var(--gradient-primary)' 
                    : 'var(--color-bg-elevated)',
                  color: m.role === "user" 
                    ? 'var(--color-text-inverse)' 
                    : 'var(--color-text-primary)',
                  borderColor: m.role === "user" 
                    ? 'transparent' 
                    : 'var(--color-border-light)',
                  border: m.role === "user" ? 'none' : '1px solid'
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="text-left mb-4">
                <div className="inline-block px-4 py-3 rounded-2xl rounded-tl-none" style={{
                  backgroundColor: 'var(--color-bg-elevated)',
                  color: 'var(--color-text-secondary)',
                  border: '1px solid',
                  borderColor: 'var(--color-border-light)'
                }}>
                  <span className="flex gap-1">
                    <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--color-primary)', animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--color-primary)', animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--color-primary)', animationDelay: '300ms' }}></span>
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions (show only if first message) */}
          {messages.length === 1 && (
            <div className="px-4 py-3 border-t border-b flex flex-wrap gap-2" style={{
              backgroundColor: 'var(--color-bg-elevated)',
              borderColor: 'var(--color-border-light)'
            }}>
              <button
                onClick={() => setInput("What courses do you recommend for beginners?")}
                className="text-xs px-3 py-2 rounded-lg transition-all hover:opacity-90 flex items-center gap-1"
                style={{
                  backgroundColor: 'var(--color-bg-tertiary)',
                  color: 'var(--color-text-secondary)',
                  border: '1px solid',
                  borderColor: 'var(--color-border-light)'
                }}
              >
                <FaBook /> Course recommendations
              </button>
              <button
                onClick={() => setInput("How can I track my progress?")}
                className="text-xs px-3 py-2 rounded-lg transition-all hover:opacity-90 flex items-center gap-1"
                style={{
                  backgroundColor: 'var(--color-bg-tertiary)',
                  color: 'var(--color-text-secondary)',
                  border: '1px solid',
                  borderColor: 'var(--color-border-light)'
                }}
              >
                <FaChartLine /> Track progress
              </button>
              <button
                onClick={() => setInput("Give me study tips")}
                className="text-xs px-3 py-2 rounded-lg transition-all hover:opacity-90 flex items-center gap-1"
                style={{
                  backgroundColor: 'var(--color-bg-tertiary)',
                  color: 'var(--color-text-secondary)',
                  border: '1px solid',
                  borderColor: 'var(--color-border-light)'
                }}
              >
                <FaLightbulb /> Study tips
              </button>
            </div>
          )}

          {/* Input */}
          <div className="px-4 py-3 border-t" style={{
            backgroundColor: 'var(--color-bg-elevated)',
            borderColor: 'var(--color-border-light)'
          }}>
            <div className="flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") send(); }}
                className="flex-1 rounded-lg px-4 py-3 outline-none transition-all"
                placeholder="Ask me anything..."
                style={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  color: 'var(--color-text-primary)',
                  border: '2px solid',
                  borderColor: 'var(--color-border-light)'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-border-light)'}
              />
              <button 
                onClick={send}
                className="px-5 rounded-lg transition-all hover:opacity-90 font-medium shadow-md"
                style={{
                  background: 'var(--gradient-primary)',
                  color: 'var(--color-text-inverse)'
                }}
              >
                <FiSend className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs mt-2 text-center" style={{ color: 'var(--color-text-muted)' }}>
              Powered by Acadence AI
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}
