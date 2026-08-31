// src/components/PaymentMixChart.jsx

import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const PaymentMixChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div
        style={{
          height: "220px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#94a3b8",
          fontSize: "11px",
        }}
      >
        No payment data available
      </div>
    );
  }

  // Razorpay-inspired payment palette
  const paymentColors = {
    upi: "#1677FF",
    card: "#0B5CFF",
    wallet: "#6C4AB6",
    "net banking": "#00A88F",
    netbanking: "#00A88F",
    banking: "#00A88F",
    emi: "#F59E0B",
    other: "#64748B",
  };

  const getPaymentColor = (name) => {
    const key = String(name)
      .toLowerCase()
      .trim();

    if (paymentColors[key]) {
      return paymentColors[key];
    }

    if (key.includes("upi")) {
      return "#1677FF";
    }

    if (
      key.includes("card") ||
      key.includes("credit") ||
      key.includes("debit")
    ) {
      return "#0B5CFF";
    }

    if (
      key.includes("wallet") ||
      key.includes("paytm") ||
      key.includes("phonepe")
    ) {
      return "#6C4AB6";
    }

    if (
      key.includes("bank") ||
      key.includes("net")
    ) {
      return "#00A88F";
    }

    if (key.includes("emi")) {
      return "#F59E0B";
    }

    return "#64748B";
  };

  return (
    <div
      style={{
        width: "100%",
        height: "270px",
        position: "relative",
      }}
    >
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="48%"
            innerRadius={58}
            outerRadius={88}
            paddingAngle={3}
            stroke="#ffffff"
            strokeWidth={3}
            animationDuration={700}
          >
            {data.map(
              (entry, index) => (
                <Cell
                  key={`payment-${index}`}
                  fill={getPaymentColor(
                    entry.name
                  )}
                />
              )
            )}
          </Pie>

          <Tooltip
            formatter={(value, name) => [
              value.toLocaleString(),
              name,
            ]}
            contentStyle={{
              borderRadius: "10px",
              border:
                "1px solid #e2e8f0",
              boxShadow:
                "0 8px 20px rgba(15, 23, 42, 0.12)",
              fontSize: "11px",
            }}
          />

          <Legend
            verticalAlign="bottom"
            align="center"
            iconType="circle"
            wrapperStyle={{
              fontSize: "10px",
              paddingTop: "8px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* CENTER LABEL */}

      <div
        style={{
          position: "absolute",
          top: "48%",
          left: "50%",
          transform:
            "translate(-50%, -50%)",
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontSize: "9px",
            color: "#94a3b8",
            fontWeight: "600",
            letterSpacing:
              "0.5px",
          }}
        >
          PAYMENTS
        </div>

        <div
          style={{
            fontSize: "18px",
            fontWeight: "700",
            color: "#0f172a",
          }}
        >
          {data
            .reduce(
              (sum, item) =>
                sum + Number(item.value || 0),
              0
            )
            .toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default PaymentMixChart;