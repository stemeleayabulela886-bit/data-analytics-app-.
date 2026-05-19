import React from "react";

const VisualPane = ({ onAddVisual }) => {
  const visualTypes = [
    { id: "kpi", icon: "📊", label: "KPI Cards" },
    { id: "chart", icon: "📈", label: "Auto Chart" },
    { id: "line", icon: "📈", label: "Line Chart" },
    { id: "area", icon: "📐", label: "Area Chart" },
    { id: "pie", icon: "⭕", label: "Pie Chart" },
    { id: "donut", icon: "🍩", label: "Donut Chart" },
    { id: "table", icon: "📅", label: "Data Table" },
    { id: "gauge", icon: "⏲️", label: "Gauge Chart" },
    { id: "map", icon: "🌍", label: "Map View" },
    { id: "slice", icon: "🧩", label: "Slicer" },
    { id: "report", icon: "🧹", label: "Cleaning Report" },
  ];

  return (
    <div className="w-64 border-l bg-white h-full flex flex-col shadow-inner">
      <div className="p-4 border-b bg-indigo-50">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-3xl bg-indigo-600 text-white shadow-sm">
            <span className="text-lg">📊</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-indigo-700 uppercase tracking-widest">Visuals</h3>
            <p className="text-[11px] text-indigo-500 mt-1">Drag icons onto the canvas.</p>
          </div>
        </div>
      </div>
      
      <div className="p-3">
        <div className="grid grid-cols-5 gap-2">
          {visualTypes.map((v) => (
            <button
              key={v.id}
              onClick={() => onAddVisual(v.id)}
              className="h-12 w-12 rounded-3xl border border-gray-200 bg-white shadow-sm flex items-center justify-center text-xl hover:border-indigo-400 hover:bg-indigo-50 transition"
              title={v.label}
            >
              {v.icon}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase">Values</label>
            <div className="mt-1 border border-dashed border-gray-300 bg-gray-50 p-3 rounded text-center text-[10px] text-gray-400">
              Add data fields here
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase">Legend</label>
            <div className="mt-1 border border-dashed border-gray-300 bg-gray-50 p-3 rounded text-center text-[10px] text-gray-400">
              Add data fields here
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualPane;