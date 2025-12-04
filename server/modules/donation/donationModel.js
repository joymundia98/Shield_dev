import { pool } from "../../server.js";

const Donation = {
  async getAll() {
    const result = await pool.query(
      `SELECT * FROM donations ORDER BY date DESC`
    );
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query(
      `SELECT * FROM donations WHERE id=$1`,
      [id]
    );
    return result.rows[0] || null;
  },

  async create(data) {
    const {
      donor_id,
      donor_registered,
      is_anonymous,
      donor_name,
      donor_phone,
      donor_email,
      donor_type_id,
      donor_subcategory_id,
      purpose_id,
      date,
      amount,
      method,
      notes,
    } = data;

    const result = await pool.query(
      `INSERT INTO donations (donor_id, donor_registered, is_anonymous, donor_name,
                              donor_phone, donor_email, donor_type_id, donor_subcategory_id,
                              purpose_id, date, amount, method, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       RETURNING *`,
      [
        donor_id,
        donor_registered,
        is_anonymous ?? false,
        donor_name,
        donor_phone,
        donor_email,
        donor_type_id,
        donor_subcategory_id,
        purpose_id,
        date,
        amount,
        method,
        notes,
      ]
    );
    return result.rows[0];
  },

  async update(id, data) {
    const {
      donor_id,
      donor_registered,
      is_anonymous,
      donor_name,
      donor_phone,
      donor_email,
      donor_type_id,
      donor_subcategory_id,
      purpose_id,
      date,
      amount,
      method,
      notes,
    } = data;

    const result = await pool.query(
      `UPDATE donations
       SET donor_id=$1, donor_registered=$2, is_anonymous=$3, donor_name=$4,
           donor_phone=$5, donor_email=$6, donor_type_id=$7, donor_subcategory_id=$8,
           purpose_id=$9, date=$10, amount=$11, method=$12, notes=$13, updated_at=NOW()
       WHERE id=$14
       RETURNING *`,
      [
        donor_id,
        donor_registered,
        is_anonymous ?? false,
        donor_name,
        donor_phone,
        donor_email,
        donor_type_id,
        donor_subcategory_id,
        purpose_id,
        date,
        amount,
        method,
        notes,
        id,
      ]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query(
      `DELETE FROM donations WHERE id=$1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  },
};

export default Donation;
