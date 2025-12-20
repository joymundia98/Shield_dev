// modules/audit_tail/audit.js
import { pool } from "../../server.js";

const AuditLog = {
  async log({
    user_id,
    organization_id,
    action,
    module,
    record_id,
    old_values,  // renamed
    new_values,  // renamed
    ip_address,
    user_agent
  }) {
    await pool.query(
      `
      INSERT INTO audit_trail (
        user_id, organization_id, action, module,
        record_id, old_values, new_values, ip_address, user_agent
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      `,
      [
        user_id,
        organization_id,
        action,
        module,
        record_id,
        old_values ? JSON.stringify(old_values) : null,
        new_values ? JSON.stringify(new_values) : null,
        ip_address,
        user_agent
      ]
    );
  }
};

export default AuditLog;
