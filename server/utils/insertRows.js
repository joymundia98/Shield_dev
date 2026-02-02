import { pool } from "../server.js";
import { normalizeRow } from "./normalizeRow.js";
import bcrypt from "bcrypt";

export const insertRows = async (tableName, rows, COLUMN_MAP, conflictColumn = null) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (const row of rows) {
      const normalized = normalizeRow(row, COLUMN_MAP);

      // 🔐 Hash password if inserting into users table
      if (tableName === "users" && normalized.password) {
        const saltRounds = 10;
        normalized.password = await bcrypt.hash(normalized.password, saltRounds);
      }

      const columns = Object.values(COLUMN_MAP).join(", ");
      const values = Object.values(COLUMN_MAP).map((_, i) => `$${i + 1}`);

      const query = `
        INSERT INTO ${tableName} (${columns})
        VALUES (${values.join(", ")})
        ${conflictColumn ? `ON CONFLICT (${conflictColumn}) DO NOTHING` : ""}
      `;

      await client.query(query, Object.values(normalized));
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};
