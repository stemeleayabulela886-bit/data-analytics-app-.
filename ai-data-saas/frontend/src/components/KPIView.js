import React, { useContext, useState } from "react";
import { DataContext } from "../context/DataContext";

const KPICard = ({ title, baseValue, trend, multiplier }) => {
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  const displayValue = typeof baseValue === 'number' ? baseValue * multiplier : baseValue;

  const triggerRCA = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/analyze-root-cause', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ metric: title, value: displayValue, trend }),
      });
      const data = await response.json();
      setAnalysis(data.insight || "No insight returned.");
    } catch (error) {
      setAnalysis("Unable to analyze right now. Please try again later.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-xl border shadow-sm relative group">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-2xl font-bold mt-2">{typeof displayValue === 'number' ? displayValue.toFixed(2) : displayValue}</p>
      {multiplier !== 1 && typeof baseValue === 'number' && (
        <p className="text-xs text-gray-400 mt-1">Simulated: {Math.round((multiplier - 1) * 100)}%</p>
      )}
      <button
        onClick={triggerRCA}
        className="mt-3 text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
      >
        {loading ? "Analyzing..." : "🔍 Why did this change?"}
      </button>
      {analysis && (
        <div className="mt-3 p-2 bg-indigo-50 text-indigo-800 text-xs rounded-md animate-pulse">
          <strong>AI Insight:</strong> {analysis}
        </div>
      )}
    </div>
  );
};

function KPIView() {
  const { kpis, predictiveMultiplier } = useContext(DataContext);

  if (!kpis) return null;

  return (
    <div className="grid grid-cols-3 gap-4 mt-6">
      {Object.entries(kpis).map(([key, value]) => (
        <KPICard
          key={key}
          title={key}
          baseValue={value}
          trend={typeof value === 'number' ? (value > 0 ? 'up' : 'down') : 'stable'}
          multiplier={predictiveMultiplier}
        />
      ))}
    </div>
  );
}

export default KPIView;
