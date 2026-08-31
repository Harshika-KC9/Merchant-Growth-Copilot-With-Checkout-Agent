// src/components/SimulationChart.jsx

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

const SimulationChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return null;
  }

  // -----------------------------------------
  // FORMAT LARGE REVENUE VALUES
  // -----------------------------------------

  const formatRevenue = (value) => {
    const number = Number(value) || 0;

    if (number >= 10000000) {
      return `₹${(number / 10000000).toFixed(1)}Cr`;
    }

    if (number >= 100000) {
      return `₹${(number / 100000).toFixed(1)}L`;
    }

    if (number >= 1000) {
      return `₹${(number / 1000).toFixed(1)}K`;
    }

    return `₹${Math.round(number)}`;
  };

  // -----------------------------------------
  // FULL REVENUE VALUE FOR TOOLTIP
  // -----------------------------------------

  const formatFullRevenue = (value) => {
    return `₹${Number(value || 0).toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 0,
      }
    )}`;
  };

  // -----------------------------------------
  // FIND CURRENT / PROJECTED / LIFT
  // -----------------------------------------

  const currentRevenue =
    data.find(
      (item) =>
        item.scenario ===
        "Current Revenue"
    )?.revenue || 0;

  const projectedRevenue =
    data.find(
      (item) =>
        item.scenario ===
        "Projected Revenue"
    )?.revenue || 0;

  const revenueLift =
    data.find(
      (item) =>
        item.scenario ===
        "Revenue Lift"
    )?.revenue || 0;

  const liftPercentage =
    data.find(
      (item) =>
        item.scenario ===
        "Revenue Lift"
    )?.liftPercentage || 0;

  // -----------------------------------------
  // CHART DATA
  // -----------------------------------------

  const chartData = [
    {
      scenario: "Current",
      revenue: currentRevenue,
    },
    {
      scenario: "After Fix",
      revenue: projectedRevenue,
    },
  ];

  // -----------------------------------------
  // CUSTOM TOOLTIP
  // -----------------------------------------

  const CustomTooltip = ({
    active,
    payload,
  }) => {
    if (
      !active ||
      !payload ||
      payload.length === 0
    ) {
      return null;
    }

    const value =
      payload[0].value;

    return (
      <div
        style={{
          background: "#0f172a",
          color: "#ffffff",
          padding: "10px 12px",
          borderRadius: "9px",
          boxShadow:
            "0 8px 20px rgba(15,23,42,0.25)",
          border:
            "1px solid #334155",
        }}
      >
        <div
          style={{
            fontSize: "9px",
            color: "#94a3b8",
            marginBottom: "4px",
          }}
        >
          Projected Revenue
        </div>

        <div
          style={{
            fontSize: "13px",
            fontWeight: "900",
          }}
        >
          {formatFullRevenue(value)}
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        marginTop: "14px",
        padding: "14px",
        borderRadius: "12px",
        background:
          "linear-gradient(145deg,#ffffff,#f8fafc)",
        border:
          "1px solid #dbe5f0",
        boxShadow:
          "0 5px 18px rgba(15,23,42,0.06)",
      }}
    >
      {/* -------------------------------- */}
      {/* HEADER */}
      {/* -------------------------------- */}

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "flex-start",
          gap: "10px",
          marginBottom: "10px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "12px",
              fontWeight: "900",
              color: "#0f172a",
            }}
          >
            📈 Revenue Lift
          </div>

          <div
            style={{
              fontSize: "8px",
              color: "#64748b",
              marginTop: "3px",
            }}
          >
            Projected from your uploaded
            transaction dataset
          </div>
        </div>

        {/* LIFT BADGE */}

        <div
          style={{
            padding: "7px 10px",
            borderRadius: "9px",
            background:
              "linear-gradient(135deg,#ecfdf5,#dcfce7)",
            border:
              "1px solid #bbf7d0",
            textAlign: "right",
            minWidth: "75px",
          }}
        >
          <div
            style={{
              fontSize: "7px",
              color: "#64748b",
              fontWeight: "800",
            }}
          >
            POTENTIAL LIFT
          </div>

          <div
            style={{
              fontSize: "14px",
              color: "#15803d",
              fontWeight: "900",
              marginTop: "2px",
            }}
          >
            +{Number(
              liftPercentage
            ).toFixed(1)}
            %
          </div>
        </div>
      </div>

      {/* -------------------------------- */}
      {/* REVENUE SUMMARY */}
      {/* -------------------------------- */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          gap: "8px",
          marginBottom: "12px",
        }}
      >
        <div
          style={{
            padding: "9px",
            borderRadius: "9px",
            background: "#0f172a",
            color: "#ffffff",
            minWidth: 0,
          }}
        >
          <div
            style={{
              fontSize: "7px",
              color: "#94a3b8",
              fontWeight: "800",
            }}
          >
            CURRENT
          </div>

          <div
            style={{
              fontSize: "13px",
              fontWeight: "900",
              marginTop: "3px",
              overflow: "hidden",
              textOverflow:
                "ellipsis",
              whiteSpace:
                "nowrap",
            }}
            title={formatFullRevenue(
              currentRevenue
            )}
          >
            {formatRevenue(
              currentRevenue
            )}
          </div>
        </div>

        <div
          style={{
            padding: "9px",
            borderRadius: "9px",
            background: "#f0fdf4",
            border:
              "1px solid #bbf7d0",
            minWidth: 0,
          }}
        >
          <div
            style={{
              fontSize: "7px",
              color: "#64748b",
              fontWeight: "800",
            }}
          >
            AFTER FIX
          </div>

          <div
            style={{
              fontSize: "13px",
              fontWeight: "900",
              color: "#15803d",
              marginTop: "3px",
              overflow: "hidden",
              textOverflow:
                "ellipsis",
              whiteSpace:
                "nowrap",
            }}
            title={formatFullRevenue(
              projectedRevenue
            )}
          >
            {formatRevenue(
              projectedRevenue
            )}
          </div>
        </div>
      </div>

      {/* -------------------------------- */}
      {/* BAR CHART */}
      {/* -------------------------------- */}

      <div
        style={{
          width: "100%",
          height: "250px",
        }}
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart
            data={chartData}
            margin={{
              top: 15,
              right: 15,
              left: 5,
              bottom: 5,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e2e8f0"
            />

            <XAxis
              dataKey="scenario"
              tick={{
                fontSize: 9,
                fontWeight: 800,
                fill: "#0f172a",
              }}
              axisLine={{
                stroke: "#0f172a",
              }}
              tickLine={{
                stroke: "#0f172a",
              }}
            />

            <YAxis
              tickFormatter={
                formatRevenue
              }
              tick={{
                fontSize: 8,
                fontWeight: 900,
                fill: "#0f172a",
              }}
              axisLine={{
                stroke: "#0f172a",
                strokeWidth: 2,
              }}
              tickLine={{
                stroke: "#0f172a",
              }}
              width={58}
            />

            <Tooltip
              content={
                <CustomTooltip />
              }
              cursor={{
                fill: "#f1f5f9",
              }}
            />

            <Bar
              dataKey="revenue"
              radius={[
                8,
                8,
                0,
                0,
              ]}
              maxBarSize={70}
            >
              <Cell fill="#111827" />
              <Cell fill="#16a34a" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* -------------------------------- */}
      {/* DATA-DRIVEN EXPLANATION */}
      {/* -------------------------------- */}

      <div
        style={{
          marginTop: "8px",
          padding: "9px 10px",
          borderRadius: "8px",
          background: "#f8fafc",
          border:
            "1px solid #e2e8f0",
          fontSize: "8px",
          color: "#475569",
          lineHeight: "1.5",
        }}
      >
        <strong
          style={{
            color: "#0f172a",
          }}
        >
          AI projection:
        </strong>{" "}
        Based on the failed transaction
        value in your uploaded dataset,
        the simulation projects{" "}
        <strong
          style={{
            color: "#15803d",
          }}
        >
          {formatFullRevenue(
            revenueLift
          )}
        </strong>{" "}
        in potential recovered revenue.
      </div>
    </div>
  );
};

export default SimulationChart;