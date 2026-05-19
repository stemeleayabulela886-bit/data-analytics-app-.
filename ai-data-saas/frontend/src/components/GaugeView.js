import React, { useContext } from "react";
import { DataContext } from "../context/DataContext";

function GaugeView() {
  const { activeTableData } = useContext(DataContext);
  const data = activeTableData || [];

  if (!data.length) return <p className="text-sm text-gray-500">Upload data to see a gauge metric.</p>;

  const columns = Object.keys(data[0]);
  const numericColumns = columns.filter((key) => data.some((row) => !isNaN(parseFloat(row[key])) && row[key] !== ""));
  const metricKey = numericColumns[0];

  if (!metricKey) return <p className="text-sm text-gray-500">No numeric metric available for gauge display.</p>;

  const values = data.map((row) => Number(row[metricKey]) || 0);
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  const maxValue = Math.max(...values, average, 1) * 1.4;
  const percent = Math.round(Math.min(100, (average / maxValue) * 100));
  const dashValue = `${percent} ${100 - percent}`;

  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">Gauge Metric</h3>
        <span className="text-xs text-gray-400">{metricKey}</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative w-36 h-36">
          <svg viewBox="0 0 120 120" className="w-full h-full">
            <circle cx="60" cy="60" r="45" fill="#eff6ff" />
            <circle
              cx="60"
              cy="60"
              r="45"
              fill="none"
              stroke="#dbeafe"
              strokeWidth="18"
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
            />
            <circle
              cx="60"
              cy="60"
              r="45"
              fill="none"
              stroke="#4f46e5"
              strokeWidth="18"
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
              strokeDasharray={dashValue}
              strokeDashoffset="0"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-xl font-bold text-slate-900">{percent}%</span>
            <span className="text-[10px] text-slate-500">Avg value</span>
          </div>
        </div>
        <div className="flex-1 text-sm text-gray-600">
          <p className="font-semibold text-gray-800">Average {metricKey}</p>
          <p className="mt-2 leading-6">The gauge uses the current numeric dataset to calculate a relative performance score for this metric.</p>
          <p className="mt-4 text-xs text-gray-400">Based on {data.length} rows.</p>
        </div>
      </div>
    </div>
  );
}

export default GaugeView;
