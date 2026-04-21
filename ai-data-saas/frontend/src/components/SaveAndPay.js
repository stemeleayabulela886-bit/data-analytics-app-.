import React, { useContext } from "react";
import API from "../api/api";
import { DataContext } from "../context/DataContext";

function SaveAndPay() {
  const { kpis, chart } = useContext(DataContext);

  const handleSaveDashboard = async () => {
    try {
      const res = await API.post("/dashboard/save", {
        user_id: 1,
        name: `Dashboard ${new Date().toLocaleString()}`,
        data: JSON.stringify({ kpis, chart })
      });
      alert("Dashboard saved successfully!");
    } catch (error) {
      console.error("Error saving dashboard:", error);
      alert("Failed to save dashboard");
    }
  };

  const handlePayment = async () => {
    try {
      const res = await API.get("/payment/checkout");
      window.location.href = res.data.url;
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("Failed to initiate payment");
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg mt-6">
      <h2 className="text-xl font-semibold mb-4">💾 Save & Upgrade</h2>

      <div className="flex flex-wrap gap-4">
        <button
          onClick={handleSaveDashboard}
          disabled={!kpis && !chart}
          className="bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-3 rounded-lg shadow-md hover:scale-105 transition disabled:opacity-50"
        >
          💾 Save Dashboard
        </button>

        <button
          onClick={handlePayment}
          className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-6 py-3 rounded-lg shadow-md hover:scale-105 transition"
        >
          💳 Upgrade to Pro ($19.99)
        </button>
      </div>

      <p className="text-sm text-gray-600 mt-4">
        💡 Save your dashboards to access them anytime. Upgrade to Pro for unlimited storage and advanced features.
      </p>
    </div>
  );
}

export default SaveAndPay;
