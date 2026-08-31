// src/components/FixHistory.jsx

import React from "react";

const FixHistory = ({ history = [], onClear }) => {
  // =====================================================
  // GET ICON
  // =====================================================

  const getIcon = (description = "") => {
    const text = String(description).toLowerCase();

    if (
      text.includes("simulation") ||
      text.includes("revenue lift")
    ) {
      return "📈";
    }

    if (
      text.includes("fix") ||
      text.includes("implemented") ||
      text.includes("optimization") ||
      text.includes("optimized")
    ) {
      return "🔧";
    }

    if (
      text.includes("recommend") ||
      text.includes("suggestion") ||
      text.includes("diagnos")
    ) {
      return "💡";
    }

    return "📝";
  };

  // =====================================================
  // EXPORT CSV
  // =====================================================

  const exportCSV = () => {
    if (history.length === 0) {
      return;
    }

    const headers = [
      "Timestamp",
      "Description",
    ];

    const rows = history.map((item) => [
      item.timestamp || "",
      item.description || "",
    ]);

    const csvContent = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map((value) => {
            const text = String(value);

            // Escape quotes and commas correctly
            if (
              text.includes(",") ||
              text.includes('"') ||
              text.includes("\n")
            ) {
              return `"${text.replace(
                /"/g,
                '""'
              )}"`;
            }

            return text;
          })
          .join(",")
      )
      .join("\n");

    const blob = new Blob(
      [csvContent],
      {
        type:
          "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.setAttribute(
      "download",
      "fix_history.csv"
    );

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // =====================================================
  // EXPORT JSON
  // =====================================================

  const exportJSON = () => {
    if (history.length === 0) {
      return;
    }

    const jsonContent =
      JSON.stringify(
        history,
        null,
        2
      );

    const blob = new Blob(
      [jsonContent],
      {
        type:
          "application/json",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.setAttribute(
      "download",
      "fix_history.json"
    );

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div
      style={{
        marginTop: "20px",
        border:
          "1px solid #dbe5f0",
        borderRadius: "12px",
        padding: "14px",
        background: "#ffffff",
        boxShadow:
          "0 4px 15px rgba(15,23,42,0.04)",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent:
            "space-between",
          gap: "10px",
          marginBottom: "12px",
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              color: "#0f172a",
              fontSize: "14px",
              fontWeight: "900",
            }}
          >
            🔧 Fix History
          </h3>

          <p
            style={{
              margin:
                "4px 0 0",
              fontSize: "9px",
              color: "#64748b",
            }}
          >
            Fixes and revenue actions applied
            during this analysis.
          </p>
        </div>

        {history.length > 0 && (
          <div
            style={{
              padding:
                "5px 9px",
              borderRadius: "20px",
              background:
                "#eff6ff",
              color:
                "#2563eb",
              fontSize: "9px",
              fontWeight: "900",
              whiteSpace:
                "nowrap",
            }}
          >
            {history.length}{" "}
            {history.length === 1
              ? "action"
              : "actions"}
          </div>
        )}
      </div>

      {/* EMPTY STATE */}

      {history.length === 0 ? (
        <div
          style={{
            padding: "18px",
            textAlign: "center",
            border:
              "1px dashed #cbd5e1",
            borderRadius: "10px",
            background:
              "#f8fafc",
          }}
        >
          <div
            style={{
              fontSize: "24px",
              marginBottom: "6px",
            }}
          >
            🔧
          </div>

          <div
            style={{
              fontSize: "10px",
              fontWeight: "800",
              color: "#475569",
            }}
          >
            No fixes applied yet
          </div>

          <div
            style={{
              fontSize: "9px",
              color: "#94a3b8",
              marginTop: "4px",
            }}
          >
            Ask the AI Co-Pilot to diagnose
            and improve your revenue leaks.
          </div>
        </div>
      ) : (
        <>
          {/* HISTORY LIST */}

          <div
            style={{
              display: "flex",
              flexDirection:
                "column",
              gap: "8px",
            }}
          >
            {history.map(
              (fix, index) => {
                const description =
                  fix.description ||
                  "Revenue action completed.";

                return (
                  <div
                    key={
                      `${fix.timestamp || "action"}-${index}`
                    }
                    style={{
                      padding:
                        "10px 12px",
                      background:
                        "#f8fafc",
                      border:
                        "1px solid #e2e8f0",
                      borderRadius:
                        "10px",
                    }}
                  >
                    <div
                      style={{
                        display:
                          "flex",
                        alignItems:
                          "flex-start",
                        gap: "9px",
                      }}
                    >
                      {/* ICON */}

                      <div
                        style={{
                          width:
                            "28px",
                          height:
                            "28px",
                          flexShrink: 0,
                          borderRadius:
                            "8px",
                          background:
                            "#eff6ff",
                          display:
                            "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                          fontSize:
                            "14px",
                        }}
                      >
                        {getIcon(
                          description
                        )}
                      </div>

                      {/* DETAILS */}

                      <div
                        style={{
                          minWidth: 0,
                          flex: 1,
                        }}
                      >
                        <div
                          style={{
                            fontSize:
                              "9px",
                            fontWeight:
                              "900",
                            color:
                              "#0f172a",
                            lineHeight:
                              "1.4",
                          }}
                        >
                          {description}
                        </div>

                        {fix.timestamp && (
                          <div
                            style={{
                              marginTop:
                                "4px",
                              fontSize:
                                "8px",
                              color:
                                "#94a3b8",
                            }}
                          >
                            {fix.timestamp}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>

          {/* ACTION BUTTONS */}

          <div
            style={{
              marginTop: "12px",
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            <button
              onClick={exportCSV}
              style={{
                padding:
                  "7px 10px",
                background:
                  "#16a34a",
                color:
                  "#ffffff",
                border: "none",
                borderRadius:
                  "7px",
                cursor:
                  "pointer",
                fontSize:
                  "8px",
                fontWeight:
                  "800",
              }}
            >
              Export CSV
            </button>

            <button
              onClick={exportJSON}
              style={{
                padding:
                  "7px 10px",
                background:
                  "#2563eb",
                color:
                  "#ffffff",
                border: "none",
                borderRadius:
                  "7px",
                cursor:
                  "pointer",
                fontSize:
                  "8px",
                fontWeight:
                  "800",
              }}
            >
              Export JSON
            </button>

            <button
              onClick={onClear}
              style={{
                padding:
                  "7px 10px",
                background:
                  "#dc2626",
                color:
                  "#ffffff",
                border: "none",
                borderRadius:
                  "7px",
                cursor:
                  "pointer",
                fontSize:
                  "8px",
                fontWeight:
                  "800",
              }}
            >
              Clear History
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default FixHistory;