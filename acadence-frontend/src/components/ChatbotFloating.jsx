import React, { useState, useRef } from "react";
import Modal from "react-modal";
import { FiMessageCircle, FiSend, FiX } from "react-icons/fi";

Modal.setAppElement("#root");

export default function ChatbotFloating() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: "bot", text: "Hi! I can help find courses, explain concepts, or recommend a path." }]);
  const [input, setInput] = useState("");
  const inputRef = useRef();

  const send = async () => {
    if (!input.trim()) return;
    const msg = input.trim();
    setMessages((m) => [...m, { role: "user", text: msg }]);
    setInput("");
    // placeholder reply — replace with your AI backend call
    setTimeout(() => {
      setMessages((m) => [...m, { role: "bot", text: "Nice question — here's a short answer. (Integrate your NLP backend to replace this.)" }]);
    }, 700);
  };

  return (
    <>
 <button
  onClick={() => setOpen(true)}
  className="fixed right-8 bottom-8 z-50 bg-white text-indigo-600 p-4 rounded-full shadow-xl hover:bg-gray-200"
  title="Open chatbot"
>
  <FiMessageCircle className="w-6 h-6" />
</button>


      <Modal
        isOpen={open}
        onRequestClose={() => setOpen(false)}
        style={{
          overlay: { backgroundColor: "rgba(0,0,0,0.35)" },
          content: { right: "24px", bottom: "80px", left: "auto", top: "auto", width: "360px", borderRadius: "12px", padding: 0, background: "#0f1724", color: "white" }
        }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/6">
          <div className="flex items-center gap-3">
            <FiMessageCircle className="w-6 h-6 text-indigo-300" />
            <div>
              <div className="font-semibold">Acadence Assistant</div>
              <div className="text-xs text-white/60">AI chat & guidance</div>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="text-white/60"><FiX /></button>
        </div>

        <div className="p-3 h-72 overflow-auto">
          {messages.map((m, i) => (
            <div key={i} className={`mb-3 ${m.role === "user" ? "text-right" : "text-left"}`}>
              <div className={`inline-block px-3 py-2 rounded-lg ${m.role === "user" ? "bg-indigo-600 text-white" : "bg-white/6 text-white"}`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <div className="px-3 py-2 border-t border-white/6 flex gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") send(); }}
            className="flex-1 rounded-md px-3 py-2 bg-white/5 text-white outline-none"
            placeholder="Ask about courses, topics, or get a learning path..."
          />
          <button onClick={send} className="bg-indigo-500 px-4 rounded text-white"><FiSend /></button>
        </div>
      </Modal>
    </>
  );
}
