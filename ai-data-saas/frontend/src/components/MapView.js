import React, { useContext } from "react";
import { DataContext } from "../context/DataContext";

function MapView() {
  const { activeTableData } = useContext(DataContext);
  const data = activeTableData || [];

  if (!data.length) return <p className="text-sm text-gray-500">Upload data to visualize regions.</p>;

  const columns = Object.keys(data[0]);
  const regionKey = columns.find((key) => key.toLowerCase().includes("region")) || columns.find((key) => key.toLowerCase().includes("country")) || columns.find((key) => key.toLowerCase().includes("city"));

  if (!regionKey) return <p className="text-sm text-gray-500">No geographic field found. Add a Region or Country column to display a map view.</p>;

  const regionCounts = data.reduce((acc, row) => {
    const region = row[regionKey] || "Unknown";
    acc[region] = (acc[region] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Map View</h3>
      <div className="rounded-3xl bg-slate-100 h-44 mb-4 flex items-center justify-center text-slate-400">
        <div className="text-center px-6">
          <p className="text-2xl">🌍</p>
          <p className="mt-3 text-sm">Interactive map preview for {regionKey}</p>
          <p className="mt-1 text-xs text-slate-500">Use a Region or Country column to show distribution.</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
        {Object.entries(regionCounts).slice(0, 6).map(([region, count]) => (
          <div key={region} className="rounded-xl bg-slate-50 p-2 border border-slate-100">
            <p className="font-semibold text-slate-700">{region}</p>
            <p>{count} rows</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MapView;
