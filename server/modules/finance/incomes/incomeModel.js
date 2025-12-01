import { pool } from "../../../server.js";

const Income = {
  async getAll() {
    const result = await pool.query(`
      SELECT id, subcategory_id, user_id, donor_id,
             date, giver, description, amount, status, created_at
      FROM incomes
      ORDER BY id ASC
    `);

    return result.rows;
  },

  async getById(id) {
    const result = await pool.query(
      `SELECT * FROM incomes WHERE id=$1`,
      [id]
    );
    return result.rows[0] || null;
  },

  async create(data) {
    const {
      subcategory_id,
      user_id,
      donor_id,
      date,
      giver,
      description,
      amount,
      status
    } = data;

    const result = await pool.query(
      `INSERT INTO incomes (
        subcategory_id, user_id, donor_id, date,
        giver, description, amount, status
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *`,
      [
        subcategory_id,
        user_id,
        donor_id,
        date,
        giver,
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
      donor_id,
      date,
      giver,
      description,
      amount,
      status
    } = data;

    const result = await pool.query(
      `UPDATE incomes SET
        subcategory_id=$1,
        user_id=$2,
        donor_id=$3,
        date=$4,
        giver=$5,
        description=$6,
        amount=$7,
        status=$8
      WHERE id=$9
      RETURNING *`,
      [
        subcategory_id,
        user_id,
        donor_id,
        date,
        giver,
        description,
        amount,
        status,
        id
      ]
    );

    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query(
      `DELETE FROM incomes WHERE id=$1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }
};

export default Income;
