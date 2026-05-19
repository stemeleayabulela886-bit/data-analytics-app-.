import React, { useContext } from "react";
import { DataContext } from "../context/DataContext";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#2563eb", "#7c3aed", "#10b981", "#f59e0b", "#ef4444", "#0ea5e9"];

function PieChartView() {
  const { activeTableData } = useContext(DataContext);
  const data = activeTableData || [];

  if (!data.length) return <p className="text-sm text-gray-500">Upload data to render a pie chart.</p>;

  const columns = Object.keys(data[0]);
  const numericKeys = columns.filter((key) => data.some((row) => !isNaN(parseFloat(row[key])) && row[key] !== ""));
  const categoryKey = columns.find((key) => key.toLowerCase().includes("region") || key.toLowerCase().includes("category") || key.toLowerCase().includes("type")) || columns.find((key) => typeof data[0][key] === "string");
  const valueKey = numericKeys[0];

  if (!categoryKey || !valueKey) return <p className="text-sm text-gray-500">Need a category and numeric column for a pie chart.</p>;

  const aggregated = data.reduce((acc, row) => {
    const category = row[categoryKey] || "Other";
    const value = Number(row[valueKey]) || 0;
    acc[category] = (acc[category] || 0) + value;
    return acc;
  }, {});

  const chartData = Object.entries(aggregated).map(([name, value]) => ({ name, value }));

  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Pie Chart</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} fill="#2563eb" label />
          <Tooltip />
          <Legend />
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </PieChart>
      </ResponsiveContainer>
      <p className="mt-3 text-xs text-gray-400">Category: {categoryKey} · Value: {valueKey}</p>
    </div>
  );
}

export default PieChartView;
