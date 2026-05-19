import React, { useContext } from "react";
import { DataContext } from "../context/DataContext";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

function AreaChartView() {
  const { activeTableData } = useContext(DataContext);
  const data = activeTableData || [];

  if (!data.length) return <p className="text-sm text-gray-500">Upload data to render an area chart.</p>;

  const columns = Object.keys(data[0]);
  const numericColumns = columns.filter((key) => data.some((row) => !isNaN(parseFloat(row[key])) && row[key] !== ""));
  const categoricalColumns = columns.filter((key) => data.some((row) => typeof row[key] === "string"));
  const xKey = categoricalColumns.find((key) => key.toLowerCase().includes("date")) || categoricalColumns[0] || columns[0];
  const yKey = numericColumns[0];

  if (!yKey) return <p className="text-sm text-gray-500">No numeric column found to plot an area chart.</p>;

  const chartData = data.map((row) => ({
    ...row,
    [yKey]: Number(row[yKey]),
  }));

  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Area Chart</h3>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey={yKey} fill="#4f46e5" stroke="#4338ca" fillOpacity={0.3} />
        </AreaChart>
      </ResponsiveContainer>
      <p className="mt-3 text-xs text-gray-400">X: {xKey} · Y: {yKey}</p>
    </div>
  );
}

export default AreaChartView;
