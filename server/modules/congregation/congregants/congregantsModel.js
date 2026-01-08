import { pool } from "../../../server.js";

const Congregant = {
  // GET ALL (organization scoped)
  async getAll(organization_id) {
    const result = await pool.query(
      `
      SELECT id, name, gender, category_id
      FROM congregants
      WHERE organization_id = $1
      ORDER BY id ASC
      `,
      [organization_id]
    );
    return result.rows;
  },

  // GET BY ID (organization scoped)
  async getById(id, organization_id) {
    const result = await pool.query(
      `
      SELECT id, name, gender, category_id
      FROM congregants
      WHERE id = $1 AND organization_id = $2
      `,
      [id, organization_id]
    );
    return result.rows[0] || null;
  },

  // CREATE (organization enforced)
  async create(data, organization_id) {
    const { name, gender, category_id } = data;

    const result = await pool.query(
      `
      INSERT INTO congregants (name, gender, category_id, organization_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, gender, category_id
      `,
      [name, gender, category_id, organization_id]
    );

    return result.rows[0];
  },

  // UPDATE (organization safe)
  async update(id, organization_id, data) {
    const { name, gender, category_id } = data;

    const result = await pool.query(
      `
      UPDATE congregants
      SET name = $1,
          gender = $2,
          category_id = $3,
          updated_at = NOW()
      WHERE id = $4 AND organization_id = $5
      RETURNING id, name, gender, category_id
      `,
      [name, gender, category_id, id, organization_id]
    );

    return result.rows[0] || null;
  },

  // DELETE (organization safe)
  async delete(id, organization_id) {
    const result = await pool.query(
      `
      DELETE FROM congregants
      WHERE id = $1 AND organization_id = $2
      RETURNING id, name, gender, category_id
      `,
      [id, organization_id]
    );

    return result.rows[0] || null;
  }
};

export default Congregant;
