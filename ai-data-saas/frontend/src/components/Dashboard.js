import React, { useState } from "react";
import KPICard from "./KPICard";

function Dashboard() {
  const [visuals, setVisuals] = useState([]);
  const [showConnect, setShowConnect] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC]">
      {/* PROFESSIONAL HEADER */}
      <header className="bg-white border-b border-gray-100 p-4 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-xl font-black text-gray-800">AI Data Analytics</h1>
          <p className="text-xs text-gray-400 font-medium">Unified Intelligence Hub</p>
        </div>
        
        <div className="flex gap-3">
          <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full text-xs font-bold transition-all shadow-lg shadow-indigo-200">
            📁 Upload CSV/Excel
            <input type="file" className="hidden" onChange={() => alert('File logic goes here')} />
          </label>
          <button 
            onClick={() => setShowConnect(!showConnect)}
            className="bg-white border border-gray-200 text-gray-600 px-6 py-2 rounded-full text-xs font-bold hover:bg-gray-50 transition-all"
          >
            🔌 Connect SQL
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* MAIN CANVAS */}
        <main className="flex-1 p-8 overflow-y-auto">
          {/* 1. KPI SECTION (Like your Power BI reference) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <KPICard title="Revenue Projection" value="$142.5k" trend="12.5" isPositive={true} />
            <KPICard title="Data Reliability" value="98.2%" trend="2.1" isPositive={true} />
            <KPICard title="System Latency" value="42ms" trend="14.2" isPositive={false} />
            <KPICard title="AI Insights" value="24" trend="8" isPositive={true} />
          </div>

          {/* 2. VISUALS GRID */}
          <div className="grid grid-cols-12 gap-6">
            {visuals.length === 0 ? (
              <div className="col-span-12 h-96 border-2 border-dashed border-gray-200 rounded-[3rem] flex flex-col items-center justify-center bg-white/50">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-gray-600 font-bold">Canvas Empty</h3>
                <p className="text-gray-400 text-sm">Upload a dataset to generate AI visuals.</p>
              </div>
            ) : (
              visuals.map((v) => (
                <div key={v.id} className="col-span-12 lg:col-span-6 bg-white p-6 rounded-[2.5rem] shadow-xl border border-gray-50 h-[400px]">
                   <div className="flex-1 w-full p-6 bg-gradient-to-br from-indigo-50/50 to-white rounded-[2rem] border border-white shadow-inner flex flex-col items-center justify-center">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-3">
                        <span className="text-xl">📈</span>
                    </div>
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">
                        AI Analysis Engine
                    </p>
                    <h4 className="text-sm font-bold text-gray-700">
                        Generating {v.type} Visual...
                    </h4>
                    <div className="mt-4 w-24 h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 animate-[loading_2s_ease-in-out_infinite] w-full"></div>
                    </div>
                   </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {/* SQL CONNECT OVERLAY (Only shows when clicked) */}
      {showConnect && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-[2rem] shadow-2xl w-96 border border-gray-100">
             <h2 className="text-xl font-bold mb-4 text-gray-800">Database Connection</h2>
             {/* Your SQL Form goes here */}
             <button onClick={() => setShowConnect(false)} className="mt-4 text-indigo-600 font-bold">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;