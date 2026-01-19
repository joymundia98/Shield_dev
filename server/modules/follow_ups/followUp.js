import { pool } from "../../server.js";

const FollowUpsModel = {
  // CREATE (organization enforced)
  async create(data, organization_id) {
    const { visitor_id, followup_date, type, notes } = data;

    const result = await pool.query(
      `
      INSERT INTO follow_ups (visitor_id, followup_date, type, notes, organization_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [visitor_id, followup_date, type, notes, organization_id]
    );

    return result.rows[0];
  },

  // GET ALL (organization scoped)
  async findAll(organization_id) {
    const result = await pool.query(
      `
      SELECT * 
      FROM follow_ups 
      WHERE organization_id = $1
      ORDER BY followup_date DESC
      `,
      [organization_id]
    );
    return result.rows;
  },

  // GET BY ID (organization scoped)
  async findById(id, organization_id) {
    const result = await pool.query(
      `
      SELECT * 
      FROM follow_ups 
      WHERE followup_id = $1 
        AND organization_id = $2
      LIMIT 1
      `,
      [id, organization_id]
    );
    return result.rows[0] || null;
  },

  // UPDATE (organization safe)
  async update(id, data, organization_id) {
    const { visitor_id, followup_date, type, notes } = data;

    const result = await pool.query(
      `
      UPDATE follow_ups
      SET 
        visitor_id = COALESCE($1, visitor_id),
        followup_date = COALESCE($2, followup_date),
        type = COALESCE($3, type),
        notes = COALESCE($4, notes),
        updated_at = NOW()
      WHERE followup_id = $5
        AND organization_id = $6
      RETURNING *
      `,
      [visitor_id, followup_date, type, notes, id, organization_id]
    );

    return result.rows[0] || null;
  },

  // DELETE (organization safe)
  async delete(id, organization_id) {
    const result = await pool.query(
      `
      DELETE FROM follow_ups
      WHERE followup_id = $1
        AND organization_id = $2
      RETURNING *
      `,
      [id, organization_id]
    );

    return result.rows[0] || null;
  },

  // FIND BY VISITOR (organization scoped)
  async findByVisitor(visitor_id, organization_id) {
    const result = await pool.query(
      `
      SELECT * 
      FROM follow_ups 
      WHERE visitor_id = $1
        AND organization_id = $2
      ORDER BY followup_date DESC
      `,
      [visitor_id, organization_id]
    );
    return result.rows;
  },
};

export default FollowUpsModel;
