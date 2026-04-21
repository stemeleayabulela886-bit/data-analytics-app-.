import React, { useState } from "react";
import API from "../api/api";

function ChatBox({ file }) {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("question", question);

    try {
      const res = await API.post("/action/", formData);
      if (res.data.action === "chat") {
        setResponse(res.data.message);
      } else {
        setResponse(`Action: ${res.data.action}\nResult: ${JSON.stringify(res.data.result)}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg" style={{ opacity: loading ? 0.3 : 1 }}>
      <h2 className="text-xl font-semibold mb-4">AI Chat</h2>

      <input
        type="text"
        placeholder="Ask about your data..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="w-full p-3 border rounded-lg mb-3"
      />

      <button
        onClick={askAI}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
      >
        {loading ? "Thinking..." : "Ask"}
      </button>

      {loading && (
        <div className="mt-3">
          <div className="spinner animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-center mt-2">AI is thinking...</p>
        </div>
      )}

      <p className="mt-3">{response}</p>
    </div>
  );
}

export default ChatBox;
