import React, { useContext } from "react";
import { DataContext } from "../context/DataContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

function ChartView() {
  const { chart, predictiveMultiplier, activeTableData } = useContext(DataContext);
  const fallbackData = activeTableData || [];

  const getBarConfig = (data) => {
    if (!data.length) return {};
    const columns = Object.keys(data[0]);
    const numericKey = columns.find((key) => data.some((row) => !isNaN(parseFloat(row[key])) && row[key] !== ""));
    const categoryKey = columns.find((key) => key.toLowerCase().includes("date")) || columns.find((key) => typeof data[0][key] === "string");
    return { x: categoryKey, y: numericKey };
  };

  const config = chart && chart.x && chart.y ? chart : getBarConfig(fallbackData);
  const chartRows = chart && chart.data ? chart.data : fallbackData;

  if (!config.x || !config.y || !chartRows.length) return null;

  const simulatedData = chartRows.map((row) => {
    const value = Number(row[config.y]);
    return { ...row, [config.y]: Number.isNaN(value) ? row[config.y] : value * predictiveMultiplier };
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow mt-6">
      <h3 className="text-lg font-semibold mb-4">📈 Chart Visualization</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={simulatedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={config.x} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={config.y} fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
      <p className="mt-3 text-xs text-gray-400">Using {config.x} for categories and {config.y} for metric.</p>
    </div>
  );
}

export default ChartView;
