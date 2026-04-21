import React, { useContext, useState } from "react";
import API from "../api/api";
import { DataContext } from "../context/DataContext";

function ActionPanel() {
  const { file, setKpis, setChart, setCleanReport } = useContext(DataContext);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  if (!file) return null;

  const handleClean = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await API.post("/clean/", formData);
      setCleanReport(res.data.report);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleKPI = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await API.post("/kpi/", formData);
      setKpis(res.data.kpis);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChart = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await API.post("/chart/", formData);
      setChart(res.data.chart);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAI = async () => {
    if (!question) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await API.post(`/action/?question=${encodeURIComponent(question)}`, formData);

      if (res.data.action === "kpi") setKpis(res.data.result);
      if (res.data.action === "clean") setCleanReport(res.data.result);
      if (res.data.action === "predict") setChart({ data: res.data.result });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg mt-6">
      <h2 className="text-xl font-semibold mb-4">⚡ Data Actions</h2>

      <div className="flex flex-wrap gap-3 mb-4">
        <button
          onClick={handleClean}
          disabled={loading}
          className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded-lg shadow-md hover:scale-105 transition disabled:opacity-50"
        >
          {loading ? "Processing..." : "🧹 Clean Data"}
        </button>
        <button
          onClick={handleKPI}
          disabled={loading}
          className="bg-gradient-to-r from-green-500 to-green-700 text-white px-4 py-2 rounded-lg shadow-md hover:scale-105 transition disabled:opacity-50"
        >
          📊 Generate KPIs
        </button>
        <button
          onClick={handleChart}
          disabled={loading}
          className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-4 py-2 rounded-lg shadow-md hover:scale-105 transition disabled:opacity-50"
        >
          📈 Auto Chart
        </button>
      </div>

      <div className="mb-4">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask AI to clean, predict, or analyze..."
          className="w-full p-3 border rounded-lg mb-3"
        />

        <button
          onClick={handleAI}
          disabled={loading || !question}
          className="bg-gradient-to-r from-orange-500 to-orange-700 text-white px-4 py-2 rounded-lg shadow-md hover:scale-105 transition disabled:opacity-50"
        >
          🤖 Run AI Action
        </button>
      </div>
    </div>
  );
}

export default ActionPanel;
