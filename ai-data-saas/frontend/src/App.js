import React, { useState, useEffect, useContext } from 'react';
import { BarChart3, LayoutDashboard, Database, Zap } from 'lucide-react';
import UploadBox from "./components/UploadBox";
import ActionPanel from "./components/ActionPanel";
import KPIView from "./components/KPIView";
import ChartView from "./components/ChartView";
import CleanReport from "./components/CleanReport";
import DashboardBuilder from "./components/DashboardBuilder";
import SaveAndPay from "./components/SaveAndPay";
import { connectSocket, closeSocket } from "./services/socket";
import { DataContext } from "./context/DataContext";

const PredictiveSlider = ({ onSimulate }) => {
  const [multiplier, setMultiplier] = useState(1);

  return (
    <div className="bg-white p-4 border-t flex items-center justify-between">
      <div className="flex flex-col">
        <span className="text-sm font-bold text-indigo-700">Predictive Playback</span>
        <span className="text-xs text-gray-400">Simulate market growth influence</span>
      </div>
      <div className="flex items-center gap-4 w-1/2">
        <span className="text-xs">-20%</span>
        <input
          type="range"
          min="0.8"
          max="1.2"
          step="0.05"
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          value={multiplier}
          onChange={(e) => {
            setMultiplier(Number(e.target.value));
            onSimulate(Number(e.target.value));
          }}
        />
        <span className="text-xs">+20%</span>
      </div>
      <div className="text-indigo-600 font-mono font-bold">
        {Math.round((multiplier - 1) * 100)}% Shift
      </div>
    </div>
  );
};

const App = () => {
  const { file, predictiveMultiplier, setPredictiveMultiplier } = useContext(DataContext);
  const [draggedItem, setDraggedItem] = useState(null);
  const [notification, setNotification] = useState("");
  const [canvasComponents, setCanvasComponents] = useState([]);

  const visualComponents = [
    { id: 'kpi', label: 'KPI Cards', icon: <LayoutDashboard size={20} />, component: KPIView },
    { id: 'chart', label: 'Chart Visualization', icon: <BarChart3 size={20} />, component: ChartView },
    { id: 'report', label: 'Cleaning Report', icon: <Database size={20} />, component: CleanReport },
  ];

  useEffect(() => {
    try {
      connectSocket((data) => {
        setNotification(data);
        setTimeout(() => setNotification(""), 3000);
      });
    } catch (error) {
      console.log("Socket disabled:", error);
    }

    return () => {
      try {
        closeSocket();
      } catch (error) {
        console.log("Socket cleanup failed:", error);
      }
    };
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (draggedItem && file) {
      const rect = e.currentTarget.getBoundingClientRect();
      const newComponent = {
        id: Date.now(),
        type: draggedItem.id,
        component: draggedItem.component,
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      setCanvasComponents((prev) => [...prev, newComponent]);
    }
    setDraggedItem(null);
  };

  const removeComponent = (id) => {
    setCanvasComponents((prev) => prev.filter((comp) => comp.id !== id));
  };

  const handleSimulate = (value) => {
    setPredictiveMultiplier(value);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans text-gray-900">
      <header className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <LayoutDashboard size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold">AI Data Analytics</h1>
            <p className="text-sm text-gray-500">Build intelligent dashboards with your CSV data.</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-gray-100 p-3 rounded-xl border border-gray-200">
          <UploadBox />
          {notification && (
            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-2 rounded text-sm">
              {notification}
            </div>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-72 bg-white border-r p-5 flex flex-col gap-6 overflow-y-auto">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-4">Visualizations</h2>
            <div className="space-y-3">
              {visualComponents.map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={() => setDraggedItem(item)}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl bg-white cursor-grab hover:border-indigo-400 transition"
                >
                  <span className="text-indigo-600">{item.icon}</span>
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-4">Actions</h2>
            <ActionPanel />
          </div>
        </aside>

        <main className="flex-1 flex flex-col bg-slate-100 overflow-hidden">
          <div className="flex-1 p-8 overflow-auto">
            <div
              className="w-full h-full min-h-[620px] border-2 border-dashed border-gray-300 rounded-3xl bg-white relative"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {canvasComponents.length === 0 && !file ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 px-8">
                  <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-200 text-center">
                    <LayoutDashboard size={48} className="mx-auto text-gray-200" />
                    <p className="text-xl font-semibold mt-4">Drag visuals here to build your dashboard</p>
                    <p className="text-sm text-gray-500 mt-2">Upload a dataset first, then drag KPI cards, charts, and reports onto the canvas.</p>
                  </div>
                </div>
              ) : (
                <div className="relative h-full">
                  {canvasComponents.map((comp) => {
                    const Component = comp.component;
                    return (
                      <div
                        key={comp.id}
                        className="absolute bg-white rounded-2xl shadow-lg border p-4 w-[340px]"
                        style={{ left: comp.x, top: comp.y }}
                      >
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm font-semibold text-gray-700">
                            {visualComponents.find((v) => v.id === comp.type)?.label}
                          </span>
                          <button
                            onClick={() => removeComponent(comp.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ✕
                          </button>
                        </div>
                        <Component />
                      </div>
                    );
                  })}
                  {file && canvasComponents.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                      <p className="text-base">Upload successful! Drag visuals from the sidebar to construct your dashboard.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <PredictiveSlider onSimulate={handleSimulate} />

          <section className="h-36 bg-white border-t px-8 py-5 shadow-inner">
            <div className="flex items-center gap-3 text-indigo-600 font-semibold text-sm mb-3">
              <Zap size={16} />
              <span>AI Command Board</span>
            </div>
            <div className="flex gap-3">
              <textarea
                className="flex-1 border rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none bg-slate-50"
                placeholder="Tell the AI to modify your dashboard (e.g., 'Change the chart to a bar graph' or 'Calculate total revenue')..."
              />
              <button className="bg-indigo-600 text-white px-6 rounded-2xl font-semibold hover:bg-indigo-700 transition">
                Run AI
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default App;
