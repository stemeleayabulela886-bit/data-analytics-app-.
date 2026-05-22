import React, { useState } from "react";
import KPICard from "./KPICard";
import AIChatbox from "./AIChatbox";
import ChartView from "./ChartView";
import LineChartView from "./LineChartView";
import DonutChartView from "./DonutChartView";
import GaugeView from "./GaugeView";
import MapView from "./MapView";

function Dashboard() {
  const [visuals, setVisuals] = useState([]);
  const [kpis, setKpis] = useState([
    { id: 1, title: "Total Records Processed", value: "0", trend: "0", isPositive: true }
  ]);

  // The state command center: accepts either a text prompt or a backend payload
  const handleAIVisualGeneration = (payloadOrPrompt) => {
    // If backend returned an object with visuals/kpis, use it directly
    if (payloadOrPrompt && typeof payloadOrPrompt === 'object' && (payloadOrPrompt.visuals || payloadOrPrompt.kpis)) {
      const newVisuals = payloadOrPrompt.visuals || [];
      const newKpis = payloadOrPrompt.kpis || [];
      setVisuals((prev) => [...prev, ...newVisuals]);
      setKpis((prev) => [...prev, ...newKpis]);
      return;
    }

    // Otherwise treat it as a text prompt and fall back to local heuristics
    const text = (payloadOrPrompt || "").toLowerCase();
    let newVisuals = [...visuals];
    let newKpis = [...kpis];

    if (text.includes("bar") || text.includes("chart") || text.includes("dashboard")) {
      newVisuals.push({
        id: Date.now(),
        title: "AI Generated Regional Performance",
        type: "bar"
      });
    }
    if (text.includes("line") || text.includes("trend")) {
      newVisuals.push({
        id: Date.now(),
        title: "AI Generated Trend",
        type: "line"
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
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-[1440px] mx-auto">
            <div className="flex flex-col gap-6 mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-indigo-500 font-bold">Dashboard workspace</p>
                  <h2 className="text-3xl font-black text-slate-900">AI insights canvas</h2>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button className="px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50">Overview</button>
                  <button className="px-4 py-2 rounded-full bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700">Analytics</button>
                  <button className="px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50">Dataset</button>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <p className="text-sm text-slate-500">Track real-time dashboard creation and AI insights with quick actions.</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <button className="px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50">Refresh</button>
                  <button className="px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50">Export</button>
                  <button className="px-4 py-2 rounded-full bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700">Add Widget</button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {kpis.map(kpi => (
                <KPICard key={kpi.id} title={kpi.title} value={kpi.value} trend={kpi.trend} isPositive={kpi.isPositive} />
              ))}
            </div>

            <div className="grid grid-cols-12 gap-6">
              {visuals.length === 0 ? (
                <div className="col-span-12 h-96 border-2 border-dashed border-gray-200 rounded-[2.5rem] flex flex-col items-center justify-center bg-white/60 backdrop-blur-md">
                  <span className="text-3xl mb-2">✨</span>
                  <p className="font-bold text-gray-500 text-sm">Dashboard Canvas Empty</p>
                  <p className="text-gray-400 text-xs">Use the AI assistant below to generate charts and metrics.</p>
                </div>
              ) : (
                visuals.map((v) => (
                  <div key={v.id} className="col-span-12 lg:col-span-6 bg-white p-6 rounded-[2.5rem] shadow-xl border border-gray-50 h-[350px] flex flex-col">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">{v.title}</h3>
                    <div className="flex-1">
                      {v.type === 'bar' && (
                        <div className="h-full">
                          {/* reuse ChartView which renders a bar chart from DataContext or fallback */}
                          <ChartView />
                        </div>
                      )}
                      {v.type === 'line' && (
                        <div className="h-full">
                          <LineChartView />
                        </div>
                      )}
                      {v.type === 'donut' && (
                        <div className="h-full">
                          <DonutChartView />
                        </div>
                      )}
                      {v.type === 'gauge' && (
                        <div className="h-full">
                          <GaugeView />
                        </div>
                      )}
                      {v.type === 'map' && (
                        <div className="h-full">
                          <MapView />
                        </div>
                      )}
                      {!['bar','line','donut','gauge','map'].includes(v.type) && (
                        <div className="h-full bg-gradient-to-br from-indigo-50/50 to-white border border-gray-100 rounded-2xl flex items-center justify-center italic text-xs text-indigo-400">
                          Active dynamic rendering for {v.type} chart logic...
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>

      <div className="w-96 p-6 flex items-center justify-center bg-gray-50 border-l border-gray-100">
        <AIChatbox onGenerateDashboard={handleAIVisualGeneration} />
      </div>
    </div>
  );
}

export default Dashboard;