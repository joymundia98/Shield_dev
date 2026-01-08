import { pool } from "../../../../server.js";

const VisitorService = {
  // Add a visitor to a service (Create relationship)
  async add(data, organization_id) {
    const { visitor_id, service_id } = data;
    const result = await pool.query(
      `INSERT INTO visitor_service (visitor_id, service_id, organization_id) 
       VALUES ($1, $2, $3) 
       RETURNING visitor_id, service_id, organization_id`,
      [visitor_id, service_id, organization_id]
    );
    return result.rows[0]; // Return the newly created record
  },

  // Remove a visitor from a service (Delete relationship)
  async remove(visitor_id, service_id, organization_id) {
    const result = await pool.query(
      `DELETE FROM visitor_service 
       WHERE visitor_id = $1 AND service_id = $2 AND organization_id = $3
       RETURNING visitor_id, service_id, organization_id`,
      [visitor_id, service_id, organization_id]
    );
    return result.rows[0]; // Return the removed record or null if not found
  },

  // Get all services attended by a specific visitor within the organization
  async getServicesByVisitor(visitor_id, organization_id) {
    const result = await pool.query(
      `SELECT s.* 
       FROM services s
       JOIN visitor_service vs ON s.id = vs.service_id
       WHERE vs.visitor_id = $1 AND vs.organization_id = $2`,
      [visitor_id, organization_id]
    );
    return result.rows; // Return all services attended by the visitor
  }
};

export default VisitorService;
