// src/components/DatasetUploader.jsx

import React, { useRef, useState } from "react";

const DatasetUploader = ({ onDatasetLoaded }) => {
  const fileInputRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [rowCount, setRowCount] = useState(0);

  const normalizeTransaction = (row) => {
    const normalized = {};

    Object.keys(row).forEach((key) => {
      const cleanKey = key
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "_");

      normalized[cleanKey] = row[key];
    });

    // Normalize common field names
    if (
      normalized.amount !== undefined &&
      normalized.amount !== ""
    ) {
      normalized.amount = Number(
        String(normalized.amount).replace(/,/g, "")
      );
    }

    if (normalized.status !== undefined) {
      normalized.status = String(
        normalized.status
      )
        .trim()
        .toLowerCase();
    }

    return normalized;
  };

  const validateTransactions = (rows) => {
    if (!Array.isArray(rows)) {
      return {
        valid: false,
        message: "Dataset must contain transaction records.",
      };
    }

    if (rows.length === 0) {
      return {
        valid: false,
        message: "The uploaded dataset is empty.",
      };
    }

    const normalizedRows = rows.map(
      normalizeTransaction
    );

    const requiredFields = [
      "status",
      "amount",
    ];

    const missingFields = requiredFields.filter(
      (field) =>
        !normalizedRows.some(
          (row) =>
            row[field] !== undefined &&
            row[field] !== ""
        )
    );

    if (missingFields.length > 0) {
      return {
        valid: false,
        message:
          "Missing required field(s): " +
          missingFields.join(", "),
      };
    }

    const validRows = normalizedRows.filter(
      (row) => {
        const amount = Number(row.amount);

        return (
          row.status !== undefined &&
          row.status !== "" &&
          !Number.isNaN(amount)
        );
      }
    );

    if (validRows.length === 0) {
      return {
        valid: false,
        message:
          "No valid transaction records were found.",
      };
    }

    return {
      valid: true,
      rows: validRows,
    };
  };

  // -----------------------------------------
  // CSV PARSER
  // -----------------------------------------

  const parseCSV = (text) => {
    const lines = text
      .split(/\r?\n/)
      .filter((line) => line.trim() !== "");

    if (lines.length < 2) {
      throw new Error(
        "CSV must contain a header and at least one transaction."
      );
    }

    const parseCSVLine = (line) => {
      const result = [];
      let current = "";
      let insideQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
          if (
            insideQuotes &&
            line[i + 1] === '"'
          ) {
            current += '"';
            i++;
          } else {
            insideQuotes = !insideQuotes;
          }
        } else if (
          char === "," &&
          !insideQuotes
        ) {
          result.push(current.trim());
          current = "";
        } else {
          current += char;
        }
      }

      result.push(current.trim());

      return result;
    };

    const headers = parseCSVLine(
      lines[0]
    ).map((header) =>
      header
        .replace(/^"|"$/g, "")
        .trim()
    );

    return lines.slice(1).map((line) => {
      const values = parseCSVLine(line);
      const row = {};

      headers.forEach((header, index) => {
        row[header] =
          values[index] !== undefined
            ? values[index].replace(
                /^"|"$/g,
                ""
              )
            : "";
      });

      return row;
    });
  };

  // -----------------------------------------
  // FILE PROCESSING
  // -----------------------------------------

  const processFile = (file) => {
    setError("");

    if (!file) {
      return;
    }

    const extension = file.name
      .split(".")
      .pop()
      .toLowerCase();

    if (
      extension !== "csv" &&
      extension !== "json"
    ) {
      setError(
        "Please upload a CSV or JSON dataset."
      );
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target.result;

        let rows;

        if (extension === "json") {
          const parsed = JSON.parse(text);

          if (Array.isArray(parsed)) {
            rows = parsed;
          } else if (
            Array.isArray(parsed.transactions)
          ) {
            rows = parsed.transactions;
          } else if (
            Array.isArray(parsed.data)
          ) {
            rows = parsed.data;
          } else {
            throw new Error(
              "JSON must contain an array of transactions."
            );
          }
        } else {
          rows = parseCSV(text);
        }

        const validation =
          validateTransactions(rows);

        if (!validation.valid) {
          setError(validation.message);
          setRowCount(0);
          return;
        }

        const allTransactions =
          validation.rows;

        /*
         * IMPORTANT:
         *
         * There is NO slice(), limit, or
         * fixed transaction count here.
         *
         * Every valid transaction from
         * the uploaded file is passed
         * forward.
         */

        setRowCount(
          allTransactions.length
        );

        onDatasetLoaded(
          allTransactions,
          file.name
        );

        setError("");
      } catch (err) {
        setRowCount(0);

        setError(
          err.message ||
            "Unable to process the dataset."
        );
      }
    };

    reader.onerror = () => {
      setError(
        "Unable to read the selected file."
      );
    };

    reader.readAsText(file);
  };

  // -----------------------------------------
  // FILE INPUT
  // -----------------------------------------

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    processFile(file);

    // Allows selecting the same file again
    event.target.value = "";
  };

  // -----------------------------------------
  // DRAG & DROP
  // -----------------------------------------

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const file =
      event.dataTransfer.files[0];

    processFile(file);
  };

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #dbe5f0",
        borderRadius: "16px",
        padding: "18px",
        marginBottom: "18px",
        boxShadow:
          "0 5px 18px rgba(15,23,42,0.05)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
          gap: "10px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "13px",
              fontWeight: "900",
              color: "#0f172a",
            }}
          >
            📁 Transaction Dataset
          </div>

          <div
            style={{
              fontSize: "9px",
              color: "#64748b",
              marginTop: "3px",
            }}
          >
            Upload CSV or JSON — all transactions
            will be analyzed.
          </div>
        </div>

        {rowCount > 0 && (
          <div
            style={{
              padding: "7px 10px",
              borderRadius: "20px",
              background: "#ecfdf5",
              border:
                "1px solid #bbf7d0",
              color: "#15803d",
              fontSize: "9px",
              fontWeight: "800",
              whiteSpace: "nowrap",
            }}
          >
            ✓ {rowCount.toLocaleString()}{" "}
            transactions
          </div>
        )}
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() =>
          fileInputRef.current?.click()
        }
        style={{
          border: isDragging
            ? "2px solid #1677ff"
            : "2px dashed #cbd5e1",
          borderRadius: "13px",
          padding: "22px 15px",
          textAlign: "center",
          cursor: "pointer",
          background: isDragging
            ? "#eff6ff"
            : "#f8fafc",
          transition: "all 0.2s ease",
        }}
      >
        <div
          style={{
            fontSize: "25px",
            marginBottom: "7px",
          }}
        >
          📎
        </div>

        <div
          style={{
            fontSize: "11px",
            fontWeight: "800",
            color: "#334155",
          }}
        >
          {isDragging
            ? "Drop your dataset here"
            : "Attach transaction dataset"}
        </div>

        <div
          style={{
            fontSize: "9px",
            color: "#94a3b8",
            marginTop: "5px",
          }}
        >
          Drag & drop or click to browse
        </div>

        <div
          style={{
            display: "inline-block",
            marginTop: "10px",
            padding: "7px 13px",
            borderRadius: "8px",
            background:
              "linear-gradient(135deg,#1677ff,#0b5cff)",
            color: "#ffffff",
            fontSize: "9px",
            fontWeight: "800",
          }}
        >
          Choose Dataset
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.json"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {fileName && rowCount > 0 && (
        <div
          style={{
            marginTop: "10px",
            padding: "9px 11px",
            borderRadius: "9px",
            background: "#f1f5f9",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span style={{ fontSize: "13px" }}>
            📄
          </span>

          <div
            style={{
              minWidth: 0,
              flex: 1,
            }}
          >
            <div
              style={{
                fontSize: "9px",
                fontWeight: "800",
                color: "#334155",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {fileName}
            </div>

            <div
              style={{
                fontSize: "8px",
                color: "#64748b",
                marginTop: "2px",
              }}
            >
              Complete dataset loaded successfully
            </div>
          </div>

          <span
            style={{
              fontSize: "9px",
              color: "#16a34a",
              fontWeight: "900",
            }}
          >
            READY
          </span>
        </div>
      )}

      {error && (
        <div
          style={{
            marginTop: "10px",
            padding: "9px 11px",
            borderRadius: "9px",
            background: "#fff1f2",
            border:
              "1px solid #fecdd3",
            color: "#be123c",
            fontSize: "9px",
            lineHeight: "1.5",
          }}
        >
          ⚠️ {error}
        </div>
      )}
    </div>
  );
};

export default DatasetUploader;