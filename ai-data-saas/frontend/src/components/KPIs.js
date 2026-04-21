import React, { useState } from "react";
import API from "../api/api";

function KPIs({ file }) {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateKPIs = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await API.post("/kpi/", formData);
      setKpis(res.data.kpis);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
      <h2 className="text-xl font-semibold mb-4">SMART KPIs</h2>
      <button
        onClick={handleGenerateKPIs}
        disabled={loading}
        className="bg-purple-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate KPIs"}
      </button>
      {kpis && (
        <div className="mt-4">
          <h3 className="font-semibold">KPIs:</h3>
          <ul className="list-disc list-inside">
            {Object.entries(kpis).map(([key, value]) => (
              <li key={key}>{key}: {value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default KPIs;