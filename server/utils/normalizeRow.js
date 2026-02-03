export const normalizeRow = (row, COLUMN_MAP) => {
  const normalized = {};
  const headers = Object.keys(row);

  for (const [fileCol, dbCol] of Object.entries(COLUMN_MAP)) {
    // Case-insensitive, space-insensitive match
    const key = headers.find(
      k => k.replace(/[\s_]/g, "").toLowerCase() === fileCol.replace(/[\s_]/g, "").toLowerCase()
    );
    normalized[dbCol] = key ? row[key]?.toString().trim() || null : null;
  }

  return normalized;
};
