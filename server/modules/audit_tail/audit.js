// modules/audit_tail/audit.js
import { pool } from "../../server.js";

const AuditLog = {
  async log(data, client = pool) {
    const {
      user_id,
      organization_id,
      action,
      module,
      record_id,
      old_data,
      new_data,
      ip_address,
      user_agent
    } = data;

    await client.query(
      `
      INSERT INTO audit_trail (
        user_id,
        organization_id,
        action,
        module,
        record_id,
        old_values,
        new_values,
        ip_address,
        user_agent
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9
      )
      `,
      [
        user_id ?? null,
        organization_id ?? null,
        action,
        module,
        record_id,
        old_data ?? null,
        new_data ?? null,
        ip_address ?? null,
        user_agent ?? null
      ]
    );
  },

  async getLogs(organization_id, filters = {}, limit = 50, offset = 0) {
    const { user_id, module, start_date, end_date } = filters;

    const conditions = ["organization_id = $1"];
    const values = [organization_id];
    let idx = 2;

    if (user_id) {
      conditions.push(`user_id = $${idx++}`);
      values.push(user_id);
    }

    if (module) {
      conditions.push(`module = $${idx++}`);
      values.push(module);
    }

    if (start_date) {
      conditions.push(`created_at >= $${idx++}`);
      values.push(start_date);
    }

    if (end_date) {
      conditions.push(`created_at <= $${idx++}`);
      values.push(end_date);
    }

    const query = `
      SELECT *
      FROM audit_trail
      WHERE ${conditions.join(" AND ")}
      ORDER BY created_at DESC
      LIMIT $${idx++} OFFSET $${idx++}
    `;

    values.push(limit, offset);

    const result = await pool.query(query, values);
    return result.rows;
  }
};

export default AuditLog;
