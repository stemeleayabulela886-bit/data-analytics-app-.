import React, { useState } from "react";
import API from "../api/api";

const AIChatbox = ({ onGenerateDashboard }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hello! Upload a dataset, then tell me what metrics or dashboards you want to generate." }
  ]);

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message to log
    const newMessages = [...messages, { role: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    // Call backend AI generate endpoint
    (async () => {
      try {
        const res = await API.post('/ai/generate', { prompt: input });
        const data = res.data || {};

        setMessages(prev => [...prev, { role: "assistant", text: data.message || "I've prepared suggestions." }]);

        // If backend returned visuals/kpis, send to the dashboard handler
        if (data.visuals || data.kpis) {
          onGenerateDashboard(data);
        } else {
          // Fallback to local heuristics
          onGenerateDashboard(input);
        }
      } catch (err) {
        console.error(err);
        setMessages(prev => [...prev, { role: "assistant", text: "Sorry — couldn't reach the AI service." }]);
        onGenerateDashboard(input);
      }
    })();
  };

  return (
    <div className="w-80 bg-white border border-gray-100 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden h-[500px]">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
        <div className="flex items-center gap-2">
          <span className="text-lg">✨</span>
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-indigo-100">AI Assistant</h4>
            <h3 className="text-sm font-bold">Natural Language Visualizer</h3>
          </div>
        </div>
      </div>

      {/* Message Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50 text-xs">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl shadow-sm ${
              msg.role === "user" 
                ? "bg-indigo-600 text-white rounded-br-none" 
                : "bg-white text-gray-700 border border-gray-100 rounded-bl-none"
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Tray */}
      <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="e.g., Generate a bar chart for sales..."
          className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 text-xs outline-none focus:border-indigo-500 transition-all"
        />
        <button 
          onClick={handleSend}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-xl text-xs font-bold transition-all"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AIChatbox;
