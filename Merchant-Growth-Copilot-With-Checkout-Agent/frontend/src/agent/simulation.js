// src/agent/simulation.js

import {
  FIX_RECOVERY_RATE,
} from "./fixes";

export function simulateRevenueFix(
  transactions = [],
  diagnosis = null
) {
  // -----------------------------------------
  // SAFETY CHECK
  // -----------------------------------------

  if (
    !Array.isArray(transactions) ||
    transactions.length === 0
  ) {
    return [];
  }

  // -----------------------------------------
  // CURRENT REVENUE
  // -----------------------------------------

  const currentRevenue =
    transactions
      .filter(
        (transaction) => {
          const status =
            String(
              transaction.status ?? ""
            ).toLowerCase();

          return status === "success";
        }
      )
      .reduce(
        (sum, transaction) =>
          sum +
          (Number(
            transaction.amount
          ) || 0),
        0
      );

  // -----------------------------------------
  // TARGET FAILED TRANSACTIONS
  // -----------------------------------------

  let targetFailedTransactions =
    [];

  if (
    diagnosis &&
    diagnosis.category ===
      "revenue_leak"
  ) {
    const targetPayment =
      String(
        diagnosis.paymentMethod || ""
      ).toLowerCase();

    const targetDevice =
      String(
        diagnosis.deviceType || ""
      ).toLowerCase();

    const targetCityTier =
      String(
        diagnosis.cityTier || ""
      ).toLowerCase();

    targetFailedTransactions =
      transactions.filter(
        (transaction) => {
          const status =
            String(
              transaction.status ?? ""
            ).toLowerCase();

          if (
            status === "success"
          ) {
            return false;
          }

          const paymentMethod =
            String(
              transaction.payment_method ||
                transaction.paymentMethod ||
                "Unknown"
            ).toLowerCase();

          const deviceType =
            String(
              transaction.device_type ||
                transaction.deviceType ||
                "Unknown"
            ).toLowerCase();

          const cityTier =
            String(
              transaction.city_tier ||
                transaction.cityTier ||
                "Unknown"
            ).toLowerCase();

          return (
            paymentMethod ===
              targetPayment &&
            deviceType ===
              targetDevice &&
            cityTier ===
              targetCityTier
          );
        }
      );
  }

  // -----------------------------------------
  // EXPECTED RECOVERY
  // -----------------------------------------

  const recoveryCount =
    targetFailedTransactions.length > 0
      ? Math.max(
          1,
          Math.floor(
            targetFailedTransactions.length *
              FIX_RECOVERY_RATE
          )
        )
      : 0;

  const recoveredRevenue =
    targetFailedTransactions
      .slice(0, recoveryCount)
      .reduce(
        (sum, transaction) =>
          sum +
          (Number(
            transaction.amount
          ) || 0),
        0
      );

  // -----------------------------------------
  // PROJECTED REVENUE
  // -----------------------------------------

  const projectedRevenue =
    currentRevenue +
    recoveredRevenue;

  // -----------------------------------------
  // REVENUE LIFT %
  // -----------------------------------------

  const revenueLift =
    currentRevenue > 0
      ? (
          (recoveredRevenue /
            currentRevenue) *
          100
        )
      : recoveredRevenue > 0
      ? 100
      : 0;

  // -----------------------------------------
  // RETURN CHART DATA
  // -----------------------------------------

  return [
    {
      scenario:
        "Current Revenue",
      revenue:
        currentRevenue,
    },

    {
      scenario:
        "Projected Revenue",
      revenue:
        projectedRevenue,
    },

    {
      scenario:
        "Revenue Lift",
      revenue:
        recoveredRevenue,
      liftPercentage:
        Number(
          revenueLift.toFixed(2)
        ),
    },
  ];
}