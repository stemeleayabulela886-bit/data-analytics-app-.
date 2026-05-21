import React, { useState } from "react";
import KPICard from "./KPICard";
import AIChatbox from "./AIChatbox";

function Dashboard() {
  const [visuals, setVisuals] = useState([]);
  const [kpis, setKpis] = useState([
    { id: 1, title: "Total Records Processed", value: "0", trend: "0", isPositive: true }
  ]);

  // The state command center: parsing text inputs directly to layout items
  const handleAIVisualGeneration = (prompt) => {
    const text = (prompt || "").toLowerCase();
    let newVisuals = [...visuals];
    let newKpis = [...kpis];

    if (text.includes("bar") || text.includes("chart") || text.includes("dashboard")) {
      newVisuals.push({
        id: Date.now(),
        title: "AI Generated Regional Performance",
        type: "bar"
      });
    }
    if (text.includes("kpi") || text.includes("revenue") || text.includes("sales")) {
      newKpis.push({
        id: Date.now(),
        title: "Projected Revenue Growth",
        value: "$84,210",
        trend: "+18.4",
        isPositive: true
      });
    }

    setVisuals(newVisuals);
    setKpis(newKpis);
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      
      {/* Dynamic Content Workspace */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Workspace Main Canvas */}
        <main className="flex-1 p-8 overflow-y-auto">
          
          {/* AI Automated KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {kpis.map(kpi => (
              <KPICard key={kpi.id} title={kpi.title} value={kpi.value} trend={kpi.trend} isPositive={kpi.isPositive} />
            ))}
          </div>

          {/* Core Visualizations Panel Grid */}
          <div className="grid grid-cols-12 gap-6">
            {visuals.length === 0 ? (
              <div className="col-span-12 h-80 border-2 border-dashed border-gray-200 rounded-[2.5rem] flex flex-col items-center justify-center bg-white/60 backdrop-blur-md">
                <span className="text-3xl mb-2">✨</span>
                <p className="font-bold text-gray-500 text-sm">Dashboard Canvas Empty</p>
                <p className="text-gray-400 text-xs">Use the AI Chatbot on the right to auto-generate metrics.</p>
              </div>
            ) : (
              visuals.map((v) => (
                <div key={v.id} className="col-span-12 lg:col-span-6 bg-white p-6 rounded-[2.5rem] shadow-xl border border-gray-50 h-[350px] flex flex-col">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">{v.title}</h3>
                  <div className="flex-1 bg-gradient-to-br from-indigo-50/50 to-white border border-gray-100 rounded-2xl flex items-center justify-center italic text-xs text-indigo-400">
                    Active dynamic rendering for {v.type} chart logic...
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {/* Floating Interactive Chat Interface Panel */}
      <div className="p-6 flex items-center justify-center bg-gray-50 border-l border-gray-100">
        <AIChatbox onGenerateDashboard={handleAIVisualGeneration} />
      </div>

    </div>
  );
}

export default Dashboard;