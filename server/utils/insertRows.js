// utils/insertRows.js
import { pool } from "../server.js";

export const insertRows = async (tableName, rows, COLUMN_MAP, conflictColumn = null) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const columns = Object.values(COLUMN_MAP);
    const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ");

    const query = `
      INSERT INTO ${tableName} (${columns.join(", ")})
      VALUES (${placeholders})
      ${conflictColumn ? `ON CONFLICT (${conflictColumn}) DO NOTHING` : ""}
    `;

    console.log("🧪 SQL QUERY:", query);

    for (const row of rows) {
      const values = columns.map(col => row[col] ?? null);
      console.log("🧪 VALUES:", values);

      const result = await client.query(query, values);
      console.log("🧪 ROW INSERTED:", result.rowCount);
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ INSERT FAILED:", err);
    throw err;
  } finally {
    client.release();
  }
};
