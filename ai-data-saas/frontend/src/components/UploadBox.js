import React, { useState, useContext } from "react";
import Papa from "papaparse";
import API from "../api/api";
import { DataContext } from "../context/DataContext";

function UploadBox() {
  const { setFile, setDashboardData } = useContext(DataContext);
  const [fileInput, setFileInput] = useState(null);
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("");
  const [loading, setLoading] = useState(false);

  const parseCSV = async (file) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => resolve(results.data),
        error: (error) => reject(error),
      });
    });
  };

  const aiSuggestMapping = (col, expectedColumns) => {
    const normalized = col.toLowerCase().replace(/[^a-z0-9]/g, "");
    const suggestions = {
      rev: "Revenue",
      revenue: "Revenue",
      amt: "Revenue",
      amount: "Revenue",
      date: "Date",
      day: "Date",
      region: "Region",
      area: "Region",
      country: "Region",
    };

    if (suggestions[normalized]) {
      return suggestions[normalized];
    }

    return expectedColumns.find((expected) => {
      const normalizedExpected = expected.toLowerCase().replace(/[^a-z0-9]/g, "");
      return normalizedExpected.includes(normalized) || normalized.includes(normalizedExpected);
    });
  };

  const healColumns = (rawData) => {
    const expectedColumns = ["Date", "Revenue", "Region"];
    const currentColumns = rawData[0] ? Object.keys(rawData[0]) : [];
    const healingMap = {};

    currentColumns.forEach((col) => {
      if (!expectedColumns.includes(col)) {
        const suggestion = aiSuggestMapping(col, expectedColumns);
        if (suggestion) {
          healingMap[col] = suggestion;
          console.log(`Auto-healed: Mapping ${col} -> ${suggestion}`);
        }
      }
    });

    const healedData = rawData.map((row) => {
      const newRow = {};
      Object.keys(row).forEach((key) => {
        const newKey = healingMap[key] || key;
        newRow[newKey] = row[key];
      });
      return newRow;
    });

    return healedData;
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    setFileInput(selectedFile);
    if (!selectedFile) return;

    try {
      const rawData = await parseCSV(selectedFile);
      const healedData = healColumns(rawData);
      setDashboardData(healedData);
      setStatus("File loaded and columns self-healed.");
      setStatusType("success");
    } catch (error) {
      console.error("CSV parse error:", error);
      setStatus("Unable to parse the CSV file locally.");
      setStatusType("error");
    }
  };

  const handleUpload = async () => {
    if (!fileInput) {
      setStatus("Please select a file before uploading.");
      setStatusType("error");
      return;
    }

    setStatus("");
    setStatusType("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", fileInput);

      const res = await API.post("/upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setFile(fileInput);
      setStatus(`Upload successful! ${res.data.rows} rows loaded.`);
      setStatusType("success");
    } catch (error) {
      const message = error.response?.data?.detail || error.message || "Upload failed. Please try again.";
      setStatus(message);
      setStatusType("error");
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg mb-6" style={{ opacity: loading ? 0.3 : 1 }}>
      <h2 className="text-2xl font-semibold mb-4">📁 Upload Dataset</h2>

      <input
        type="file"
        onChange={handleFileChange}
        accept=".csv"
        className="mb-3"
      />

      <button
        onClick={handleUpload}
        disabled={loading || !fileInput}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {loading && (
        <div className="mt-3">
          <div className="spinner animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-center mt-2">Uploading your file...</p>
        </div>
      )}

      {status && (
        <p
          className={`mt-3 text-sm ${
            statusType === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {status}
        </p>
      )}
    </div>
  );
}

export default UploadBox;
