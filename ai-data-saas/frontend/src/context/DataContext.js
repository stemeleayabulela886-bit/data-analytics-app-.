import React, { createContext, useState } from "react";

export const DataContext = createContext();

export function DataProvider({ children }) {
  const [file, setFile] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [kpis, setKpis] = useState(null);
  const [chart, setChart] = useState(null);
  const [cleanReport, setCleanReport] = useState(null);
  const [predictiveMultiplier, setPredictiveMultiplier] = useState(1);

  return (
    <DataContext.Provider
      value={{
        file,
        setFile,
        dashboardData,
        setDashboardData,
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
