import React, { useState } from "react";
import API from "../api/api";

function AutoChart({ file }) {
  const [chart, setChart] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSuggestChart = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await API.post("/chart/", formData);
      setChart(res.data.chart);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
      <h2 className="text-xl font-semibold mb-4">Auto Chart Generator</h2>
      <button
        onClick={handleSuggestChart}
        disabled={loading}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
      >
        {loading ? "Suggesting..." : "Suggest Chart"}
      </button>
      {chart && (
        <div className="mt-4">
          <h3 className="font-semibold">Suggested Chart:</h3>
          <p>Type: {chart.type}</p>
          {chart.x && <p>X: {chart.x}</p>}
          {chart.y && <p>Y: {chart.y}</p>}
        </div>
      )}
    </div>
  );
}

export default AutoChart;