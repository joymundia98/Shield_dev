import { pool } from "../../server.js";

const Donation = {
  async getAll(organization_id) {
    const result = await pool.query(
      `SELECT *
       FROM donations
       WHERE organization_id = $1
       ORDER BY date DESC`,
      [organization_id]
    );
    return result.rows;
  },

  async getById(id, organization_id) {
    const result = await pool.query(
      `SELECT *
       FROM donations
       WHERE id = $1 AND organization_id = $2`,
      [id, organization_id]
    );
    return result.rows[0] || null;
  },

  async create(data) {
    const {
      organization_id,
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
      `INSERT INTO donations (
        organization_id,
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
        notes
      )
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
       RETURNING *`,
      [
        organization_id,
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

  async update(id, organization_id, data) {
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
       SET donor_id=$1,
           donor_registered=$2,
           is_anonymous=$3,
           donor_name=$4,
           donor_phone=$5,
           donor_email=$6,
           donor_type_id=$7,
           donor_subcategory_id=$8,
           purpose_id=$9,
           date=$10,
           amount=$11,
           method=$12,
           notes=$13,
           updated_at=NOW()
       WHERE id=$14 AND organization_id=$15
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
        organization_id,
      ]
    );

    return result.rows[0] || null;
  },

  async delete(id, organization_id) {
    const result = await pool.query(
      `DELETE FROM donations
       WHERE id=$1 AND organization_id=$2
       RETURNING *`,
      [id, organization_id]
    );
    return result.rows[0] || null;
  },
};

export default Donation;
