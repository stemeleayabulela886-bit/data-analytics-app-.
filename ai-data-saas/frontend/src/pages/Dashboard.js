import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const data = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 600 },
];

function Dashboard() {
  return (
    <div style={{ padding: 20 }}>
      <h1>📊 Dashboard</h1>

      {/* KPI Cards */}
      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ background: "#4CAF50", color: "white", padding: 20 }}>
          Revenue: R45,000
        </div>
        <div style={{ background: "#2196F3", color: "white", padding: 20 }}>
          Users: 120
        </div>
        <div style={{ background: "#FF9800", color: "white", padding: 20 }}>
          Growth: 15%
        </div>
      </div>

      {/* Chart */}
      <BarChart width={400} height={300} data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" />
      </BarChart>
    </div>
  );
}

export default Dashboard;
