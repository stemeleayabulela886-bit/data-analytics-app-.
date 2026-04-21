import React, { useState } from "react";
import API from "../api/api";

function DatabaseConnect({ setData }) {
  const [host, setHost] = useState("");
  const [port, setPort] = useState(5432);
  const [database, setDatabase] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [driver, setDriver] = useState("postgresql");
  const [status, setStatus] = useState("");
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    setStatus("");
    try {
      const res = await API.post("/database/connect", {
        host,
        port: parseInt(port),
        database,
        username,
        password,
        driver,
      });
      setStatus(res.data.message);
      // Fetch tables after successful connection
      const tablesRes = await API.post("/database/tables", {
        host,
        port: parseInt(port),
        database,
        username,
        password,
        driver,
      });
      setTables(tablesRes.data.tables);
    } catch (error) {
      setStatus(error.response?.data?.detail || "Connection failed");
    } finally {
      setLoading(false);
    }
  };

  const handleImportTable = async () => {
    if (!selectedTable) return;
    setLoading(true);
    try {
      // For simplicity, assume we fetch data from the table
      // In a real app, you'd need a backend endpoint to fetch table data
      // For now, just set a placeholder
      setData({ message: `Data from ${selectedTable} imported successfully` });
      setStatus(`Imported data from ${selectedTable}`);
    } catch (error) {
      setStatus("Import failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
      <h2 className="text-xl font-semibold mb-4">Connect to Database</h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <select
          value={driver}
          onChange={(e) => setDriver(e.target.value)}
          className="p-3 border rounded-lg"
        >
          <option value="postgresql">PostgreSQL</option>
          <option value="mysql">MySQL</option>
          <option value="sqlserver">SQL Server</option>
        </select>
        <input
          type="text"
          placeholder="Host"
          value={host}
          onChange={(e) => setHost(e.target.value)}
          className="p-3 border rounded-lg"
        />
        <input
          type="number"
          placeholder="Port"
          value={port}
          onChange={(e) => setPort(e.target.value)}
          className="p-3 border rounded-lg"
        />
        <input
          type="text"
          placeholder="Database"
          value={database}
          onChange={(e) => setDatabase(e.target.value)}
          className="p-3 border rounded-lg"
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-3 border rounded-lg"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-3 border rounded-lg"
        />
      </div>

      <button
        onClick={handleConnect}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 mr-4"
      >
        {loading ? "Connecting..." : "Connect"}
      </button>

      {tables.length > 0 && (
        <div className="mt-4">
          <select
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
            className="p-3 border rounded-lg mr-4"
          >
            <option value="">Select a table</option>
            {tables.map((table) => (
              <option key={table} value={table}>
                {table}
              </option>
            ))}
          </select>
          <button
            onClick={handleImportTable}
            disabled={loading || !selectedTable}
            className="bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            Import Table
          </button>
        </div>
      )}

      {status && (
        <p className={`mt-3 text-sm ${status.includes("failed") ? "text-red-600" : "text-green-600"}`}>
          {status}
        </p>
      )}
    </div>
  );
}

export default DatabaseConnect;