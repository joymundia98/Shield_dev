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
  }
};

export default AuditLog;
