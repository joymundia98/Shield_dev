export const normalizeRow = (row, COLUMN_MAP) => {
  const normalized = {};
  for (const [fileCol, dbCol] of Object.entries(COLUMN_MAP)) {
    normalized[dbCol] = row[fileCol]?.toString().trim() || null;
  }
  return normalized;
};
