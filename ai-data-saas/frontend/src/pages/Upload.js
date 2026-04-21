import React, { useState } from "react";
import API from "../api/api";

function Upload() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await API.post("/upload/", formData);
    setResult(JSON.stringify(res.data));
  };

  return (
    <div>
      <h2>Upload Dataset</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>

      <pre>{result}</pre>
    </div>
  );
}

export default Upload;
