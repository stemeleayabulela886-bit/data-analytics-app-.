import React, { useContext } from "react";
import { DataContext } from "../context/DataContext";

function TableView() {
  const { activeTableData } = useContext(DataContext);
  const data = activeTableData || [];

  if (!data.length) return <p className="text-sm text-gray-500">Upload data to display a table.</p>;

  const columns = Object.keys(data[0]);

  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm overflow-x-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">Data Table</h3>
        <span className="text-xs text-gray-400">Showing first {Math.min(8, data.length)} rows</span>
      </div>
      <table className="min-w-full text-sm text-left border-separate border-spacing-0">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col} className="px-3 py-2 bg-slate-50 text-gray-500 border border-gray-100 font-semibold uppercase text-[10px] tracking-wider">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.slice(0, 8).map((row, index) => (
            <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}>
              {columns.map((col) => (
                <td key={col} className="px-3 py-2 border border-gray-100 text-gray-700">
                  {String(row[col])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableView;
