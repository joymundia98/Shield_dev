import { pool } from "../../server.js";

const ConvertsModel = {
  // Create a new convert
  async create({ convert_type, convert_date, member_id, visitor_id, organization_id, follow_up_status }) {
    const result = await pool.query(
      `
      INSERT INTO converts 
        (convert_type, convert_date, member_id, visitor_id, organization_id, follow_up_status, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING *
      `,
      [convert_type, convert_date, member_id, visitor_id, organization_id, follow_up_status]  // No need for `created_at` and `updated_at` here
    );
    return result.rows[0];
  },

  // Get all converts
  async findAll() {
    const result = await pool.query(`
      SELECT * FROM converts
      ORDER BY created_at DESC
    `);
    return result.rows;
  },

  // Get convert by ID
  async findById(id) {
    const result = await pool.query(
      `SELECT * FROM converts WHERE id = $1 LIMIT 1`,
      [id]
    );
    return result.rows[0];
  },

  // Update convert by ID
  async update(id, { convert_type, convert_date, member_id, visitor_id, organization_id, follow_up_status }) {
    const result = await pool.query(
      `
      UPDATE converts
      SET 
        convert_type = $2,
        convert_date = $3,
        member_id = $4,
        visitor_id = $5,
        organization_id = $6,
        follow_up_status = $7,
        updated_at = NOW()
      WHERE id = $8
      RETURNING *
      `,
      [convert_type, convert_date, member_id, visitor_id, organization_id, follow_up_status, id]
    );
    return result.rows[0];
  },

  // Delete convert by ID
  async delete(id) {
    await pool.query(`DELETE FROM converts WHERE id = $1`, [id]);
    return true;
  },

  // Get converts by member
  async findByMember(member_id) {
    const result = await pool.query(
      `SELECT * FROM converts WHERE member_id = $1 ORDER BY created_at DESC`,
      [member_id]
    );
    return result.rows;
  },

  // Get converts by visitor
  async findByVisitor(visitor_id) {
    const result = await pool.query(
      `SELECT * FROM converts WHERE visitor_id = $1 ORDER BY created_at DESC`,
      [visitor_id]
    );
    return result.rows;
  },

  // Get converts by organization
  async findByOrganization(organization_id) {
    const result = await pool.query(
      `SELECT * FROM converts WHERE organization_id = $1 ORDER BY created_at DESC`,
      [organization_id]
    );
    return result.rows;
  }
};

export default ConvertsModel;
