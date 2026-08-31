// src/agent/fixes.js

// -----------------------------------------
// RECOVERY RATE
// -----------------------------------------
//
// 40% of the identified failed transactions
// are recovered when the fix is implemented.
//
// This is deterministic, so the dashboard,
// simulation and implementation remain consistent.
//

export const FIX_RECOVERY_RATE = 0.40;


// -----------------------------------------
// APPLY FIX
// -----------------------------------------

export function applyFix(
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
  // IF NO DIAGNOSIS
  // -----------------------------------------

  if (
    !diagnosis ||
    diagnosis.category !== "revenue_leak"
  ) {
    return transactions.map(
      (transaction) => ({
        ...transaction,
      })
    );
  }

  // -----------------------------------------
  // TARGET SEGMENT
  // -----------------------------------------

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

  // -----------------------------------------
  // FIND FAILED TARGET TRANSACTIONS
  // -----------------------------------------

  const targetFailedIndexes = [];

  transactions.forEach(
    (transaction, index) => {
      const status = String(
        transaction.status ?? ""
      ).toLowerCase();

      if (status === "success") {
        return;
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

      const matchesTarget =
        paymentMethod === targetPayment &&
        deviceType === targetDevice &&
        cityTier === targetCityTier;

      if (matchesTarget) {
        targetFailedIndexes.push(index);
      }
    }
  );

  // -----------------------------------------
  // DETERMINE HOW MANY TO RECOVER
  // -----------------------------------------

  const recoveryCount =
    Math.max(
      1,
      Math.floor(
        targetFailedIndexes.length *
          FIX_RECOVERY_RATE
      )
    );

  // -----------------------------------------
  // RECOVER TRANSACTIONS
  // -----------------------------------------

  const indexesToRecover =
    new Set(
      targetFailedIndexes.slice(
        0,
        recoveryCount
      )
    );

  const updatedTransactions =
    transactions.map(
      (transaction, index) => {
        if (
          indexesToRecover.has(index)
        ) {
          return {
            ...transaction,
            status: "success",
          };
        }

        return {
          ...transaction,
        };
      }
    );

  return updatedTransactions;
}