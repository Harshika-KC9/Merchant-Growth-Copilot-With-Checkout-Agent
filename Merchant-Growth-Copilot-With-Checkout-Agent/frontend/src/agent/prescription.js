// src/agent/prescription.js

export function prescribeFix(diagnosis) {
  // -----------------------------------------
  // SAFETY CHECK
  // -----------------------------------------

  if (!diagnosis) {
    return {
      text:
        "Upload a dataset to generate a recommendation.",
      action: "none",
    };
  }

  // -----------------------------------------
  // EMPTY DATASET
  // -----------------------------------------

  if (
    diagnosis.category === "empty"
  ) {
    return {
      text:
        "Upload a transaction dataset to generate a recommendation.",
      action: "none",
    };
  }

  // -----------------------------------------
  // HEALTHY DATASET
  // -----------------------------------------

  if (
    diagnosis.category === "healthy"
  ) {
    return {
      text:
        "Transaction health looks good. Continue monitoring.",
      action: "monitor",
    };
  }

  // -----------------------------------------
  // PAYMENT METHOD
  // -----------------------------------------

  const payment =
    String(
      diagnosis.paymentMethod || ""
    ).toLowerCase();

  // -----------------------------------------
  // UPI
  // -----------------------------------------

  if (
    payment.includes("upi")
  ) {
    return {
      text:
        `Recommended fix: Improve UPI Intent handling and add automatic retry support for failed ${diagnosis.deviceType} transactions in ${diagnosis.cityTier}.`,
      action: "upi_retry",
    };
  }

  // -----------------------------------------
  // CARD
  // -----------------------------------------

  if (
    payment.includes("card")
  ) {
    return {
      text:
        `Recommended fix: Improve OTP delivery and add a 3DS fallback for failed ${diagnosis.deviceType} card transactions in ${diagnosis.cityTier}.`,
      action: "card_3ds",
    };
  }

  // -----------------------------------------
  // WALLET
  // -----------------------------------------

  if (
    payment.includes("wallet")
  ) {
    return {
      text:
        `Recommended fix: Improve wallet integration and error handling for failed ${diagnosis.deviceType} transactions in ${diagnosis.cityTier}.`,
      action: "wallet_sdk",
    };
  }

  // -----------------------------------------
  // NET BANKING
  // -----------------------------------------

  if (
    payment.includes("net") ||
    payment.includes("bank")
  ) {
    return {
      text:
        `Recommended fix: Improve bank timeout handling and add retry support for failed ${diagnosis.deviceType} transactions in ${diagnosis.cityTier}.`,
      action: "bank_retry",
    };
  }

  // -----------------------------------------
  // GENERIC FIX
  // -----------------------------------------

  return {
    text:
      `Recommended fix: Investigate ${diagnosis.paymentMethod} failures for ${diagnosis.deviceType} users in ${diagnosis.cityTier}.`,
    action: "investigate",
  };
}