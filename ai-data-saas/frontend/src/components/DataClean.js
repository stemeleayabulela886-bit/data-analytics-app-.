import React, { useState } from "react";
import API from "../api/api";

function DataClean({ file }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleClean = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await API.post("/clean/", formData);
      setReport(res.data.report);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
      <h2 className="text-xl font-semibold mb-4">Data Cleaning</h2>
      <button
        onClick={handleClean}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
      >
        {loading ? "Cleaning..." : "Clean Data"}
      </button>
      {report && (
        <div className="mt-4">
          <h3 className="font-semibold">Cleaning Report:</h3>
          <pre className="text-sm bg-gray-100 p-2 rounded">{JSON.stringify(report, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default DataClean;