// src/components/ChatPanel.jsx

import React, {
  useState,
  useEffect,
  useRef,
} from "react";

import {
  diagnoseRevenueLeak,
} from "../agent/diagnosis";

import {
  prescribeFix,
} from "../agent/prescription";

import {
  simulateRevenueFix,
} from "../agent/simulation";

import {
  applyFix,
} from "../agent/fixes";

import ActionButtons from "./ActionButtons";

const ChatPanel = ({
  activeDataset,
  onAgentResponse,
  onSimulationUpdate,
  onFixUpdate,
}) => {
  const [messages, setMessages] =
    useState([]);

  const [input, setInput] =
    useState("");

  const [isTyping, setIsTyping] =
    useState(false);

  // -----------------------------------------
  // STORE CURRENT DIAGNOSIS
  // -----------------------------------------

  const [currentDiagnosis, setCurrentDiagnosis] =
    useState(null);

  const [currentPrescription, setCurrentPrescription] =
    useState(null);

  const messagesEndRef =
    useRef(null);

  // -----------------------------------------
  // AUTO SCROLL
  // -----------------------------------------

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages]);

  // -----------------------------------------
  // ADD MESSAGE
  // -----------------------------------------

  const addMessage = (msg) => {
    const timestamp =
      new Date().toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      );

    setMessages((prev) => [
      ...prev,
      {
        ...msg,
        timestamp,
        reactions: [],
        isEditing: false,
      },
    ]);
  };

  // -----------------------------------------
  // REACTION
  // -----------------------------------------

  const handleReaction = (
    msgIndex,
    reaction
  ) => {
    setMessages((prev) =>
      prev.map((m, idx) =>
        idx === msgIndex
          ? {
              ...m,
              reactions: [
                ...m.reactions,
                reaction,
              ],
            }
          : m
      )
    );
  };

  // -----------------------------------------
  // EDIT
  // -----------------------------------------

  const handleEditToggle = (
    msgIndex
  ) => {
    setMessages((prev) =>
      prev.map((m, idx) =>
        idx === msgIndex
          ? {
              ...m,
              isEditing:
                !m.isEditing,
            }
          : m
      )
    );
  };

  const handleEditSave = (
    msgIndex,
    newText
  ) => {
    setMessages((prev) =>
      prev.map((m, idx) =>
        idx === msgIndex
          ? {
              ...m,
              text: newText,
              isEditing: false,
            }
          : m
      )
    );
  };

  // -----------------------------------------
  // DELETE
  // -----------------------------------------

  const handleDelete = (
    msgIndex
  ) => {
    setMessages((prev) =>
      prev.filter(
        (_, idx) => idx !== msgIndex
      )
    );
  };

  // -----------------------------------------
  // SEND MESSAGE / DIAGNOSIS
  // -----------------------------------------

  const handleSend = () => {
    if (!input.trim()) {
      return;
    }

    if (
      !activeDataset ||
      activeDataset.length === 0
    ) {
      const warning = {
        sender: "agent",
        text:
          "Please upload a transaction dataset first.",
      };

      addMessage(warning);
      onAgentResponse(warning);

      return;
    }

    addMessage({
      sender: "merchant",
      text: input,
    });

    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      // -----------------------------------------
      // DIAGNOSE COMPLETE DATASET
      // -----------------------------------------

      const diagnosis =
        diagnoseRevenueLeak(
          activeDataset
        );

      // -----------------------------------------
      // GENERATE PRESCRIPTION
      // -----------------------------------------

      const prescription =
        prescribeFix(
          diagnosis
        );

      // -----------------------------------------
      // SAVE FOR SIMULATION + IMPLEMENTATION
      // -----------------------------------------

      setCurrentDiagnosis(
        diagnosis
      );

      setCurrentPrescription(
        prescription
      );

      // -----------------------------------------
      // BUILD HUMAN-READABLE RESPONSE
      // -----------------------------------------

      let responseText =
        diagnosis.message;

      if (
        prescription &&
        prescription.text
      ) {
        responseText +=
          `\n\n💡 ${prescription.text}`;
      }

      // -----------------------------------------
      // ADD ACTION GUIDANCE
      // -----------------------------------------

      if (
        diagnosis.category ===
        "revenue_leak"
      ) {
        responseText +=
          "\n\nYou can simulate this fix first, or implement it directly.";
      }

      const agentReply = {
        sender: "agent",
        text: responseText,
      };

      addMessage(agentReply);

      onAgentResponse(agentReply);

      setIsTyping(false);
    }, 700);
  };

  // -----------------------------------------
  // SIMULATE FIX
  // -----------------------------------------

  const handleSimulate = () => {
    if (
      !activeDataset ||
      activeDataset.length === 0
    ) {
      const warning = {
        sender: "agent",
        text:
          "Upload a transaction dataset before running a simulation.",
      };

      addMessage(warning);
      onAgentResponse(warning);

      return;
    }

    if (
      !currentDiagnosis
    ) {
      const warning = {
        sender: "agent",
        text:
          "Please ask the AI Co-Pilot to analyze the dataset before running a simulation.",
      };

      addMessage(warning);
      onAgentResponse(warning);

      return;
    }

    setIsTyping(true);

    setTimeout(() => {
      // -----------------------------------------
      // SIMULATE SAME FIX AS IMPLEMENTATION
      // -----------------------------------------

      const chartData =
        simulateRevenueFix(
          activeDataset,
          currentDiagnosis
        );

      onSimulationUpdate(
        chartData,
        `Simulation completed using ${activeDataset.length.toLocaleString()} transactions`
      );

      // -----------------------------------------
      // GET SIMULATION VALUES
      // -----------------------------------------

      const current =
        chartData.find(
          (item) =>
            item.scenario ===
            "Current Revenue"
        );

      const projected =
        chartData.find(
          (item) =>
            item.scenario ===
            "Projected Revenue"
        );

      const lift =
        chartData.find(
          (item) =>
            item.scenario ===
            "Revenue Lift"
        );

      const agentReply = {
        sender: "agent",
        text:
          `📊 Simulation complete.\n\n` +
          `Current revenue: ₹${(
            current?.revenue || 0
          ).toLocaleString()}\n` +
          `Projected revenue: ₹${(
            projected?.revenue || 0
          ).toLocaleString()}\n` +
          `Expected recovery: ₹${(
            lift?.revenue || 0
          ).toLocaleString()}\n` +
          `Expected revenue lift: ${(
            lift?.liftPercentage || 0
          )}%\n\n` +
          `The implementation will apply this same recovery strategy to the diagnosed failure segment.`,
      };

      addMessage(agentReply);
      onAgentResponse(agentReply);

      setIsTyping(false);
    }, 700);
  };

  // -----------------------------------------
  // IMPLEMENT FIX
  // -----------------------------------------

  const handleImplement = () => {
    if (
      !activeDataset ||
      activeDataset.length === 0
    ) {
      const warning = {
        sender: "agent",
        text:
          "Upload a transaction dataset before implementing a fix.",
      };

      addMessage(warning);
      onAgentResponse(warning);

      return;
    }

    if (
      !currentDiagnosis ||
      currentDiagnosis.category !==
        "revenue_leak"
    ) {
      const warning = {
        sender: "agent",
        text:
          "Please ask the AI Co-Pilot to identify a revenue leak before implementing a fix.",
      };

      addMessage(warning);
      onAgentResponse(warning);

      return;
    }

    setIsTyping(true);

    setTimeout(() => {
      // -----------------------------------------
      // APPLY THE SAME DIAGNOSED FIX
      // -----------------------------------------

      const updatedTransactions =
        applyFix(
          activeDataset,
          currentDiagnosis
        );

      // -----------------------------------------
      // CALCULATE RECOVERY
      // -----------------------------------------

      const oldRevenue =
        activeDataset
          .filter(
            (transaction) =>
              String(
                transaction.status ?? ""
              ).toLowerCase() ===
              "success"
          )
          .reduce(
            (sum, transaction) =>
              sum +
              (Number(
                transaction.amount
              ) || 0),
            0
          );

      const newRevenue =
        updatedTransactions
          .filter(
            (transaction) =>
              String(
                transaction.status ?? ""
              ).toLowerCase() ===
              "success"
          )
          .reduce(
            (sum, transaction) =>
              sum +
              (Number(
                transaction.amount
              ) || 0),
            0
          );

      const recoveredRevenue =
        newRevenue - oldRevenue;

      const recoveredTransactions =
        updatedTransactions.filter(
          (transaction, index) => {
            const oldStatus =
              String(
                activeDataset[index]
                  ?.status ?? ""
              ).toLowerCase();

            const newStatus =
              String(
                transaction.status ?? ""
              ).toLowerCase();

            return (
              oldStatus !== "success" &&
              newStatus === "success"
            );
          }
        ).length;

      // -----------------------------------------
      // UPDATE DASHBOARD
      // -----------------------------------------

      onFixUpdate(
        updatedTransactions,
        `Fix applied across ${activeDataset.length.toLocaleString()} transactions`
      );

      // -----------------------------------------
      // CHAT RESULT
      // -----------------------------------------

      const agentReply = {
        sender: "agent",
        text:
          `✅ Fix implemented successfully.\n\n` +
          `Fix: ${
            currentPrescription?.text ||
            "Revenue recovery strategy applied."
          }\n\n` +
          `Transactions recovered: ${recoveredTransactions.toLocaleString()}\n` +
          `Revenue recovered: ₹${recoveredRevenue.toLocaleString()}\n` +
          `New transaction health has been applied to the dashboard.`,
      };

      addMessage(agentReply);
      onAgentResponse(agentReply);

      setIsTyping(false);
    }, 700);
  };

  // -----------------------------------------
  // GROUP MESSAGES
  // -----------------------------------------

  const groupedMessages = [];

  messages.forEach((msg, idx) => {
    const lastGroup =
      groupedMessages[
        groupedMessages.length - 1
      ];

    if (
      lastGroup &&
      lastGroup.sender === msg.sender
    ) {
      lastGroup.messages.push({
        ...msg,
        index: idx,
      });
    } else {
      groupedMessages.push({
        sender: msg.sender,
        messages: [
          {
            ...msg,
            index: idx,
          },
        ],
      });
    }
  });

  // -----------------------------------------
  // AVATAR
  // -----------------------------------------

  const getAvatar = (
    sender
  ) =>
    sender === "merchant"
      ? "👤"
      : "🤖";

  const getTooltip = (
    sender
  ) =>
    sender === "merchant"
      ? "Merchant"
      : "AI Agent";

  // -----------------------------------------
  // UI
  // -----------------------------------------

  return (
    <div
      className="chat-panel"
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
          display: "flex",
          alignItems: "center",
          justifyContent:
            "space-between",
          marginBottom: "12px",
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              color: "#0f172a",
              fontSize: "16px",
            }}
          >
            🤖 AI Co-Pilot
          </h3>

          <div
            style={{
              fontSize: "9px",
              color: "#64748b",
              marginTop: "3px",
            }}
          >
            Ask about revenue leaks,
            payments or transaction health.
          </div>
        </div>

        {activeDataset &&
          activeDataset.length > 0 && (
            <div
              style={{
                padding:
                  "5px 8px",
                borderRadius:
                  "20px",
                background:
                  "#ecfdf5",
                color:
                  "#15803d",
                fontSize: "8px",
                fontWeight:
                  "900",
              }}
            >
              🟢{" "}
              {activeDataset.length.toLocaleString()}{" "}
              records
            </div>
          )}
      </div>

      {/* EMPTY DATASET */}

      {(!activeDataset ||
        activeDataset.length === 0) && (
        <div
          style={{
            padding: "30px 15px",
            textAlign: "center",
            borderRadius: "12px",
            background:
              "linear-gradient(135deg,#f8fafc,#eff6ff)",
            border:
              "1px dashed #cbd5e1",
            marginBottom: "12px",
          }}
        >
          <div
            style={{
              fontSize: "30px",
              marginBottom: "8px",
            }}
          >
            📊
          </div>

          <div
            style={{
              fontWeight: "900",
              color: "#334155",
              fontSize: "12px",
            }}
          >
            Upload a dataset to begin
          </div>

          <div
            style={{
              marginTop: "5px",
              fontSize: "9px",
              color: "#64748b",
            }}
          >
            Your AI agent will analyze the
            complete dataset.
          </div>
        </div>
      )}

      {/* MESSAGES */}

      <div
        className="messages"
        style={{
          minHeight: "180px",
          marginBottom: "10px",
          display: "flex",
          flexDirection:
            "column",
          gap: "8px",
          overflowY: "auto",
          maxHeight: "320px",
        }}
      >
        {groupedMessages.map(
          (group, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                flexDirection:
                  group.sender ===
                  "merchant"
                    ? "row-reverse"
                    : "row",
                alignItems:
                  "flex-start",
                gap: "8px",
              }}
            >
              {/* AVATAR */}

              <div
                title={getTooltip(
                  group.sender
                )}
                style={{
                  fontSize: "1.5em",
                }}
              >
                {getAvatar(
                  group.sender
                )}
              </div>

              {/* MESSAGE */}

              <div
                style={{
                  background:
                    group.sender ===
                    "merchant"
                      ? "linear-gradient(135deg,#dcf8c6,#c8e6c9)"
                      : "linear-gradient(135deg,#e6e6e6,#f5f5f5)",
                  color: "#333",
                  padding:
                    "10px 14px",
                  borderRadius:
                    "16px",
                  maxWidth: "70%",
                  whiteSpace:
                    "pre-line",
                  boxShadow:
                    "0 2px 4px rgba(0,0,0,0.1)",
                  position:
                    "relative",
                }}
              >
                <strong
                  style={{
                    display:
                      "block",
                    fontSize:
                      "0.8em",
                    marginBottom:
                      "4px",
                    color:
                      group.sender ===
                      "merchant"
                        ? "#2e7d32"
                        : "#1565c0",
                  }}
                >
                  {group.sender}
                </strong>

                {group.messages.map(
                  (m, i) => (
                    <div
                      key={i}
                      style={{
                        marginBottom:
                          "6px",
                      }}
                    >
                      {m.isEditing ? (
                        <div
                          style={{
                            display:
                              "flex",
                            gap: "6px",
                          }}
                        >
                          <input
                            type="text"
                            defaultValue={
                              m.text
                            }
                            style={{
                              flex: 1,
                              padding:
                                "4px",
                            }}
                            onKeyDown={(
                              e
                            ) => {
                              if (
                                e.key ===
                                "Enter"
                              ) {
                                handleEditSave(
                                  m.index,
                                  e.target
                                    .value
                                );
                              }
                            }}
                          />

                          <button
                            onClick={() =>
                              handleEditSave(
                                m.index,
                                m.text
                              )
                            }
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <>
                          {m.text}

                          <div
                            style={{
                              fontSize:
                                "0.7em",
                              color:
                                "#888",
                              marginTop:
                                "2px",
                              textAlign:
                                "right",
                            }}
                          >
                            {
                              m.timestamp
                            }
                          </div>

                          {/* REACTIONS */}

                          <div
                            style={{
                              marginTop:
                                "4px",
                              display:
                                "flex",
                              gap: "6px",
                            }}
                          >
                            {[
                              "👍",
                              "❤️",
                              "😂",
                            ].map(
                              (
                                emoji
                              ) => (
                                <span
                                  key={
                                    emoji
                                  }
                                  style={{
                                    cursor:
                                      "pointer",
                                  }}
                                  onClick={() =>
                                    handleReaction(
                                      m.index,
                                      emoji
                                    )
                                  }
                                >
                                  {
                                    emoji
                                  }
                                </span>
                              )
                            )}
                          </div>

                          {m.reactions &&
                            m.reactions
                              .length >
                              0 && (
                              <div
                                style={{
                                  marginTop:
                                    "4px",
                                  fontSize:
                                    "0.8em",
                                  color:
                                    "#555",
                                }}
                              >
                                Reactions:{" "}
                                {m.reactions.join(
                                  " "
                                )}
                              </div>
                            )}

                          {/* EDIT / DELETE */}

                          {group.sender ===
                            "merchant" && (
                            <div
                              style={{
                                marginTop:
                                  "4px",
                                display:
                                  "flex",
                                gap:
                                  "10px",
                                fontSize:
                                  "0.8em",
                              }}
                            >
                              <span
                                style={{
                                  cursor:
                                    "pointer",
                                  color:
                                    "#1565c0",
                                }}
                                onClick={() =>
                                  handleEditToggle(
                                    m.index
                                  )
                                }
                              >
                                ✏️ Edit
                              </span>

                              <span
                                style={{
                                  cursor:
                                    "pointer",
                                  color:
                                    "#f44336",
                                }}
                                onClick={() =>
                                  handleDelete(
                                    m.index
                                  )
                                }
                              >
                                🗑️ Delete
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )
                )}

                {/* ACTION BUTTONS */}

                {group.sender ===
                  "agent" &&
                  idx ===
                    groupedMessages.length -
                      1 && (
                    <ActionButtons
                      onSimulate={
                        handleSimulate
                      }
                      onImplement={
                        handleImplement
                      }
                    />
                  )}
              </div>
            </div>
          )
        )}

        {/* TYPING INDICATOR */}

        {isTyping && (
          <div
            style={{
              alignSelf:
                "flex-start",
              display: "flex",
              alignItems:
                "center",
              gap: "4px",
              margin: "5px 0",
              padding:
                "8px 12px",
              backgroundColor:
                "#e6e6e6",
              borderRadius:
                "16px",
              maxWidth: "40%",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                backgroundColor:
                  "#666",
                borderRadius:
                  "50%",
              }}
            />

            <span
              style={{
                width: "6px",
                height: "6px",
                backgroundColor:
                  "#666",
                borderRadius:
                  "50%",
              }}
            />

            <span
              style={{
                width: "6px",
                height: "6px",
                backgroundColor:
                  "#666",
                borderRadius:
                  "50%",
              }}
            />
          </div>
        )}

        <div
          ref={messagesEndRef}
        />
      </div>

      {/* INPUT */}

      <div
        style={{
          display: "flex",
          gap: "8px",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          value={input}
          disabled={
            !activeDataset ||
            activeDataset.length === 0
          }
          onChange={(e) =>
            setInput(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
          placeholder={
            activeDataset &&
            activeDataset.length > 0
              ? "Ask your AI Co-Pilot..."
              : "Upload a dataset first..."
          }
          style={{
            flex: 1,
            padding:
              "10px 12px",
            border:
              "1px solid #cbd5e1",
            borderRadius:
              "10px",
            outline: "none",
            fontSize: "11px",
            background:
              !activeDataset ||
              activeDataset.length === 0
                ? "#f1f5f9"
                : "#ffffff",
          }}
        />

        <button
          onClick={handleSend}
          disabled={
            !activeDataset ||
            activeDataset.length === 0 ||
            !input.trim()
          }
          style={{
            padding:
              "10px 15px",
            border: "none",
            borderRadius:
              "10px",
            background:
              !activeDataset ||
              activeDataset.length === 0 ||
              !input.trim()
                ? "#cbd5e1"
                : "linear-gradient(135deg,#1677ff,#0b5cff)",
            color: "#ffffff",
            fontWeight: "900",
            cursor:
              !activeDataset ||
              activeDataset.length === 0 ||
              !input.trim()
                ? "not-allowed"
                : "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPanel;