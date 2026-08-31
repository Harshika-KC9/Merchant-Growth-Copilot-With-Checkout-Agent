// src/components/FunnelChart.jsx

import React from "react";
import {
  ResponsiveContainer,
  FunnelChart as RechartsFunnelChart,
  Funnel,
  LabelList,
  Tooltip,
  Cell,
} from "recharts";

const FunnelChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return null;
  }

  // Different color for every funnel stage
  const funnelColors = [
    "#2563EB",
    "#4F46E5",
    "#7C3AED",
    "#9333EA",
    "#C026D3",
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "350px",
        overflow: "visible",
      }}
    >
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <RechartsFunnelChart
          margin={{
            top: 15,
            right: 20,
            bottom: 15,
            left: 125,
          }}
        >
          <Tooltip
            formatter={(value) =>
              value.toLocaleString()
            }
            contentStyle={{
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
              boxShadow:
                "0 8px 20px rgba(15, 23, 42, 0.12)",
            }}
          />

          <Funnel
            data={data}
            dataKey="users"
            nameKey="stage"
            isAnimationActive={true}
          >
            {data.map(
              (entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    funnelColors[
                      index %
                        funnelColors.length
                    ]
                  }
                />
              )
            )}

            {/* Stage names */}
            <LabelList
              position="left"
              dataKey="stage"
              fill="#334155"
              stroke="none"
              style={{
                fontSize: "11px",
                fontWeight: "600",
              }}
            />

            {/* Numbers inside funnel */}
            <LabelList
              position="center"
              dataKey="users"
              fill="#ffffff"
              stroke="none"
              formatter={(value) =>
                value.toLocaleString()
              }
              style={{
                fontSize: "12px",
                fontWeight: "700",
              }}
            />
          </Funnel>
        </RechartsFunnelChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FunnelChart;