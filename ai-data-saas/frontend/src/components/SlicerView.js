import React, { useContext, useState } from "react";
import { DataContext } from "../context/DataContext";

function SlicerView() {
  const { activeTableData } = useContext(DataContext);
  const [selectedValue, setSelectedValue] = useState(null);
  const data = activeTableData || [];

  if (!data.length) return <p className="text-sm text-gray-500">Upload data to use a slicer.</p>;

  const columns = Object.keys(data[0]);
  const slicerKey = columns.find((key) => key.toLowerCase().includes("region")) || columns.find((key) => key.toLowerCase().includes("category")) || columns.find((key) => typeof data[0][key] === "string");

  if (!slicerKey) return <p className="text-sm text-gray-500">No categorical column available for slicing.</p>;

  const uniqueValues = [...new Set(data.map((row) => row[slicerKey] || "Unknown"))].slice(0, 12);
  const filteredCount = selectedValue ? data.filter((row) => String(row[slicerKey]) === String(selectedValue)).length : data.length;

  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Slicer</h3>
      <p className="text-xs text-gray-500 mb-3">Filter by {slicerKey}.</p>
      <div className="flex flex-wrap gap-2">
        {uniqueValues.map((value) => (
          <button
            key={value}
            onClick={() => setSelectedValue(value)}
            className={`px-3 py-1 text-xs rounded-full border ${selectedValue === value ? "bg-indigo-600 text-white border-indigo-600" : "bg-slate-50 text-slate-600 border-slate-200"}`}
          >
            {value}
          </button>
        ))}
      </div>
      <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-sm text-slate-600">
        <p className="font-semibold text-slate-700">Current selection</p>
        <p>{selectedValue ? `${slicerKey}: ${selectedValue}` : "No slicer selected"}</p>
        <p className="mt-2 text-xs text-slate-400">Rows shown in filtered dashboard: {filteredCount}</p>
      </div>
    </div>
  );
}

export default SlicerView;
