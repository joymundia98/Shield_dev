// modules/audit_trail/auditController.js
import AuditModel from "./audit.js";
import { formatAuditLog } from "./auditFormatter.js"; // ✅ ADD THIS

const AuditController = {
  async getLogs(req, res) {
    try {
      const organization_id = req.auth.organization_id;

      let {
        user_id,
        module,
        start_date,
        end_date,
        page = 1,
        limit = 50
      } = req.query;

      // ✅ sanitize inputs
      page = parseInt(page, 10);
      limit = parseInt(limit, 10);

      if (isNaN(page) || page < 1) page = 1;
      if (isNaN(limit) || limit < 1 || limit > 100) limit = 50; // cap limit

      const offset = (page - 1) * limit;

      const filters = {
        user_id: user_id ? Number(user_id) : null,
        module: module || null,
        start_date: start_date || null,
        end_date: end_date || null
      };

      // ✅ get logs + total count
      const { logs, total } = await AuditModel.getLogsWithCount(
        organization_id,
        filters,
        limit,
        offset
      );

      // ✅ format logs for UI
      const formattedLogs = logs.map(formatAuditLog);

      res.json({
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
        logs: formattedLogs
      });

    } catch (err) {
      console.error("Error fetching audit logs:", err);
      res.status(500).json({ error: "Failed to fetch audit logs" });
    }
  }
};

export default AuditController;