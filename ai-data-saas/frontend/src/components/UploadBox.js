import React, { useState, useContext } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import API from "../api/api";
import { DataContext } from "../context/DataContext";
import DatabaseConnect from "./DatabaseConnect";

function UploadBox() {
  const { tables, setTables, setActiveTableName, activeTableData, activeTableName } = useContext(DataContext);
  const [fileInput, setFileInput] = useState(null);
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDbConnect, setShowDbConnect] = useState(false);

  const aiSuggestMapping = (col) => {
    const normalized = col.toLowerCase().replace(/[^a-z0-9]/g, "");
    const expectedColumns = ["Date", "Revenue", "Region"];
    const suggestions = {
      rev: "Revenue", revenue: "Revenue", amt: "Revenue", amount: "Revenue",
      date: "Date", day: "Date",
      region: "Region", area: "Region", country: "Region",
    };
    if (suggestions[normalized]) return suggestions[normalized];
    return expectedColumns.find((exp) => {
      const normExp = exp.toLowerCase().replace(/[^a-z0-9]/g, "");
      return normExp.includes(normalized) || normalized.includes(normExp);
    });
  };

  const healColumns = (rawData) => {
    if (!rawData || !rawData.length) return rawData;
    const expected = ["Date", "Revenue", "Region"];
    const currentCols = Object.keys(rawData[0] || {});
    const healingMap = {};

    currentCols.forEach((col) => {
      if (!expected.includes(col)) {
        const suggestion = aiSuggestMapping(col);
        if (suggestion) healingMap[col] = suggestion;
      }
    });

    return rawData.map((row) => {
      const newRow = {};
      Object.keys(row).forEach((key) => {
        newRow[healingMap[key] || key] = row[key];
      });
      return newRow;
    });
  };

  const normalizeFileName = (name) => {
    return name.replace(/\.[^/.]+$/, "").replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_-]/g, "") || "data";
  };

  const parseCsv = (file) =>
    new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => resolve(results.data),
        error: (error) => reject(error),
      });
    });

  const parseJson = async (file) => {
    const text = await file.text();
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed;
    if (parsed.data && Array.isArray(parsed.data)) return parsed.data;
    if (typeof parsed === "object") return [parsed];
    throw new Error("JSON did not contain a top-level array or row objects.");
  };

  const parseExcel = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(sheet, { defval: null });
  };

  const loadFileData = async (file) => {
    if (!file) return [];
    const ext = file.name.split(".").pop().toLowerCase();
    if (ext === "csv") return parseCsv(file);
    if (ext === "json") return parseJson(file);
    if (ext === "xlsx" || ext === "xls") return parseExcel(file);
    throw new Error("Unsupported file format. Use CSV, Excel, or JSON.");
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    setFileInput(selectedFile);
    if (!selectedFile) return;

    try {
      const rawData = await loadFileData(selectedFile);
      const healedData = healColumns(rawData);
      const tableName = normalizeFileName(selectedFile.name);
      setTables((prev) => ({ ...prev, [tableName]: healedData }));
      setActiveTableName(tableName);
      setStatus(`${selectedFile.name} added to workspace.`);
      setStatusType("success");
    } catch (err) {
      setStatus(`File parse failed: ${err.message}`);
      setStatusType("error");
    }
  };

  const localPredict = (data) => {
    if (!data || !data.length) return null;
    const columns = Object.keys(data[0]);
    const candidate = columns.find((col) => data.some((row) => !Number.isNaN(parseFloat(row[col]))));
    if (!candidate) return null;

    const values = data
      .map((row) => Number(row[candidate]))
      .filter((value) => !Number.isNaN(value));

    if (!values.length) return null;
    const lastValues = values.slice(-10);
    return (lastValues.reduce((acc, value) => acc + value, 0) / lastValues.length) * 1.15;
  };

  const handleGetPrediction = async () => {
    if (!fileInput && !activeTableData) return;
    setLoading(true);
    setStatus("Generating AI Predictions...");

    try {
      if (fileInput) {
        const formData = new FormData();
        formData.append("file", fileInput);
        const res = await API.post("/predict/", formData);

        if (res.data.status === "success" && res.data.predictions?.length > 0) {
          const val = res.data.predictions[0];
          setStatus(`AI Success! Predicted Next Value: ${Number(val).toFixed(2)}`);
          setStatusType("success");
        } else {
          throw new Error(res.data.message || "AI format mismatch.");
        }
      } else {
        throw new Error("Using local fallback prediction.");
      }
    } catch (error) {
      const fallback = localPredict(activeTableData);
      if (fallback !== null) {
        setStatus(`Local fallback prediction: ${fallback.toFixed(2)} (backend unavailable)`);
        setStatusType("success");
      } else {
        setStatus(`AI Backend Unreachable: ${error.message}`);
        setStatusType("error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg mb-6 border border-gray-100">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span className="text-indigo-600">📁</span> Multi-Source Workspace
      </h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-600 mb-2">Upload CSV, Excel, or JSON</label>
        <input
          type="file"
          onChange={handleFileChange}
          accept=".csv,.xlsx,.xls,.json"
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
        />
      </div>

      <button
        onClick={handleGetPrediction}
        disabled={loading || (!fileInput && !activeTableData)}
        className="bg-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-purple-700 transition-all disabled:opacity-50 shadow-md active:scale-95"
      >
        {loading ? "Analyzing..." : "AI Predict"}
      </button>

      {fileInput && (
        <p className="mt-3 text-sm text-slate-500">Loaded file: {fileInput.name}</p>
      )}

      {status && (
        <div className={`mt-4 p-3 rounded-lg text-sm font-medium animate-in fade-in duration-300 ${
          statusType === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {status}
        </div>
      )}

      <div className="mt-8 border-t pt-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-700">Loaded Tables</h3>
            <p className="text-xs text-slate-500">Select a dataset to work with in the dashboard.</p>
          </div>
          <button
            onClick={() => setShowDbConnect((prev) => !prev)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all"
          >
            {showDbConnect ? "Hide DB Connect" : "Connect Database"}
          </button>
        </div>

        {Object.keys(tables).length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">No tables loaded yet. Upload a CSV/Excel/JSON file or connect to a database.</p>
        ) : (
          <div className="grid gap-2 mt-4">
            {Object.entries(tables).map(([name, data]) => (
              <button
                key={name}
                type="button"
                onClick={() => setActiveTableName(name)}
                className={`w-full text-left p-3 rounded-2xl border ${
                  activeTableName === name ? "border-indigo-500 bg-indigo-50 text-indigo-900" : "border-gray-200 bg-white text-slate-700 hover:border-indigo-200"
                } transition-all`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium truncate">{name}</span>
                  <span className="text-xs text-slate-400">{data?.length ?? 0} rows</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {showDbConnect && (
          <div className="mt-6">
            <DatabaseConnect setTables={setTables} setActiveTableName={setActiveTableName} />
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadBox;
