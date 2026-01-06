import { pool } from "../../../server.js";

const Expense = {
  async getAll(orgId) {
    const result = await pool.query(`
      SELECT id, subcategory_id, user_id, department_id, organization_id,
             date, description, amount, status, created_at
      FROM expenses
      WHERE organization_id = $1
      ORDER BY id ASC
    `, [orgId]);

    return result.rows;
  },

  async getById(id) {
    const result = await pool.query(
      `SELECT id, subcategory_id, user_id, department_id, organization_id,
              date, description, amount, status, created_at
       FROM expenses
       WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  },

  async create(data) {
    const {
      subcategory_id,
      user_id,
      department_id,
      organization_id,
      date,
      description,
      amount,
      status
    } = data;

    const result = await pool.query(
      `INSERT INTO expenses (
        subcategory_id, user_id, department_id, organization_id, date,
        description, amount, status
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *`,
      [
        subcategory_id,
        user_id,
        department_id,
        organization_id,
        date,
        description,
        amount,
        status || "Pending"
      ]
    );

    return result.rows[0];
  },

  async update(id, data) {
    const {
      subcategory_id,
      user_id,
      department_id,
      organization_id,
      date,
      description,
      amount,
      status
    } = data;

    const result = await pool.query(
      `UPDATE expenses SET
        subcategory_id=$1,
        user_id=$2,
        department_id=$3,
        organization_id=$4,
        date=$5,
        description=$6,
        amount=$7,
        status=$8
      WHERE id=$9
      RETURNING *`,
      [
        subcategory_id,
        user_id,
        department_id,
        organization_id,
        date,
        description,
        amount,
        status,
        id
      ]
    );

    return result.rows[0];
  },

  async updateStatus(id, status) {
    const result = await pool.query(
      `UPDATE expenses
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query(
      `DELETE FROM expenses WHERE id=$1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  },

  // Optional: get expenses by organization
  async getByOrganization(orgId) {
    const result = await pool.query(
      `SELECT * FROM expenses WHERE organization_id=$1 ORDER BY id ASC`,
      [orgId]
    );
    return result.rows;
  }
};

export default Expense;
