import { pool } from "../../../server.js";

const ExpenseSubcategory = {
  async getAll(orgId) {
    const result = await pool.query(
      `
      SELECT es.id, es.name, es.category_id, es.organization_id
      FROM expense_subcategories es
      WHERE es.organization_id = $1
      ORDER BY es.id ASC
      `,
      [orgId]
    );
    return result.rows;
  },

  async getById(id, organization_id) {
    const result = await pool.query(
      `SELECT id, name, category_id, organization_id
       FROM expense_subcategories 
       WHERE id=$1 AND organization_id=$2`,
      [id, organization_id]
    );
    return result.rows[0] || null;
  },

  async create(data) {
    const { name, category_id, organization_id } = data;

    const result = await pool.query(
      `
      INSERT INTO expense_subcategories (category_id, name, organization_id)
      VALUES ($1, $2, $3)
      RETURNING id, name, category_id, organization_id
      `,
      [category_id, name, organization_id]
    );

    return result.rows[0];
  },

  async update(id, data) {
    const { name, category_id, organization_id } = data;

    const result = await pool.query(
      `
      UPDATE expense_subcategories
      SET category_id=$1, name=$2, organization_id=$3
      WHERE id=$4
      RETURNING id, name, category_id, organization_id
      `,
      [category_id, name, organization_id, id]
    );

    return result.rows[0];
  },

  async delete(id, organization_id) {
    const result = await pool.query(
      `DELETE FROM expense_subcategories WHERE id=$1 AND organization_id=$2
       RETURNING id, name, category_id, organization_id`,
      [id, organization_id]
    );
    return result.rows[0];
  }
};

export default ExpenseSubcategory;
