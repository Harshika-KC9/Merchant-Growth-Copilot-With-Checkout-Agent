// src/components/ActionButtons.jsx

import React, { useState } from "react";

const ActionButtons = ({ onSimulate, onImplement }) => {
  const [hoveredButton, setHoveredButton] = useState(null);

  const handleSimulate = () => {
    if (onSimulate) {
      onSimulate();
    }
  };

  const handleImplement = () => {
    if (onImplement) {
      onImplement();
    }
  };

  return (
    <div
      style={{
        marginTop: "14px",
        paddingTop: "12px",
        borderTop: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      {/* AI Recommendation Label */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "7px",
          fontSize: "12px",
          fontWeight: "600",
          color: "#64748b",
        }}
      >
        <span style={{ fontSize: "15px" }}>✨</span>

        <span>Recommended next actions</span>
      </div>

      {/* Buttons */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
        }}
      >
        {/* Simulate Button */}
        <button
          onClick={handleSimulate}
          onMouseEnter={() => setHoveredButton("simulate")}
          onMouseLeave={() => setHoveredButton(null)}
          title="Preview the expected revenue improvement before applying the fix"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "7px",
            padding: "9px 14px",
            border:
              hoveredButton === "simulate"
                ? "1px solid #16a34a"
                : "1px solid #86efac",
            borderRadius: "9px",
            background:
              hoveredButton === "simulate" ? "#f0fdf4" : "#ffffff",
            color: "#15803d",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow:
              hoveredButton === "simulate"
                ? "0 3px 10px rgba(22, 163, 74, 0.15)"
                : "none",
            transform:
              hoveredButton === "simulate"
                ? "translateY(-1px)"
                : "translateY(0)",
          }}
        >
          <span style={{ fontSize: "15px" }}>📈</span>
          <span>Simulate Fix</span>
        </button>

        {/* Implement Button */}
        <button
          onClick={handleImplement}
          onMouseEnter={() => setHoveredButton("implement")}
          onMouseLeave={() => setHoveredButton(null)}
          title="Apply the recommended fix to recover failed transactions"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "7px",
            padding: "9px 14px",
            border:
              hoveredButton === "implement"
                ? "1px solid #2563eb"
                : "1px solid #93c5fd",
            borderRadius: "9px",
            background:
              hoveredButton === "implement"
                ? "linear-gradient(135deg, #2563eb, #1d4ed8)"
                : "linear-gradient(135deg, #3b82f6, #2563eb)",
            color: "#ffffff",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow:
              hoveredButton === "implement"
                ? "0 4px 12px rgba(37, 99, 235, 0.3)"
                : "0 2px 6px rgba(37, 99, 235, 0.15)",
            transform:
              hoveredButton === "implement"
                ? "translateY(-1px)"
                : "translateY(0)",
          }}
        >
          <span style={{ fontSize: "15px" }}>⚡</span>
          <span>Implement Fix</span>
        </button>
      </div>

      {/* Helper Text */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          fontSize: "11px",
          color: "#94a3b8",
        }}
      >
        <span>💡</span>
        <span>
          Simulate first to preview the potential revenue impact.
        </span>
      </div>
    </div>
  );
};

export default ActionButtons;