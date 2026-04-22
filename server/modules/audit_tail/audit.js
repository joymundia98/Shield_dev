import { pool } from "../../server.js";

const AuditLog = {
  /**
   * Create an audit log entry
   */
  async log(data, client = pool) {
    const {
      user_id = null,
      organization_id = null,
      action,
      module,
      record_id = null,
      old_data = null,
      new_data = null,
      ip_address = null,
      user_agent = null
    } = data;

    if (!action || !module) {
      throw new Error("Audit log requires 'action' and 'module'");
    }

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
        user_id,
        organization_id,
        action,
        module,
        record_id,
        old_data ? JSON.stringify(old_data) : null,
        new_data ? JSON.stringify(new_data) : null,
        ip_address,
        user_agent
      ]
    );
  },

  async getLogsWithCount(organization_id, filters, limit, offset, client = pool) {
  const { user_id, module, start_date, end_date } = filters;

  const conditions = [];
  const values = [];
  let idx = 1;

  conditions.push(`a.organization_id = $${idx++}`);
  values.push(organization_id);

  if (user_id) {
    conditions.push(`a.user_id = $${idx++}`);
    values.push(user_id);
  }

  if (module) {
    conditions.push(`a.module = $${idx++}`);
    values.push(module);
  }

  if (start_date) {
    conditions.push(`a.created_at >= $${idx++}`);
    values.push(start_date);
  }

  if (end_date) {
    conditions.push(`a.created_at < ($${idx++}::date + interval '1 day')`);
    values.push(end_date);
  }

  const whereClause = conditions.join(" AND ");

  // ✅ main query
  const dataQuery = `
    SELECT a.*, u.name as user_name
    FROM audit_trail a
    LEFT JOIN users u ON u.id = a.user_id
    WHERE ${whereClause}
    ORDER BY a.created_at DESC
    LIMIT $${idx++} OFFSET $${idx++}
  `;

  const dataValues = [...values, limit, offset];

  // ✅ count query
  const countQuery = `
    SELECT COUNT(*) 
    FROM audit_trail a
    WHERE ${whereClause}
  `;

  const [dataResult, countResult] = await Promise.all([
    client.query(dataQuery, dataValues),
    client.query(countQuery, values)
  ]);

  return {
    logs: dataResult.rows,
    total: parseInt(countResult.rows[0].count, 10)
  };
},

  /**
   * Get audit logs with filters + pagination
   */
  async getLogs(
    organization_id,
    filters = {},
    limit = 50,
    offset = 0,
    client = pool
  ) {
    const { user_id, module, start_date, end_date } = filters;

    const conditions = [];
    const values = [];
    let idx = 1;

    // Required filter
    conditions.push(`organization_id = $${idx++}`);
    values.push(organization_id);

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
      // include full end date day
      conditions.push(`created_at < ($${idx++}::date + interval '1 day')`);
      values.push(end_date);
    }

    // Pagination
    const limitIdx = idx++;
    const offsetIdx = idx++;

    values.push(limit);
    values.push(offset);

    const query = `
      SELECT *
      FROM audit_trail
      WHERE ${conditions.join(" AND ")}
      ORDER BY created_at DESC
      LIMIT $${limitIdx} OFFSET $${offsetIdx}
    `;

    const result = await client.query(query, values);
    return result.rows;
  }
};

export default AuditLog;