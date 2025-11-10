import React, { useState } from "react";
import DashboardLayout from "./DashboardLayout";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi, how can I help you today?" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    const newMessages = [...messages, { from: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    // Simple bot response (mock AI)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "I’m still learning 🤖. But I’ll help you with what I can!",
        },
      ]);
    }, 800);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full p-8 text-white">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
            Chat Assistant 💬
          </h1>
          <p className="text-gray-300">Ask me anything about your courses, progress, or topics!</p>
        </header>

        {/* Chatbox */}
        <div className="flex-1 bg-slate-800/60 backdrop-blur-md border border-white/10 rounded-2xl shadow-md p-6 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.from === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl max-w-xs text-sm ${
                    msg.from === "user"
                      ? "bg-gradient-to-r from-indigo-500 to-blue-600 text-white"
                      : "bg-slate-700 text-gray-200"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="mt-4 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition text-sm font-medium"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
