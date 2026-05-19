import React, { useState, useEffect, useContext } from 'react';
import { BarChart3, LayoutDashboard, Database, Zap } from 'lucide-react';
import UploadBox from "./components/UploadBox";
import ActionPanel from "./components/ActionPanel";
import KPIView from "./components/KPIView";
import ChartView from "./components/ChartView";
import CleanReport from "./components/CleanReport";
import LineChartView from "./components/LineChartView";
import AreaChartView from "./components/AreaChartView";
import PieChartView from "./components/PieChartView";
import DonutChartView from "./components/DonutChartView";
import TableView from "./components/TableView";
import GaugeView from "./components/GaugeView";
import MapView from "./components/MapView";
import SlicerView from "./components/SlicerView";
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
  const { activeTableData, predictiveMultiplier, setPredictiveMultiplier } = useContext(DataContext);
  const [draggedItem, setDraggedItem] = useState(null);
  const [notification, setNotification] = useState("");
  const [canvasComponents, setCanvasComponents] = useState([]);

  const visualComponents = [
    { id: 'kpi', label: 'KPI Cards', icon: <LayoutDashboard size={20} />, component: KPIView },
    { id: 'chart', label: 'Auto Chart', icon: <BarChart3 size={20} />, component: ChartView },
    { id: 'line', label: 'Line Chart', icon: <BarChart3 size={20} />, component: LineChartView },
    { id: 'area', label: 'Area Chart', icon: <BarChart3 size={20} />, component: AreaChartView },
    { id: 'pie', label: 'Pie Chart', icon: <LayoutDashboard size={20} />, component: PieChartView },
    { id: 'donut', label: 'Donut Chart', icon: <LayoutDashboard size={20} />, component: DonutChartView },
    { id: 'table', label: 'Data Table', icon: <Database size={20} />, component: TableView },
    { id: 'gauge', label: 'Gauge Metric', icon: <Zap size={20} />, component: GaugeView },
    { id: 'map', label: 'Map View', icon: <Database size={20} />, component: MapView },
    { id: 'slice', label: 'Slicer', icon: <Zap size={20} />, component: SlicerView },
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

  const snapToGrid = (value) => {
    const gridSize = 24;
    return Math.max(16, Math.round(value / gridSize) * gridSize);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (draggedItem && activeTableData) {
      const rect = e.currentTarget.getBoundingClientRect();
      const rawX = e.clientX - rect.left;
      const rawY = e.clientY - rect.top;
      const newComponent = {
        id: Date.now(),
        type: draggedItem.id,
        component: draggedItem.component,
        x: snapToGrid(rawX),
        y: snapToGrid(rawY),
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
          <div className="rounded-3xl border border-gray-100 bg-indigo-50 p-5 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-3xl bg-indigo-600 text-white shadow-sm">
              <LayoutDashboard size={28} />
            </div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-600">Visuals</h2>
            <p className="text-[11px] text-indigo-500 mt-2">Choose and drag icons onto your dashboard.</p>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {visualComponents.map((item) => (
              <button
                key={item.id}
                draggable
                onDragStart={() => setDraggedItem(item)}
                title={item.label}
                className="h-14 w-14 rounded-3xl border border-gray-200 bg-white shadow-sm flex items-center justify-center text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50 transition"
              >
                {item.icon}
              </button>
            ))}
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
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(203,213,225,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(203,213,225,0.35) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {canvasComponents.length === 0 && !activeTableData ? (
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
                  {activeTableData && canvasComponents.length === 0 && (
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
