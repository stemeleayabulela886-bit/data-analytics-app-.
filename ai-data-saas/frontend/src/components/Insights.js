import React, { useState } from "react";
import API from "../api/api";

function Insights({ file }) {
  const [insights, setInsights] = useState("");
  const [loading, setLoading] = useState(false);

  const getInsights = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await API.post("/insights/", formData);
      setInsights(res.data.insights);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg mb-6" style={{ opacity: loading ? 0.3 : 1 }}>
      <h2 className="text-xl font-semibold mb-4">AI Insights</h2>

      <button
        onClick={getInsights}
        disabled={loading}
        className="bg-purple-600 text-white px-4 py-2 rounded-lg mb-3 disabled:opacity-50"
      >
        {loading ? "Analyzing..." : "Generate Insights"}
      </button>

      {loading && (
        <div className="mb-3">
          <div className="spinner animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-center mt-2">AI is analyzing your data...</p>
        </div>
      )}

      <p>{insights}</p>
    </div>
  );
}

export default Insights;
