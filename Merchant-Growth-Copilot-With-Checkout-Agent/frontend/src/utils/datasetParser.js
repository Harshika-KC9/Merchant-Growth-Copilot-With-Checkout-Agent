// src/utils/datasetParser.js

export async function parseDataset(file) {
  if (!file) {
    throw new Error("No file selected.");
  }

  const fileName = file.name;
  const extension =
    fileName.split(".").pop().toLowerCase();

  if (
    extension !== "csv" &&
    extension !== "json"
  ) {
    throw new Error(
      "Please upload a CSV or JSON file."
    );
  }

  const text =
    await file.text();

  if (!text.trim()) {
    throw new Error(
      "The selected file is empty."
    );
  }

  let data = [];

  // ==========================================
  // JSON
  // ==========================================

  if (extension === "json") {
    try {
      const parsed =
        JSON.parse(text);

      if (Array.isArray(parsed)) {
        data = parsed;
      } else if (
        Array.isArray(parsed.transactions)
      ) {
        data =
          parsed.transactions;
      } else {
        throw new Error(
          "JSON must contain an array of transactions."
        );
      }
    } catch (error) {
      throw new Error(
        "Invalid JSON dataset."
      );
    }
  }

  // ==========================================
  // CSV
  // ==========================================

  if (extension === "csv") {
    const lines =
      text
        .trim()
        .split(/\r?\n/);

    if (lines.length < 2) {
      throw new Error(
        "CSV must contain headers and at least one row."
      );
    }

    const headers =
      lines[0]
        .split(",")
        .map((header) =>
          header
            .trim()
            .replace(/^"|"$/g, "")
        );

    for (
      let i = 1;
      i < lines.length;
      i++
    ) {
      const values =
        lines[i]
          .split(",")
          .map((value) =>
            value
              .trim()
              .replace(/^"|"$/g, "")
          );

      if (
        values.length !==
        headers.length
      ) {
        continue;
      }

      const row = {};

      headers.forEach(
        (header, index) => {
          row[header] =
            values[index];
        }
      );

      data.push(row);
    }
  }

  if (data.length === 0) {
    throw new Error(
      "No valid transactions found in the dataset."
    );
  }

  // ==========================================
  // NORMALIZE COMMON FIELDS
  // ==========================================

  data = data.map(
    (transaction) => ({
      ...transaction,

      status:
        transaction.status ||
        "unknown",

      payment_method:
        transaction.payment_method ||
        "Unknown",

      device_type:
        transaction.device_type ||
        "Unknown",

      city_tier:
        transaction.city_tier ||
        "Unknown",
    })
  );

  return {
    data,
    fileName,
    rowCount: data.length,
  };
}