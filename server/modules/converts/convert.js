import { pool } from "../../server.js";

const ConvertsModel = {
  // CREATE convert (org enforced)
  async create(
    { convert_type, convert_date, member_id, visitor_id, follow_up_status },
    organization_id
  ) {
    const result = await pool.query(
      `
      INSERT INTO converts (
        convert_type,
        convert_date,
        member_id,
        visitor_id,
        organization_id,
        follow_up_status,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING *
      `,
      [
        convert_type,
        convert_date,
        member_id,
        visitor_id,
        organization_id,
        follow_up_status,
      ]
    );

    return result.rows[0];
  },

  // GET all converts (org scoped)
  async findAll(organization_id) {
    const result = await pool.query(
      `
      SELECT *
      FROM converts
      WHERE organization_id = $1
      ORDER BY created_at DESC
      `,
      [organization_id]
    );

    return result.rows;
  },

  // GET convert by ID (org scoped)
  async findById(id, organization_id) {
    const result = await pool.query(
      `
      SELECT *
      FROM converts
      WHERE id = $1 AND organization_id = $2
      LIMIT 1
      `,
      [id, organization_id]
    );

    return result.rows[0];
  },

  // UPDATE convert (org locked)
  async update(
    id,
    { convert_type, convert_date, member_id, visitor_id, follow_up_status },
    organization_id
  ) {
    const result = await pool.query(
      `
      UPDATE converts
      SET
        convert_type = $1,
        convert_date = $2,
        member_id = $3,
        visitor_id = $4,
        follow_up_status = $5,
        updated_at = NOW()
      WHERE id = $6 AND organization_id = $7
      RETURNING *
      `,
      [
        convert_type,
        convert_date,
        member_id,
        visitor_id,
        follow_up_status,
        id,
        organization_id,
      ]
    );

    return result.rows[0];
  },

  // DELETE convert (org scoped)
  async delete(id, organization_id) {
    const result = await pool.query(
      `
      DELETE FROM converts
      WHERE id = $1 AND organization_id = $2
      RETURNING id
      `,
      [id, organization_id]
    );

    return result.rowCount > 0;
  },

  // GET converts by member (org scoped)
  async findByMember(member_id, organization_id) {
    const result = await pool.query(
      `
      SELECT *
      FROM converts
      WHERE member_id = $1 AND organization_id = $2
      ORDER BY created_at DESC
      `,
      [member_id, organization_id]
    );

    return result.rows;
  },

  // GET converts by visitor (org scoped)
  async findByVisitor(visitor_id, organization_id) {
    const result = await pool.query(
      `
      SELECT *
      FROM converts
      WHERE visitor_id = $1 AND organization_id = $2
      ORDER BY created_at DESC
      `,
      [visitor_id, organization_id]
    );

    return result.rows;
  },
};

export default ConvertsModel;
