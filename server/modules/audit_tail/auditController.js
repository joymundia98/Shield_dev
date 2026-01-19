// modules/audit_tail/auditController.js
import AuditModel from "./auditModel.js";

const AuditController = {
  /**
   * GET /api/audit
   * Query Parameters:
   * - user_id (optional)
   * - module (optional)
   * - start_date (optional, YYYY-MM-DD)
   * - end_date (optional, YYYY-MM-DD)
   * - page (optional, default 1)
   * - limit (optional, default 50)
   */
  async getLogs(req, res) {
    try {
      const organization_id = req.auth.organization_id;

      // Filters
      const { user_id, module, start_date, end_date, page = 1, limit = 50 } = req.query;

      const filters = {
        user_id,
        module,
        start_date,
        end_date,
      };

      const offset = (page - 1) * limit;

      // Fetch logs from model
      const logs = await AuditModel.getLogs(organization_id, filters, limit, offset);

      res.json({
        page: Number(page),
        limit: Number(limit),
        count: logs.length,
        logs,
      });
    } catch (err) {
      console.error("Error fetching audit logs:", err);
      res.status(500).json({ error: "Failed to fetch audit logs" });
    }
  }
};

export default AuditController;
