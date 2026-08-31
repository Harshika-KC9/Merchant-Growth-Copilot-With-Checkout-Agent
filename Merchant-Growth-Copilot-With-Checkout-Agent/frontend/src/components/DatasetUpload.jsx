// src/components/DatasetUpload.jsx

import React, { useRef, useState } from "react";
import { parseDataset } from "../utils/datasetParser";

const DatasetUpload = ({ onDatasetLoaded }) => {
  const fileInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file) => {
    if (!file) return;

    setError("");
    setIsLoading(true);

    try {
      const result = await parseDataset(file);

      onDatasetLoaded(result);
    } catch (err) {
      setError(
        err.message || "Unable to process dataset."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    handleFile(file);

    // Allow selecting the same file again
    event.target.value = "";
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Hidden file input */}

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.json"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {/* Attachment button */}

      <button
        type="button"
        onClick={() =>
          fileInputRef.current?.click()
        }
        disabled={isLoading}
        title="Attach CSV or JSON dataset"
        style={{
          width: "38px",
          height: "38px",
          borderRadius: "10px",
          border: "1px solid #cbd5e1",
          background: "#f8fafc",
          color: "#475569",
          cursor: isLoading
            ? "not-allowed"
            : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
          transition: "all 0.2s ease",
        }}
      >
        {isLoading ? "⏳" : "📎"}
      </button>

      {/* Error */}

      {error && (
        <div
          style={{
            position: "absolute",
            bottom: "48px",
            left: 0,
            width: "240px",
            padding: "9px 11px",
            borderRadius: "9px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#b91c1c",
            fontSize: "10px",
            lineHeight: "1.4",
            boxShadow:
              "0 5px 15px rgba(0,0,0,0.08)",
            zIndex: 10,
          }}
        >
          ❌ {error}
        </div>
      )}
    </div>
  );
};

export default DatasetUpload;