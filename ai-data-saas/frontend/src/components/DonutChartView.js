import React, { useContext } from "react";
import { DataContext } from "../context/DataContext";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#f97316", "#14b8a6", "#6366f1", "#f43f5e", "#22c55e", "#0ea5e9"];

function DonutChartView() {
  const { activeTableData } = useContext(DataContext);
  const data = activeTableData || [];

  if (!data.length) return <p className="text-sm text-gray-500">Upload data to render a donut chart.</p>;

  const columns = Object.keys(data[0]);
  const numericKeys = columns.filter((key) => data.some((row) => !isNaN(parseFloat(row[key])) && row[key] !== ""));
  const categoryKey = columns.find((key) => key.toLowerCase().includes("region") || key.toLowerCase().includes("category") || key.toLowerCase().includes("type")) || columns.find((key) => typeof data[0][key] === "string");
  const valueKey = numericKeys[0];

  if (!categoryKey || !valueKey) return <p className="text-sm text-gray-500">Need a category and numeric column for a donut chart.</p>;

  const aggregated = data.reduce((acc, row) => {
    const category = row[categoryKey] || "Other";
    const value = Number(row[valueKey]) || 0;
    acc[category] = (acc[category] || 0) + value;
    return acc;
  }, {});

  const chartData = Object.entries(aggregated).map(([name, value]) => ({ name, value }));

  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Donut Chart</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <p className="mt-3 text-xs text-gray-400">Category: {categoryKey} · Value: {valueKey}</p>
    </div>
  );
}

export default DonutChartView;
