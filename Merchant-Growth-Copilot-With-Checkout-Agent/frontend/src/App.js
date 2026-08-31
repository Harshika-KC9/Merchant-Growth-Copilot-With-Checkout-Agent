// src/App.js

import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import ChatPanel from "./components/ChatPanel";
import Dashboard from "./components/Dashboard";
import DatasetUploader from "./components/DatasetUploader";
import FunnelChart from "./components/FunnelChart";
import HistoryPanel from "./components/HistoryPanel";

function App() {
  // =====================================================
  // PAGE STATE
  // =====================================================

  const [currentPage, setCurrentPage] = useState(() => {
  const params = new URLSearchParams(window.location.search);

  if (params.get("page") === "copilot") {
    return "copilot";
  }

  return "home";
});

  const [authMode, setAuthMode] =
    useState("create");

  // =====================================================
  // ALWAYS START PAGE FROM TOP
  // =====================================================

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [currentPage]);

  // =====================================================
  // AUTH STATE
  // =====================================================

  const [loginValue, setLoginValue] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [authError, setAuthError] =
    useState("");

  const [authSuccess, setAuthSuccess] =
    useState("");

  // =====================================================
  // DATASET STATE
  // =====================================================

  const [activeDataset, setActiveDataset] =
    useState([]);

  const [datasetName, setDatasetName] =
    useState("");

  // =====================================================
  // AGENT / DASHBOARD STATE
  // =====================================================

  const [agentResponses, setAgentResponses] =
    useState([]);

  const [simulationData, setSimulationData] =
    useState([]);

  const [
    fixedTransactions,
    setFixedTransactions,
  ] = useState(null);

  // =====================================================
  // FIX HISTORY
  // =====================================================

  const [fixHistory, setFixHistory] =
    useState([]);

  // =====================================================
  // ANALYSIS SESSION HISTORY
  // =====================================================

  const [
    analysisHistory,
    setAnalysisHistory,
  ] = useState([]);

  const [
    activeHistoryId,
    setActiveHistoryId,
  ] = useState(null);

  // =====================================================
  // GET CURRENT USER
  // =====================================================

  const getCurrentUser = useCallback(() => {
    return (
      localStorage.getItem(
        "merchantCurrentUser"
      ) || ""
    );
  }, []);

  // =====================================================
  // LOAD USER HISTORY
  // =====================================================

  const loadUserHistory = (
    userId
  ) => {
    if (!userId) {
      setAnalysisHistory([]);
      return;
    }

    try {
      const saved =
        localStorage.getItem(
          `merchantAnalysisHistory_${userId}`
        );

      if (saved) {
        const parsed =
          JSON.parse(saved);

        setAnalysisHistory(
          Array.isArray(parsed)
            ? parsed
            : []
        );
      } else {
        setAnalysisHistory([]);
      }
    } catch (error) {
      console.error(
        "Unable to load analysis history:",
        error
      );

      setAnalysisHistory([]);
    }
  };

  // =====================================================
  // SAVE USER HISTORY
  // =====================================================

  const saveUserHistory = useCallback(
    (
      history,
      userId = getCurrentUser()
    ) => {
      if (!userId) {
        return;
      }

      try {
        localStorage.setItem(
          `merchantAnalysisHistory_${userId}`,
          JSON.stringify(history)
        );
      } catch (error) {
        console.error(
          "Unable to save analysis history:",
          error
        );
      }
    },
    [getCurrentUser]
  );

  // =====================================================
  // KEEP USER HISTORY PERSISTED
  // =====================================================

  useEffect(() => {
    const userId =
      getCurrentUser();

    if (userId) {
      saveUserHistory(
        analysisHistory,
        userId
      );
    }
  }, [
    analysisHistory,
    getCurrentUser,
    saveUserHistory,
  ]);

  // =====================================================
  // ADD ACTIVITY TO CURRENT SESSION
  // =====================================================

  const addHistoryActivity = (
    description
  ) => {
    if (!description) {
      return;
    }

    setFixHistory((prev) => {
      const updated = [
        ...prev,
        {
          timestamp:
            new Date().toLocaleString(),

          description,
        },
      ];

      return updated;
    });

    setAnalysisHistory((prev) => {
      if (!activeHistoryId) {
        return prev;
      }

      const updated =
        prev.map((session) => {
          if (
            session.id !==
            activeHistoryId
          ) {
            return session;
          }

          return {
            ...session,

            updatedAt:
              new Date().toISOString(),

            activities: [
              ...(session.activities ||
                []),
              {
                timestamp:
                  new Date().toLocaleString(),

                description,
              },
            ],
          };
        });

      return updated;
    });
  };

  // =====================================================
  // DATASET LOADED
  // =====================================================

  const handleDatasetLoaded = (
    dataset,
    fileName
  ) => {
    console.log(
      "Complete dataset loaded:",
      dataset.length,
      "transactions"
    );

    // Store the COMPLETE dataset.
    setActiveDataset(dataset);

    setDatasetName(fileName);

    // Reset previous analysis.
    setAgentResponses([]);

    setSimulationData([]);

    setFixedTransactions(null);

    // Create a new history session.
    const newHistoryId =
      `analysis-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;

    const now =
      new Date().toISOString();

    const firstActivity = {
      timestamp:
        new Date().toLocaleString(),

      description:
        `Loaded ${dataset.length.toLocaleString()} transactions from ${fileName}`,
    };

    const newSession = {
      id: newHistoryId,

      userId:
        getCurrentUser(),

      datasetName:
        fileName,

      transactionCount:
        dataset.length,

      createdAt: now,

      updatedAt: now,

      description:
        `Analysis session for ${fileName}`,

      activities: [
        firstActivity,
      ],
    };

    setActiveHistoryId(
      newHistoryId
    );

    setAnalysisHistory(
      (prev) => [
        newSession,
        ...prev,
      ]
    );

    // Existing action history
    setFixHistory([
      firstActivity,
    ]);
  };

  // =====================================================
  // AGENT RESPONSE
  // =====================================================

  const handleAgentResponse = (
    response
  ) => {
    setAgentResponses(
      (prev) => [
        ...prev,
        response,
      ]
    );

    // Save readable agent activity
    if (response) {
      let description = "";

      if (
        typeof response ===
        "string"
      ) {
        description =
          response;
      } else if (
        response.message
      ) {
        description =
          response.message;
      } else if (
        response.text
      ) {
        description =
          response.text;
      }

      if (description) {
        setAnalysisHistory(
          (prev) => {
            if (
              !activeHistoryId
            ) {
              return prev;
            }

            return prev.map(
              (session) => {
                if (
                  session.id !==
                  activeHistoryId
                ) {
                  return session;
                }

                return {
                  ...session,

                  updatedAt:
                    new Date().toISOString(),

                  activities: [
                    ...(session.activities ||
                      []),
                    {
                      timestamp:
                        new Date().toLocaleString(),

                      description:
                        `AI analysis: ${description}`,
                    },
                  ],
                };
              }
            );
          }
        );
      }
    }
  };

  // =====================================================
  // SIMULATION UPDATE
  // =====================================================

  const handleSimulationUpdate = (
    data,
    description
  ) => {
    setSimulationData(data);

    addHistoryActivity(
      description ||
        "Revenue simulation completed."
    );
  };

  // =====================================================
  // FIX UPDATE
  // =====================================================

  const handleFixUpdate = (
    updatedTransactions,
    description
  ) => {
    /*
     * The COMPLETE modified dataset
     * becomes the active dataset.
     */

    setFixedTransactions(
      updatedTransactions
    );

    setActiveDataset(
      updatedTransactions
    );

    addHistoryActivity(
      description ||
        "Revenue fix implemented."
    );
  };

  // =====================================================
  // DELETE ONE HISTORY SESSION
  // =====================================================

  const handleDeleteHistory = (
    historyId
  ) => {
    setAnalysisHistory(
      (prev) =>
        prev.filter(
          (item) =>
            item.id !== historyId
        )
    );

    if (
      activeHistoryId ===
      historyId
    ) {
      setActiveHistoryId(
        null
      );
    }
  };

  // =====================================================
  // DELETE ALL HISTORY
  // =====================================================

  const handleClearAllHistory = () => {
    setAnalysisHistory([]);

    setActiveHistoryId(
      null
    );

    const userId =
      getCurrentUser();

    if (userId) {
      localStorage.removeItem(
        `merchantAnalysisHistory_${userId}`
      );
    }
  };

  // =====================================================
  // CLEAR CURRENT FIX HISTORY
  // =====================================================

  const handleClearHistory = () => {
    setFixHistory([]);
  };

  // =====================================================
  // OPEN AUTH
  // =====================================================

  const openAuth = (
    mode
  ) => {
    setAuthMode(mode);

    setCurrentPage("auth");

    setLoginValue("");

    setPassword("");

    setConfirmPassword("");

    setAuthError("");

    setAuthSuccess("");

    setShowPassword(false);

    setShowConfirmPassword(
      false
    );

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  };

  // =====================================================
  // NORMALIZE LOGIN VALUE
  // =====================================================

  const normalizeLoginValue = (
    value
  ) => {
    return value
      .trim()
      .toLowerCase();
  };

  // =====================================================
  // GET ACCOUNTS
  // =====================================================

  const getAccounts = () => {
    try {
      const saved =
        localStorage.getItem(
          "merchantAccounts"
        );

      return saved
        ? JSON.parse(saved)
        : [];
    } catch (error) {
      console.error(
        "Unable to load accounts:",
        error
      );

      return [];
    }
  };

  // =====================================================
  // SAVE ACCOUNTS
  // =====================================================

  const saveAccounts = (
    accounts
  ) => {
    localStorage.setItem(
      "merchantAccounts",
      JSON.stringify(
        accounts
      )
    );
  };

  // =====================================================
  // EMAIL / PHONE VALIDATION
  // =====================================================

  const validateLoginValue = (
    value
  ) => {
    const cleaned =
      value.trim();

    if (!cleaned) {
      return "Please enter your email or phone number.";
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const phonePattern =
      /^\+?[0-9]{10,15}$/;

    const normalizedPhone =
      cleaned.replace(
        /[\s-]/g,
        ""
      );

    const validEmail =
      emailPattern.test(
        cleaned
      );

    const validPhone =
      phonePattern.test(
        normalizedPhone
      );

    if (
      !validEmail &&
      !validPhone
    ) {
      return "Enter a valid email address or phone number.";
    }

    return "";
  };

  // =====================================================
  // PASSWORD VALIDATION
  // =====================================================

  const validatePassword = (
    value
  ) => {
    if (!value) {
      return "Please enter a password.";
    }

    if (value.length < 8) {
      return "Password must contain at least 8 characters.";
    }

    if (!/[A-Z]/.test(value)) {
      return "Password must contain at least one uppercase letter.";
    }

    if (!/[a-z]/.test(value)) {
      return "Password must contain at least one lowercase letter.";
    }

    if (!/[0-9]/.test(value)) {
      return "Password must contain at least one number.";
    }

    return "";
  };

  // =====================================================
  // PASSWORD REQUIREMENTS
  // =====================================================

  const passwordChecks = {
    length:
      password.length >= 8,

    uppercase:
      /[A-Z]/.test(password),

    lowercase:
      /[a-z]/.test(password),

    number:
      /[0-9]/.test(password),
  };

  // =====================================================
  // CREATE ACCOUNT
  // =====================================================

  const handleCreateAccount = (
    event
  ) => {
    event.preventDefault();

    setAuthError("");

    setAuthSuccess("");

    const userId =
      normalizeLoginValue(
        loginValue
      );

    const loginValidation =
      validateLoginValue(
        loginValue
      );

    if (loginValidation) {
      setAuthError(
        loginValidation
      );

      return;
    }

    const passwordValidation =
      validatePassword(
        password
      );

    if (passwordValidation) {
      setAuthError(
        passwordValidation
      );

      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      setAuthError(
        "Passwords do not match."
      );

      return;
    }

    const accounts =
      getAccounts();

    const existingAccount =
      accounts.find(
        (account) =>
          account.userId ===
          userId
      );

    if (existingAccount) {
      setAuthError(
        "An account with this email or phone already exists."
      );

      return;
    }

    const newAccount = {
      userId,

      password,

      createdAt:
        new Date().toISOString(),
    };

    saveAccounts([
      ...accounts,
      newAccount,
    ]);

    setAuthSuccess(
      "Account created successfully!"
    );

    setTimeout(() => {
      setAuthMode("login");

      setPassword("");

      setConfirmPassword("");

      setAuthError("");

      setAuthSuccess(
        "Account created successfully. Please log in."
      );

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });
    }, 900);
  };

  // =====================================================
  // LOGIN
  // =====================================================

  const handleLogin = (
    event
  ) => {
    event.preventDefault();

    setAuthError("");

    setAuthSuccess("");

    const userId =
      normalizeLoginValue(
        loginValue
      );

    const loginValidation =
      validateLoginValue(
        loginValue
      );

    if (loginValidation) {
      setAuthError(
        loginValidation
      );

      return;
    }

    if (!password) {
      setAuthError(
        "Please enter your password."
      );

      return;
    }

    const accounts =
      getAccounts();

    const account =
      accounts.find(
        (item) =>
          item.userId ===
          userId
      );

    if (!account) {
      setAuthError(
        "No account found with this email or phone. Please create an account first."
      );

      return;
    }

    if (
      account.password !==
      password
    ) {
      setAuthError(
        "Incorrect password. Please try again."
      );

      return;
    }

    localStorage.setItem(
      "merchantSignedIn",
      "true"
    );

    localStorage.setItem(
      "merchantCurrentUser",
      userId
    );

    // Load this user's private history.
    loadUserHistory(
      userId
    );

    setAuthError("");

    setAuthSuccess(
      "Login successful!"
    );

    /*
     * IMPORTANT:
     *
     * Do not use setTimeout here.
     *
     * We switch the page immediately,
     * preventing the browser from
     * jumping down the page.
     */

    setCurrentPage(
      "copilot"
    );

    setPassword("");

    setConfirmPassword("");

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem(
      "merchantSignedIn"
    );

    localStorage.removeItem(
      "merchantCurrentUser"
    );

    setCurrentPage(
      "home"
    );

    setAuthMode(
      "create"
    );

    setLoginValue("");

    setPassword("");

    setConfirmPassword("");

    setAuthError("");

    setAuthSuccess("");

    setActiveDataset([]);

    setDatasetName("");

    setAgentResponses([]);

    setSimulationData([]);

    setFixedTransactions(
      null
    );

    setFixHistory([]);

    setAnalysisHistory([]);

    setActiveHistoryId(
      null
    );

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  };

  // =====================================================
  // FUNNEL DATA
  // =====================================================

  const funnelDataset =
    fixedTransactions &&
    fixedTransactions.length >
      0
      ? fixedTransactions
      : activeDataset;

  const funnelData = [
    {
      stage:
        "Transactions",

      users:
        funnelDataset.length,
    },

    {
      stage:
        "Payment Attempted",

      users:
        funnelDataset.length,
    },

    {
      stage:
        "Payment Failed",

      users:
        funnelDataset.filter(
          (transaction) =>
            String(
              transaction.status ??
                ""
            ).toLowerCase() !==
            "success"
        ).length,
    },

    {
      stage:
        "Payment Success",

      users:
        funnelDataset.filter(
          (transaction) =>
            String(
              transaction.status ??
                ""
            ).toLowerCase() ===
            "success"
        ).length,
    },
  ];

  // =====================================================
  // HOME PAGE
  // =====================================================

  if (
    currentPage ===
    "home"
  ) {
    return (
      <div
        style={{
          minHeight:
            "100vh",

          background:
            "radial-gradient(circle at top left,#172554,#020617 45%,#000000)",

          color:
            "#ffffff",

          fontFamily:
            "Arial, Helvetica, sans-serif",

          display:
            "flex",

          flexDirection:
            "column",
        }}
      >
        {/* NAVBAR */}

        <nav
          style={{
            height:
              "76px",

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "space-between",

            padding:
              "0 7%",

            borderBottom:
              "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* LOGO */}

          <div
            style={{
              display:
                "flex",

              alignItems:
                "center",

              gap:
                "10px",

              fontWeight:
                "900",

              fontSize:
                "17px",
            }}
          >
            <div
              style={{
                width:
                  "40px",

                height:
                  "40px",

                borderRadius:
                  "12px",

                background:
                  "linear-gradient(135deg,#7c3aed,#2563eb)",

                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                fontSize:
                  "20px",

                fontWeight:
                  "900",
              }}
            >
              M
            </div>

            Merchant Growth Co-Pilot
          </div>

          <button
            onClick={() =>
              openAuth(
                "login"
              )
            }
            style={{
              padding:
                "9px 16px",

              borderRadius:
                "9px",

              border:
                "1px solid rgba(255,255,255,0.2)",

              background:
                "rgba(255,255,255,0.08)",

              color:
                "#ffffff",

              cursor:
                "pointer",

              fontWeight:
                "700",
            }}
          >
            Log in
          </button>
        </nav>

        {/* HERO */}

        <main
          style={{
            flex:
              1,

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            padding:
              "50px 7%",
          }}
        >
          <div
            style={{
              maxWidth:
                "950px",

              textAlign:
                "center",
            }}
          >
            <div
              style={{
                display:
                  "inline-flex",

                padding:
                  "7px 13px",

                borderRadius:
                  "30px",

                background:
                  "rgba(59,130,246,0.12)",

                border:
                  "1px solid rgba(96,165,250,0.25)",

                color:
                  "#93c5fd",

                fontSize:
                  "11px",

                fontWeight:
                  "800",

                marginBottom:
                  "22px",
              }}
            >
              ✦ AI-POWERED MERCHANT INTELLIGENCE
            </div>

            <h1
              style={{
                fontSize:
                  "clamp(42px,7vw,78px)",

                lineHeight:
                  "1.02",

                margin:
                  0,

                fontWeight:
                  "950",

                letterSpacing:
                  "-3px",
              }}
            >
              Turn Transaction Data
              <br />

              <span
                style={{
                  background:
                    "linear-gradient(90deg,#60a5fa,#a78bfa,#22d3ee)",

                  WebkitBackgroundClip:
                    "text",

                  WebkitTextFillColor:
                    "transparent",
                }}
              >
                Into Revenue Growth.
              </span>
            </h1>

            <p
              style={{
                maxWidth:
                  "650px",

                margin:
                  "22px auto 30px",

                color:
                  "#94a3b8",

                fontSize:
                  "15px",

                lineHeight:
                  "1.7",
              }}
            >
              Upload your transaction
              dataset and let your AI
              Co-Pilot identify revenue
              leaks, diagnose payment
              failures, simulate fixes and
              uncover growth opportunities.
            </p>

            <button
              onClick={() =>
                openAuth(
                  "create"
                )
              }
              style={{
                padding:
                  "14px 28px",

                borderRadius:
                  "12px",

                border:
                  "none",

                cursor:
                  "pointer",

                color:
                  "#ffffff",

                fontSize:
                  "14px",

                fontWeight:
                  "900",

                background:
                  "linear-gradient(135deg,#2563eb,#7c3aed)",

                boxShadow:
                  "0 12px 35px rgba(79,70,229,0.4)",
              }}
            >
              Create Account →
            </button>
          </div>
        </main>
      </div>
    );
  }

  // =====================================================
  // AUTH PAGE
  // =====================================================

  if (
    currentPage ===
    "auth"
  ) {
    const isCreate =
      authMode ===
      "create";

    return (
      <div
        style={{
          minHeight:
            "100vh",

          background:
            "linear-gradient(135deg,#020617,#0f172a,#172554)",

          fontFamily:
            "Arial, Helvetica, sans-serif",

          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "center",

          padding:
            "20px",

          color:
            "#ffffff",
        }}
      >
        <div
          style={{
            width:
              "100%",

            maxWidth:
              "420px",
          }}
        >
          {/* LOGO */}

          <div
            style={{
              display:
                "flex",

              justifyContent:
                "center",

              marginBottom:
                "14px",
            }}
          >
            <div
              style={{
                width:
                  "50px",

                height:
                  "50px",

                borderRadius:
                  "15px",

                background:
                  "linear-gradient(135deg,#7c3aed,#2563eb)",

                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                fontSize:
                  "24px",

                fontWeight:
                  "900",
              }}
            >
              M
            </div>
          </div>

          <div
            style={{
              textAlign:
                "center",

              fontSize:
                "16px",

              fontWeight:
                "900",

              marginBottom:
                "18px",
            }}
          >
            Merchant Growth Co-Pilot
          </div>

          {/* AUTH CARD */}

          <div
            style={{
              background:
                "rgba(255,255,255,0.06)",

              border:
                "1px solid rgba(255,255,255,0.12)",

              borderRadius:
                "20px",

              padding:
                "30px",

              boxShadow:
                "0 25px 70px rgba(0,0,0,0.35)",
            }}
          >
            <div
              style={{
                textAlign:
                  "center",

                marginBottom:
                  "22px",
              }}
            >
              <h2
                style={{
                  margin:
                    0,

                  fontSize:
                    "24px",

                  fontWeight:
                    "900",
                }}
              >
                {isCreate
                  ? "Create your account"
                  : "Welcome back"}
              </h2>

              <p
                style={{
                  color:
                    "#94a3b8",

                  fontSize:
                    "11px",

                  marginTop:
                    "7px",
                }}
              >
                {isCreate
                  ? "Start using your AI revenue Co-Pilot"
                  : "Log in to continue to your Co-Pilot"}
              </p>
            </div>

            {/* FORM */}

            <form
              onSubmit={
                isCreate
                  ? handleCreateAccount
                  : handleLogin
              }
            >
              {/* EMAIL / PHONE */}

              <label
                style={{
                  display:
                    "block",

                  fontSize:
                    "10px",

                  fontWeight:
                    "800",

                  marginBottom:
                    "7px",

                  color:
                    "#cbd5e1",
                }}
              >
                Email or Phone Number
              </label>

              <input
                type="text"
                value={
                  loginValue
                }
                onChange={(
                  event
                ) => {
                  setLoginValue(
                    event.target
                      .value
                  );

                  setAuthError(
                    ""
                  );
                }}
                placeholder="you@example.com"
                style={{
                  width:
                    "100%",

                  boxSizing:
                    "border-box",

                  padding:
                    "12px",

                  borderRadius:
                    "10px",

                  border:
                    "1px solid rgba(255,255,255,0.15)",

                  background:
                    "rgba(15,23,42,0.8)",

                  color:
                    "#ffffff",

                  outline:
                    "none",

                  fontSize:
                    "11px",
                }}
              />

              {/* PASSWORD */}

              <label
                style={{
                  display:
                    "block",

                  fontSize:
                    "10px",

                  fontWeight:
                    "800",

                  marginTop:
                    "15px",

                  marginBottom:
                    "7px",

                  color:
                    "#cbd5e1",
                }}
              >
                Password
              </label>

              <div
                style={{
                  position:
                    "relative",
                }}
              >
                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={
                    password
                  }
                  onChange={(
                    event
                  ) => {
                    setPassword(
                      event.target
                        .value
                    );

                    setAuthError(
                      ""
                    );
                  }}
                  placeholder="Enter your password"
                  style={{
                    width:
                      "100%",

                    boxSizing:
                      "border-box",

                    padding:
                      "12px 42px 12px 12px",

                    borderRadius:
                      "10px",

                    border:
                      "1px solid rgba(255,255,255,0.15)",

                    background:
                      "rgba(15,23,42,0.8)",

                    color:
                      "#ffffff",

                    outline:
                      "none",

                    fontSize:
                      "11px",
                  }}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  style={{
                    position:
                      "absolute",

                    right:
                      "8px",

                    top:
                      "50%",

                    transform:
                      "translateY(-50%)",

                    border:
                      "none",

                    background:
                      "transparent",

                    color:
                      "#94a3b8",

                    cursor:
                      "pointer",

                    fontSize:
                      "14px",
                  }}
                >
                  {showPassword
                    ? "🙈"
                    : "👁️"}
                </button>
              </div>

              {/* CONFIRM PASSWORD */}

              {isCreate && (
                <>
                  <label
                    style={{
                      display:
                        "block",

                      fontSize:
                        "10px",

                      fontWeight:
                        "800",

                      marginTop:
                        "15px",

                      marginBottom:
                        "7px",

                      color:
                        "#cbd5e1",
                    }}
                  >
                    Confirm Password
                  </label>

                  <div
                    style={{
                      position:
                        "relative",
                    }}
                  >
                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      value={
                        confirmPassword
                      }
                      onChange={(
                        event
                      ) => {
                        setConfirmPassword(
                          event.target
                            .value
                        );

                        setAuthError(
                          ""
                        );
                      }}
                      placeholder="Re-enter your password"
                      style={{
                        width:
                          "100%",

                        boxSizing:
                          "border-box",

                        padding:
                          "12px 42px 12px 12px",

                        borderRadius:
                          "10px",

                        border:
                          "1px solid rgba(255,255,255,0.15)",

                        background:
                          "rgba(15,23,42,0.8)",

                        color:
                          "#ffffff",

                        outline:
                          "none",

                        fontSize:
                          "11px",
                      }}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                      style={{
                        position:
                          "absolute",

                        right:
                          "8px",

                        top:
                          "50%",

                        transform:
                          "translateY(-50%)",

                        border:
                          "none",

                        background:
                          "transparent",

                        color:
                          "#94a3b8",

                        cursor:
                          "pointer",

                        fontSize:
                          "14px",
                      }}
                    >
                      {showConfirmPassword
                        ? "🙈"
                        : "👁️"}
                    </button>
                  </div>

                  {/* PASSWORD REQUIREMENTS */}

                  {password.length >
                    0 && (
                    <div
                      style={{
                        marginTop:
                          "10px",

                        padding:
                          "10px",

                        borderRadius:
                          "9px",

                        background:
                          "rgba(15,23,42,0.5)",

                        border:
                          "1px solid rgba(255,255,255,0.07)",
                      }}
                    >
                      <div
                        style={{
                          fontSize:
                            "9px",

                          color:
                            "#94a3b8",

                          marginBottom:
                            "6px",

                          fontWeight:
                            "700",
                        }}
                      >
                        Password requirements
                      </div>

                      {[
                        {
                          valid:
                            passwordChecks.length,

                          text:
                            "At least 8 characters",
                        },

                        {
                          valid:
                            passwordChecks.uppercase,

                          text:
                            "One uppercase letter",
                        },

                        {
                          valid:
                            passwordChecks.lowercase,

                          text:
                            "One lowercase letter",
                        },

                        {
                          valid:
                            passwordChecks.number,

                          text:
                            "One number",
                        },
                      ].map(
                        (
                          requirement
                        ) => (
                          <div
                            key={
                              requirement.text
                            }
                            style={{
                              fontSize:
                                "9px",

                              marginTop:
                                "4px",

                              color:
                                requirement.valid
                                  ? "#4ade80"
                                  : "#94a3b8",
                            }}
                          >
                            {requirement.valid
                              ? "✓"
                              : "○"}{" "}
                            {
                              requirement.text
                            }
                          </div>
                        )
                      )}
                    </div>
                  )}
                </>
              )}

              {/* ERROR */}

              {authError && (
                <div
                  style={{
                    marginTop:
                      "10px",

                    padding:
                      "9px 10px",

                    borderRadius:
                      "8px",

                    background:
                      "rgba(239,68,68,0.1)",

                    border:
                      "1px solid rgba(248,113,113,0.2)",

                    color:
                      "#fca5a5",

                    fontSize:
                      "9px",

                    lineHeight:
                      "1.4",
                  }}
                >
                  ⚠ {authError}

                  {isCreate &&
                    authError.includes(
                      "already exists"
                    ) && (
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode(
                            "login"
                          );

                          setPassword(
                            ""
                          );

                          setConfirmPassword(
                            ""
                          );

                          setAuthError(
                            ""
                          );

                          window.scrollTo({
                            top: 0,
                            left: 0,
                            behavior:
                              "auto",
                          });
                        }}
                        style={{
                          display:
                            "block",

                          marginTop:
                            "7px",

                          border:
                            "none",

                          background:
                            "transparent",

                          color:
                            "#93c5fd",

                          cursor:
                            "pointer",

                          padding:
                            0,

                          fontWeight:
                            "900",

                          fontSize:
                            "9px",
                        }}
                      >
                        Log in instead →
                      </button>
                    )}
                </div>
              )}

              {/* SUCCESS */}

              {authSuccess && (
                <div
                  style={{
                    marginTop:
                      "10px",

                    padding:
                      "9px 10px",

                    borderRadius:
                      "8px",

                    background:
                      "rgba(34,197,94,0.1)",

                    border:
                      "1px solid rgba(74,222,128,0.2)",

                    color:
                      "#86efac",

                    fontSize:
                      "9px",
                  }}
                >
                  ✓ {authSuccess}
                </div>
              )}

              {/* SUBMIT */}

              <button
                type="submit"
                style={{
                  width:
                    "100%",

                  marginTop:
                    "15px",

                  padding:
                    "12px",

                  borderRadius:
                    "10px",

                  border:
                    "none",

                  background:
                    "linear-gradient(135deg,#2563eb,#7c3aed)",

                  color:
                    "#ffffff",

                  fontWeight:
                    "900",

                  cursor:
                    "pointer",

                  fontSize:
                    "12px",
                }}
              >
                {isCreate
                  ? "Create Account →"
                  : "Log in →"}
              </button>
            </form>

            {/* SWITCH AUTH MODE */}

            <div
              style={{
                textAlign:
                  "center",

                marginTop:
                  "18px",

                fontSize:
                  "10px",

                color:
                  "#94a3b8",
              }}
            >
              {isCreate
                ? "Already have an account?"
                : "Don't have an account?"}

              <button
                type="button"
                onClick={() => {
                  setAuthMode(
                    isCreate
                      ? "login"
                      : "create"
                  );

                  setPassword("");

                  setConfirmPassword(
                    ""
                  );

                  setAuthError("");

                  setAuthSuccess("");

                  window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior:
                      "auto",
                  });
                }}
                style={{
                  border:
                    "none",

                  background:
                    "transparent",

                  color:
                    "#93c5fd",

                  cursor:
                    "pointer",

                  fontWeight:
                    "900",

                  fontSize:
                    "10px",

                  marginLeft:
                    "4px",
                }}
              >
                {isCreate
                  ? "Log in"
                  : "Create account"}
              </button>
            </div>

            {/* BACK HOME */}

            <button
              type="button"
              onClick={() => {
                setCurrentPage(
                  "home"
                );

                window.scrollTo({
                  top: 0,
                  left: 0,
                  behavior:
                    "auto",
                });
              }}
              style={{
                width:
                  "100%",

                marginTop:
                  "15px",

                border:
                  "none",

                background:
                  "transparent",

                color:
                  "#64748b",

                cursor:
                  "pointer",

                fontSize:
                  "9px",
              }}
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // COPILOT PAGE
  // =====================================================

  return (
    <div
      className="app-container"
      style={{
        fontFamily:
          "Arial, Helvetica, sans-serif",

        padding:
          "20px",

        background:
          "#f8fafc",

        minHeight:
          "100vh",

        boxSizing:
          "border-box",
      }}
    >
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <header
        style={{
          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "space-between",

          marginBottom:
            "22px",

          padding:
            "12px 16px",

          background:
            "#ffffff",

          border:
            "1px solid #e2e8f0",

          borderRadius:
            "14px",

          boxShadow:
            "0 4px 15px rgba(15,23,42,0.04)",
        }}
      >
        <div
          style={{
            display:
              "flex",

            alignItems:
              "center",

            gap:
              "11px",
          }}
        >
          {/* LOGO */}

          <div
            style={{
              width:
                "42px",

              height:
                "42px",

              borderRadius:
                "12px",

              background:
                "linear-gradient(135deg,#7c3aed,#2563eb)",

              color:
                "#ffffff",

              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              fontSize:
                "20px",

              fontWeight:
                "900",
            }}
          >
            M
          </div>

          <div>
            <h1
              style={{
                margin:
                  0,

                fontSize:
                  "19px",

                color:
                  "#0f172a",

                fontWeight:
                  "950",
              }}
            >
              Merchant Growth Co-Pilot
            </h1>

            <p
              style={{
                margin:
                  "3px 0 0",

                color:
                  "#64748b",

                fontSize:
                  "9px",
              }}
            >
              AI-powered revenue intelligence
            </p>
          </div>
        </div>

        <div
          style={{
            display:
              "flex",

            alignItems:
              "center",

            gap:
              "8px",

            flexWrap:
              "wrap",

            justifyContent:
              "flex-end",
          }}
        >
          <button
            type="button"
            onClick={() => {
              window.location.href =
                "/merchant-checkout-agent/index.html";
            }}
            style={{
              padding:
                "9px 13px",

              borderRadius:
                "9px",

              border:
                "1px solid #bfdbfe",

              background:
                "linear-gradient(135deg,#eff6ff,#ecfdf5)",

              color:
                "#1d4ed8",

              cursor:
                "pointer",

              fontSize:
                "9px",

              fontWeight:
                "900",

              boxShadow:
                "0 3px 10px rgba(37,99,235,0.08)",
            }}
          >
            🤖 AI Checkout Agent →
          </button>

          <button
            type="button"
            onClick={
              handleLogout
            }
            style={{
              padding:
                "8px 12px",

              borderRadius:
                "8px",

              border:
                "1px solid #e2e8f0",

              background:
                "#ffffff",

              color:
                "#475569",

              cursor:
                "pointer",

              fontSize:
                "9px",

              fontWeight:
                "800",
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* ================================================= */}
      {/* DATASET UPLOADER */}
      {/* ================================================= */}

      <div
        style={{
          maxWidth:
            "900px",

          margin:
            "0 auto 20px auto",
        }}
      >
        <DatasetUploader
          onDatasetLoaded={
            handleDatasetLoaded
          }
        />

        {activeDataset.length >
          0 && (
          <div
            style={{
              marginTop:
                "-8px",

              marginBottom:
                "18px",

              padding:
                "10px 14px",

              borderRadius:
                "10px",

              background:
                "linear-gradient(135deg,#ecfdf5,#f0fdf4)",

              border:
                "1px solid #bbf7d0",

              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "space-between",

              gap:
                "12px",
            }}
          >
            <div
              style={{
                display:
                  "flex",

                alignItems:
                  "center",

                gap:
                  "8px",

                minWidth:
                  0,
              }}
            >
              <span
                style={{
                  fontSize:
                    "16px",
                }}
              >
                🟢
              </span>

              <div
                style={{
                  minWidth:
                    0,
                }}
              >
                <div
                  style={{
                    fontSize:
                      "10px",

                    fontWeight:
                      "900",

                    color:
                      "#166534",
                  }}
                >
                  Dataset Active
                </div>

                <div
                  style={{
                    fontSize:
                      "9px",

                    color:
                      "#64748b",

                    overflow:
                      "hidden",

                    textOverflow:
                      "ellipsis",

                    whiteSpace:
                      "nowrap",
                  }}
                >
                  {datasetName ||
                    "Uploaded dataset"}
                </div>
              </div>
            </div>

            <div
              style={{
                fontSize:
                  "10px",

                fontWeight:
                  "900",

                color:
                  "#15803d",

                whiteSpace:
                  "nowrap",
              }}
            >
              {activeDataset.length.toLocaleString()}{" "}
              transactions
            </div>
          </div>
        )}
      </div>

      {/* ================================================= */}
      {/* MAIN */}
      {/* ================================================= */}

      <main
        style={{
          display:
            "flex",

          gap:
            "20px",

          alignItems:
            "flex-start",
        }}
      >
        {/* ================================================= */}
        {/* LEFT SIDE */}
        {/* ================================================= */}

        <div
          style={{
            flex:
              1,

            minWidth:
              0,

            display:
              "flex",

            flexDirection:
              "column",

            gap:
              "20px",
          }}
        >
          {/* CHAT */}

          <ChatPanel
            activeDataset={
              activeDataset
            }
            onAgentResponse={
              handleAgentResponse
            }
            onSimulationUpdate={
              handleSimulationUpdate
            }
            onFixUpdate={
              handleFixUpdate
            }
          />

          {/* FUNNEL ONLY ON LEFT */}

          {activeDataset.length >
            0 && (
            <FunnelChart
              data={
                funnelData
              }
            />
          )}

          {/* ================================================= */}
          {/* HISTORY BELOW FUNNEL */}
          {/* ================================================= */}

          <HistoryPanel
            history={
              analysisHistory
            }
            onDeleteHistory={
              handleDeleteHistory
            }
            onClearAllHistory={
              handleClearAllHistory
            }
          />
        </div>

        {/* ================================================= */}
        {/* RIGHT SIDE */}
        {/* ================================================= */}

        <div
          style={{
            flex:
              1,

            minWidth:
              0,
          }}
        >
          <Dashboard
            activeDataset={
              activeDataset
            }
            agentResponses={
              agentResponses
            }
            simulationData={
              simulationData
            }
            fixedTransactions={
              fixedTransactions
            }
            fixHistory={
              fixHistory
            }
            onClearHistory={
              handleClearHistory
            }
          />
        </div>
      </main>
    </div>
  );
}

export default App;