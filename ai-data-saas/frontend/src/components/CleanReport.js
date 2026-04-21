import React, { useContext } from "react";
import { DataContext } from "../context/DataContext";

function CleanReport() {
  const { cleanReport } = useContext(DataContext);

  if (!cleanReport) return null;

  return (
    <div className="bg-green-100 p-4 rounded-lg mt-6 border-l-4 border-green-500">
      <h3 className="font-semibold text-green-800 mb-2">🧹 Data Cleaning Report</h3>
      <pre className="text-sm overflow-auto bg-white p-3 rounded">
        {JSON.stringify(cleanReport, null, 2)}
      </pre>
    </div>
  );
}

export default CleanReport;
