import React, { useContext } from "react";
import { DataContext } from "../context/DataContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

function ChartView() {
  const { chart, predictiveMultiplier } = useContext(DataContext);

  if (!chart || !chart.x || !chart.y) return null;

  const simulatedData = (chart.data || []).map((row) => {
    const value = row[chart.y];
    if (typeof value === "number") {
      return { ...row, [chart.y]: value * predictiveMultiplier };
    }
    return row;
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow mt-6">
      <h3 className="text-lg font-semibold mb-4">📈 Chart Visualization</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={simulatedData}>
          <XAxis dataKey={chart.x} />
          <YAxis />
          <Tooltip />
          <Bar dataKey={chart.y} fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ChartView;
