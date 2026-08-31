// src/components/HistoryPanel.jsx

import React from "react";

const HistoryPanel = ({
  history,
  onDeleteHistory,
  onClearAllHistory,
}) => {
  return (
    <div
      style={{
        border: "1px solid #dbe5f0",
        borderRadius: "12px",
        padding: "14px",
        background: "#ffffff",
        boxShadow:
          "0 5px 18px rgba(15,23,42,0.05)",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "11px",
              fontWeight: "900",
              color: "#0f172a",
            }}
          >
            🔍 Recent Analyses
          </div>

          <div
            style={{
              fontSize: "8px",
              color: "#64748b",
              marginTop: "3px",
            }}
          >
            Your previous dataset analysis sessions
          </div>
        </div>

        {history && history.length > 0 && (
          <button
            type="button"
            onClick={onClearAllHistory}
            style={{
              border: "none",
              background: "transparent",
              color: "#dc2626",
              cursor: "pointer",
              fontSize: "8px",
              fontWeight: "800",
              padding: "4px 6px",
            }}
          >
            Clear All
          </button>
        )}
      </div>

      {/* EMPTY STATE */}

      {(!history || history.length === 0) && (
        <div
          style={{
            padding: "22px 10px",
            textAlign: "center",
            borderRadius: "10px",
            background: "#f8fafc",
            border: "1px dashed #cbd5e1",
          }}
        >
          <div
            style={{
              fontSize: "24px",
              marginBottom: "6px",
            }}
          >
            🔍
          </div>

          <div
            style={{
              fontSize: "10px",
              fontWeight: "800",
              color: "#475569",
            }}
          >
            No recent analyses
          </div>

          <div
            style={{
              fontSize: "8px",
              color: "#94a3b8",
              marginTop: "4px",
            }}
          >
            Upload a dataset to start your first analysis.
          </div>
        </div>
      )}

      {/* HISTORY LIST */}

      {history && history.length > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {history.map((session) => (
            <div
              key={session.id}
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                padding: "10px",
                background: "#f8fafc",
              }}
            >
              {/* SESSION HEADER */}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    minWidth: 0,
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: "900",
                      color: "#0f172a",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={session.datasetName}
                  >
                    {session.datasetName ||
                      "Untitled Dataset"}
                  </div>

                  <div
                    style={{
                      fontSize: "8px",
                      color: "#64748b",
                      marginTop: "3px",
                    }}
                  >
                    {session.transactionCount?.toLocaleString() ||
                      0}{" "}
                    transactions
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onDeleteHistory(session.id)
                  }
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "#94a3b8",
                    cursor: "pointer",
                    fontSize: "11px",
                    padding: "2px 4px",
                  }}
                  title="Delete analysis"
                >
                  🗑️
                </button>
              </div>

              {/* SESSION DESCRIPTION */}

              {session.description && (
                <div
                  style={{
                    fontSize: "8px",
                    color: "#64748b",
                    marginTop: "7px",
                    lineHeight: "1.5",
                  }}
                >
                  {session.description}
                </div>
              )}

              {/* ACTIVITIES */}

              {session.activities &&
                session.activities.length > 0 && (
                  <div
                    style={{
                      marginTop: "8px",
                      paddingTop: "7px",
                      borderTop:
                        "1px solid #e2e8f0",
                    }}
                  >
                    {session.activities
                      .slice(-3)
                      .map(
                        (
                          activity,
                          index
                        ) => (
                          <div
                            key={index}
                            style={{
                              display:
                                "flex",
                              gap: "6px",
                              marginBottom:
                                index <
                                Math.min(
                                  session
                                    .activities
                                    .length,
                                  3
                                ) -
                                  1
                                  ? "5px"
                                  : "0",
                            }}
                          >
                            <span
                              style={{
                                fontSize:
                                  "8px",
                              }}
                            >
                              •
                            </span>

                            <div
                              style={{
                                flex: 1,
                                minWidth:
                                  0,
                              }}
                            >
                              <div
                                style={{
                                  fontSize:
                                    "8px",
                                  color:
                                    "#475569",
                                  lineHeight:
                                    "1.4",
                                }}
                              >
                                {
                                  activity.description
                                }
                              </div>

                              {activity.timestamp && (
                                <div
                                  style={{
                                    fontSize:
                                      "7px",
                                    color:
                                      "#94a3b8",
                                    marginTop:
                                      "2px",
                                  }}
                                >
                                  {
                                    activity.timestamp
                                  }
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      )}
                  </div>
                )}

              {/* CREATED / UPDATED */}

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  marginTop: "8px",
                  paddingTop: "6px",
                  borderTop:
                    "1px solid #e2e8f0",
                  fontSize: "7px",
                  color: "#94a3b8",
                }}
              >
                <span>
                  Created:{" "}
                  {session.createdAt
                    ? new Date(
                        session.createdAt
                      ).toLocaleString()
                    : "—"}
                </span>

                <span>
                  Updated:{" "}
                  {session.updatedAt
                    ? new Date(
                        session.updatedAt
                      ).toLocaleString()
                    : "—"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPanel;