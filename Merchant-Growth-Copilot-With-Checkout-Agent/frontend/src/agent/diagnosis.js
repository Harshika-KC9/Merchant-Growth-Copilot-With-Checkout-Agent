// src/agent/diagnosis.js

export function diagnoseRevenueLeak(transactions = []) {
  // -----------------------------------------
  // SAFETY CHECK
  // -----------------------------------------

  if (
    !Array.isArray(transactions) ||
    transactions.length === 0
  ) {
    return {
      category: "empty",
      message:
        "Upload a transaction dataset to begin analysis.",
    };
  }

  // -----------------------------------------
  // GROUP FAILED TRANSACTIONS
  // -----------------------------------------

  const grouped = {};

  transactions.forEach((transaction) => {
    const status = String(
      transaction.status ?? ""
    ).toLowerCase();

    if (status !== "success") {
      const paymentMethod =
        transaction.payment_method ||
        transaction.paymentMethod ||
        "Unknown";

      const deviceType =
        transaction.device_type ||
        transaction.deviceType ||
        "Unknown";

      const cityTier =
        transaction.city_tier ||
        transaction.cityTier ||
        "Unknown";

      const key =
        `${paymentMethod}-${deviceType}-${cityTier}`;

      if (!grouped[key]) {
        grouped[key] = {
          paymentMethod,
          deviceType,
          cityTier,
          count: 0,
          failedRevenue: 0,
        };
      }

      grouped[key].count += 1;

      grouped[key].failedRevenue +=
        Number(transaction.amount) || 0;
    }
  });

  // -----------------------------------------
  // OVERALL TRANSACTION HEALTH
  // -----------------------------------------

  const totalTransactions =
    transactions.length;

  const successfulTransactions =
    transactions.filter(
      (transaction) =>
        String(
          transaction.status ?? ""
        ).toLowerCase() === "success"
    ).length;

  const failedTransactions =
    totalTransactions -
    successfulTransactions;

  const successRate =
    totalTransactions > 0
      ? (
          (successfulTransactions /
            totalTransactions) *
          100
        ).toFixed(1)
      : "0.0";

  const failureRate =
    totalTransactions > 0
      ? (
          (failedTransactions /
            totalTransactions) *
          100
        ).toFixed(1)
      : "0.0";

  // -----------------------------------------
  // NO FAILURES
  // -----------------------------------------

  if (Object.keys(grouped).length === 0) {
    return {
      category: "healthy",
      totalTransactions,
      successfulTransactions,
      failedTransactions,
      successRate,
      failureRate,
      message:
        `Healthy dataset — ${totalTransactions.toLocaleString()} transactions analyzed with a ${successRate}% success rate.`,
    };
  }

  // -----------------------------------------
  // FIND WORST FAILURE PATTERN
  // -----------------------------------------

  let worstPattern = null;

  Object.values(grouped).forEach((pattern) => {
    if (
      !worstPattern ||
      pattern.count > worstPattern.count
    ) {
      worstPattern = pattern;
    }
  });

  // -----------------------------------------
  // RETURN STRUCTURED DIAGNOSIS
  // -----------------------------------------

  return {
    category: "revenue_leak",

    totalTransactions,
    successfulTransactions,
    failedTransactions,

    successRate,
    failureRate,

    paymentMethod:
      worstPattern.paymentMethod,

    deviceType:
      worstPattern.deviceType,

    cityTier:
      worstPattern.cityTier,

    failedCount:
      worstPattern.count,

    failedRevenue:
      worstPattern.failedRevenue,

    message:
      `Main revenue leak: ${worstPattern.count} failed ${worstPattern.paymentMethod} transactions from ${worstPattern.deviceType} users in ${worstPattern.cityTier}. Success rate: ${successRate}%. Failed revenue in this segment: ₹${worstPattern.failedRevenue.toLocaleString()}.`,
  };
}