import React, { createContext, useState } from "react";

export const DataContext = createContext();

export function DataProvider({ children }) {
  // 1. Multi-Table Support: Changed from 'null' to an empty object {}
  const [tables, setTables] = useState({}); 
  
  // 2. State to track which specific file is currently being viewed on the dashboard
  const [activeTableName, setActiveTableName] = useState(null);

  // 3. Keep specific visual states
  const [kpis, setKpis] = useState(null);
  const [chart, setChart] = useState(null);
  const [cleanReport, setCleanReport] = useState(null);
  const [predictiveMultiplier, setPredictiveMultiplier] = useState(1);

  // Helper to get the data of the currently selected table
  const activeTableData = activeTableName ? tables[activeTableName] : null;

  return (
    <DataContext.Provider
      value={{
        tables,
        setTables,
        activeTableName,
        setActiveTableName,
        activeTableData, // Your visuals should use this instead of dashboardData
        kpis,
        setKpis,
        chart,
        setChart,
        cleanReport,
        setCleanReport,
        predictiveMultiplier,
        setPredictiveMultiplier,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}