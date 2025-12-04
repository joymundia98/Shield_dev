import { pool } from "../../server.js";

const Donor = {
  async getAll() {
    const result = await pool.query(
      `SELECT id, donor_type_id, donor_subcategory_id, name, email, phone, address,
              member_id, organization_id, preferred_contact_method, notes, is_active,
              created_at, updated_at
       FROM donors ORDER BY name ASC`
    );
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query(
      `SELECT id, donor_type_id, donor_subcategory_id, name, email, phone, address,
              member_id, organization_id, preferred_contact_method, notes, is_active,
              created_at, updated_at
       FROM donors WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  },

  async create(data) {
    const {
      donor_type_id,
      donor_subcategory_id,
      name,
      email,
      phone,
      address,
      member_id,
      organization_id,
      preferred_contact_method,
      notes,
      is_active,
    } = data;

    const result = await pool.query(
      `INSERT INTO donors (donor_type_id, donor_subcategory_id, name, email, phone, address,
                           member_id, organization_id, preferred_contact_method, notes, is_active)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING *`,
      [
        donor_type_id,
        donor_subcategory_id,
        name,
        email,
        phone,
        address,
        member_id,
        organization_id,
        preferred_contact_method,
        notes,
        is_active ?? true,
      ]
    );
    return result.rows[0];
  },

  async update(id, data) {
    const {
      donor_type_id,
      donor_subcategory_id,
      name,
      email,
      phone,
      address,
      member_id,
      organization_id,
      preferred_contact_method,
      notes,
      is_active,
    } = data;

    const result = await pool.query(
      `UPDATE donors
       SET donor_type_id=$1, donor_subcategory_id=$2, name=$3, email=$4, phone=$5,
           address=$6, member_id=$7, organization_id=$8, preferred_contact_method=$9,
           notes=$10, is_active=$11, updated_at=NOW()
       WHERE id=$12
       RETURNING *`,
      [
        donor_type_id,
        donor_subcategory_id,
        name,
        email,
        phone,
        address,
        member_id,
        organization_id,
        preferred_contact_method,
        notes,
        is_active ?? true,
        id,
      ]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query(
      `DELETE FROM donors WHERE id=$1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  },
};

export default Donor;
