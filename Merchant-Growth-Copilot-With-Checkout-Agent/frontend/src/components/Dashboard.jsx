// src/components/Dashboard.jsx

import React from "react";
import SimulationChart from "./SimulationChart";
import PaymentMixChart from "./PaymentMixChart";
import FixHistory from "./FixHistory";

const Dashboard = ({
  activeDataset,
  simulationData,
  fixedTransactions,
  fixHistory,
  onClearHistory,
}) => {
  // -----------------------------------------
  // ACTIVE DATASET
  // -----------------------------------------

  const dataset =
    fixedTransactions &&
    fixedTransactions.length > 0
      ? fixedTransactions
      : activeDataset || [];

  const hasDataset = dataset.length > 0;

  // -----------------------------------------
  // PAYMENT METHOD MIX
  // -----------------------------------------

  const paymentCounts = dataset.reduce(
    (acc, transaction) => {
      const method =
        transaction.payment_method ||
        transaction.paymentMethod ||
        "Unknown";

      acc[method] = (acc[method] || 0) + 1;

      return acc;
    },
    {}
  );

  const paymentData = Object.keys(paymentCounts).map(
    (method) => ({
      name: method,
      value: paymentCounts[method],
    })
  );

  // -----------------------------------------
  // DEVICE MIX
  // -----------------------------------------

  const deviceCounts = dataset.reduce(
    (acc, transaction) => {
      const device =
        transaction.device_type ||
        transaction.deviceType ||
        "Unknown";

      acc[device] = (acc[device] || 0) + 1;

      return acc;
    },
    {}
  );

  const deviceData = Object.keys(deviceCounts).map(
    (device) => ({
      name: device,
      value: deviceCounts[device],
    })
  );

  // -----------------------------------------
  // CITY TIER MIX
  // -----------------------------------------

  const cityTierCounts = dataset.reduce(
    (acc, transaction) => {
      const tier =
        transaction.city_tier ||
        transaction.cityTier ||
        "Unknown";

      acc[tier] = (acc[tier] || 0) + 1;

      return acc;
    },
    {}
  );

  const cityTierData = Object.keys(cityTierCounts).map(
    (tier) => ({
      name: tier,
      value: cityTierCounts[tier],
    })
  );

  // -----------------------------------------
  // TRANSACTION HEALTH
  // -----------------------------------------

  const successfulTransactions = dataset.filter(
    (transaction) =>
      String(
        transaction.status ?? ""
      ).toLowerCase() === "success"
  ).length;

  const failedTransactions =
    dataset.length - successfulTransactions;

  const successRate =
    dataset.length > 0
      ? (
          (successfulTransactions /
            dataset.length) *
          100
        ).toFixed(1)
      : 0;

  // -----------------------------------------
  // CURRENT REVENUE
  // -----------------------------------------

  const currentRevenue = dataset
    .filter(
      (transaction) =>
        String(
          transaction.status ?? ""
        ).toLowerCase() === "success"
    )
    .reduce(
      (sum, transaction) =>
        sum +
        (Number(transaction.amount) || 0),
      0
    );

  // -----------------------------------------
  // FAILED REVENUE
  // -----------------------------------------

  const failedRevenue = dataset
    .filter(
      (transaction) =>
        String(
          transaction.status ?? ""
        ).toLowerCase() !== "success"
    )
    .reduce(
      (sum, transaction) =>
        sum +
        (Number(transaction.amount) || 0),
      0
    );

  // -----------------------------------------
  // UI
  // -----------------------------------------

  return (
    <div
      className="dashboard"
      style={{
        border:
          "1px solid #dbe5f0",
        padding: "14px",
        borderRadius: "12px",
        background: "#ffffff",
        boxShadow:
          "0 5px 18px rgba(15,23,42,0.05)",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          marginBottom: "14px",
        }}
      >
        <h2
          style={{
            margin: 0,
            color: "#0f172a",
            fontSize: "18px",
            fontWeight: "900",
          }}
        >
          📊 Growth Dashboard
        </h2>

        <p
          style={{
            margin: "4px 0 0",
            fontSize: "9px",
            color: "#64748b",
          }}
        >
          Real-time insights from your
          transaction dataset
        </p>
      </div>

      {/* EMPTY STATE */}

      {!hasDataset && (
        <div
          style={{
            minHeight: "300px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            background:
              "linear-gradient(135deg,#f8fafc,#eff6ff)",
            border:
              "1px dashed #cbd5e1",
            borderRadius: "14px",
            padding: "25px",
          }}
        >
          <div
            style={{
              fontSize: "42px",
            }}
          >
            📈
          </div>

          <div
            style={{
              fontSize: "14px",
              fontWeight: "900",
              color: "#334155",
              marginTop: "8px",
            }}
          >
            Your dashboard is ready
          </div>

          <div
            style={{
              maxWidth: "280px",
              fontSize: "10px",
              lineHeight: "1.6",
              color: "#64748b",
              marginTop: "6px",
            }}
          >
            Upload a transaction dataset
            to generate payment insights,
            revenue analysis and
            simulations.
          </div>
        </div>
      )}

      {/* DASHBOARD CONTENT */}

      {hasDataset && (
        <>
          {/* DATASET SIZE */}

          <div
            style={{
              display: "inline-block",
              background: "#eff6ff",
              color: "#1d4ed8",
              padding: "6px 10px",
              borderRadius: "20px",
              fontSize: "9px",
              fontWeight: "900",
              marginBottom: "12px",
            }}
          >
            {dataset.length.toLocaleString()}{" "}
            records analyzed
          </div>

          {/* KPI CARDS */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(3, 1fr)",
              gap: "8px",
              marginBottom: "14px",
            }}
          >
            {/* SUCCESS RATE */}

            <div
              style={{
                padding: "12px",
                borderRadius: "10px",
                background: "#f0fdf4",
                border:
                  "1px solid #bbf7d0",
              }}
            >
              <div
                style={{
                  fontSize: "8px",
                  color: "#64748b",
                  fontWeight: "700",
                }}
              >
                SUCCESS RATE
              </div>

              <div
                style={{
                  marginTop: "4px",
                  fontSize: "18px",
                  fontWeight: "900",
                  color: "#15803d",
                }}
              >
                {successRate}%
              </div>
            </div>

            {/* SUCCESSFUL */}

            <div
              style={{
                padding: "12px",
                borderRadius: "10px",
                background: "#eff6ff",
                border:
                  "1px solid #bfdbfe",
              }}
            >
              <div
                style={{
                  fontSize: "8px",
                  color: "#64748b",
                  fontWeight: "700",
                }}
              >
                SUCCESSFUL
              </div>

              <div
                style={{
                  marginTop: "4px",
                  fontSize: "18px",
                  fontWeight: "900",
                  color: "#2563eb",
                }}
              >
                {successfulTransactions.toLocaleString()}
              </div>
            </div>

            {/* FAILED */}

            <div
              style={{
                padding: "12px",
                borderRadius: "10px",
                background: "#fff7ed",
                border:
                  "1px solid #fed7aa",
              }}
            >
              <div
                style={{
                  fontSize: "8px",
                  color: "#64748b",
                  fontWeight: "700",
                }}
              >
                FAILED
              </div>

              <div
                style={{
                  marginTop: "4px",
                  fontSize: "18px",
                  fontWeight: "900",
                  color: "#ea580c",
                }}
              >
                {failedTransactions.toLocaleString()}
              </div>
            </div>
          </div>

          {/* REVENUE SUMMARY */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr",
              gap: "8px",
              marginBottom: "14px",
            }}
          >
            {/* CURRENT REVENUE */}

            <div
              style={{
                padding: "11px",
                borderRadius: "10px",
                background: "#0f172a",
                color: "#ffffff",
              }}
            >
              <div
                style={{
                  fontSize: "8px",
                  opacity: 0.7,
                }}
              >
                CURRENT REVENUE
              </div>

              <div
                style={{
                  marginTop: "5px",
                  fontSize: "15px",
                  fontWeight: "900",
                  overflow: "hidden",
                  textOverflow:
                    "ellipsis",
                  whiteSpace:
                    "nowrap",
                }}
                title={`₹${currentRevenue.toLocaleString()}`}
              >
                ₹
                {currentRevenue.toLocaleString(
                  undefined,
                  {
                    maximumFractionDigits: 0,
                  }
                )}
              </div>
            </div>

            {/* FAILED REVENUE */}

            <div
              style={{
                padding: "11px",
                borderRadius: "10px",
                background: "#f8fafc",
                border:
                  "1px solid #e2e8f0",
              }}
            >
              <div
                style={{
                  fontSize: "8px",
                  color: "#64748b",
                }}
              >
                FAILED REVENUE
              </div>

              <div
                style={{
                  marginTop: "5px",
                  fontSize: "15px",
                  fontWeight: "900",
                  color: "#dc2626",
                  overflow: "hidden",
                  textOverflow:
                    "ellipsis",
                  whiteSpace:
                    "nowrap",
                }}
                title={`₹${failedRevenue.toLocaleString()}`}
              >
                ₹
                {failedRevenue.toLocaleString(
                  undefined,
                  {
                    maximumFractionDigits: 0,
                  }
                )}
              </div>
            </div>
          </div>

          {/* PAYMENT MIX */}

          <PaymentMixChart
            data={paymentData}
          />

          {/* REVENUE LIFT */}

          {simulationData &&
            simulationData.length > 0 && (
              <SimulationChart
                data={simulationData}
              />
            )}

          {/* DEVICE + CITY */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr",
              gap: "10px",
              marginTop: "14px",
              marginBottom: "14px",
            }}
          >
            {/* DEVICE MIX */}

            <div
              style={{
                border:
                  "1px solid #e2e8f0",
                borderRadius: "10px",
                padding: "12px",
                background:
                  "#ffffff",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: "900",
                  color: "#0f172a",
                  marginBottom: "8px",
                }}
              >
                📱 Device Mix
              </div>

              {deviceData.map(
                (item) => {
                  const percentage =
                    (item.value /
                      dataset.length) *
                    100;

                  return (
                    <div
                      key={item.name}
                      style={{
                        marginBottom:
                          "7px",
                      }}
                    >
                      <div
                        style={{
                          display:
                            "flex",
                          justifyContent:
                            "space-between",
                          fontSize:
                            "8px",
                          color:
                            "#475569",
                        }}
                      >
                        <span>
                          {item.name}
                        </span>

                        <strong>
                          {item.value}
                        </strong>
                      </div>

                      <div
                        style={{
                          height: "5px",
                          background:
                            "#e2e8f0",
                          borderRadius:
                            "10px",
                          overflow:
                            "hidden",
                          marginTop:
                            "3px",
                        }}
                      >
                        <div
                          style={{
                            width: `${percentage}%`,
                            height:
                              "100%",
                            background:
                              "linear-gradient(90deg,#1677ff,#38bdf8)",
                            borderRadius:
                              "10px",
                          }}
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div>

            {/* CITY TIER MIX */}

            <div
              style={{
                border:
                  "1px solid #e2e8f0",
                borderRadius: "10px",
                padding: "12px",
                background:
                  "#ffffff",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: "900",
                  color: "#0f172a",
                  marginBottom: "8px",
                }}
              >
                🏙️ City Tier Mix
              </div>

              {cityTierData.map(
                (item) => {
                  const percentage =
                    (item.value /
                      dataset.length) *
                    100;

                  return (
                    <div
                      key={item.name}
                      style={{
                        marginBottom:
                          "7px",
                      }}
                    >
                      <div
                        style={{
                          display:
                            "flex",
                          justifyContent:
                            "space-between",
                          fontSize:
                            "8px",
                          color:
                            "#475569",
                        }}
                      >
                        <span>
                          {item.name}
                        </span>

                        <strong>
                          {item.value}
                        </strong>
                      </div>

                      <div
                        style={{
                          height: "5px",
                          background:
                            "#e2e8f0",
                          borderRadius:
                            "10px",
                          overflow:
                            "hidden",
                          marginTop:
                            "3px",
                        }}
                      >
                        <div
                          style={{
                            width: `${percentage}%`,
                            height:
                              "100%",
                            background:
                              "linear-gradient(90deg,#7c3aed,#c084fc)",
                            borderRadius:
                              "10px",
                          }}
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          {/* FIX HISTORY */}

          <FixHistory
            history={fixHistory}
            onClear={onClearHistory}
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;