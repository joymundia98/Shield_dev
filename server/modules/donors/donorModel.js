import { pool } from "../../../server.js";

const Donor = {
  async getAll() {
    const result = await pool.query(`
      SELECT 
        id,
        donor_type,
        name,
        email,
        phone,
        address,
        member_id,
        organization_id,
        preferred_contact_method,
        notes,
        is_active,
        created_at,
        updated_at
      FROM donors
      ORDER BY id ASC
    `);

    return result.rows;
  },

  async getById(id) {
    const result = await pool.query(
      `
      SELECT 
        id,
        donor_type,
        name,
        email,
        phone,
        address,
        member_id,
        organization_id,
        preferred_contact_method,
        notes,
        is_active,
        created_at,
        updated_at
      FROM donors
      WHERE id = $1
      `,
      [id]
    );

    return result.rows[0] || null;
  },

  async create(data) {
    const {
      donor_type,
      name,
      email,
      phone,
      address,
      member_id,
      organization_id,
      preferred_contact_method,
      notes,
      is_active
    } = data;

    const result = await pool.query(
      `
      INSERT INTO donors (
        donor_type,
        name,
        email,
        phone,
        address,
        member_id,
        organization_id,
        preferred_contact_method,
        notes,
        is_active
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING 
        id,
        donor_type,
        name,
        email,
        phone,
        address,
        member_id,
        organization_id,
        preferred_contact_method,
        notes,
        is_active,
        created_at,
        updated_at
      `,
      [
        donor_type,
        name,
        email,
        phone,
        address,
        member_id,
        organization_id,
        preferred_contact_method,
        notes,
        is_active ?? true
      ]
    );

    return result.rows[0];
  },

  async update(id, data) {
    const {
      donor_type,
      name,
      email,
      phone,
      address,
      member_id,
      organization_id,
      preferred_contact_method,
      notes,
      is_active
    } = data;

    const result = await pool.query(
      `
      UPDATE donors
      SET
        donor_type = $1,
        name = $2,
        email = $3,
        phone = $4,
        address = $5,
        member_id = $6,
        organization_id = $7,
        preferred_contact_method = $8,
        notes = $9,
        is_active = $10,
        updated_at = NOW()
      WHERE id = $11
      RETURNING 
        id,
        donor_type,
        name,
        email,
        phone,
        address,
        member_id,
        organization_id,
        preferred_contact_method,
        notes,
        is_active,
        created_at,
        updated_at
      `,
      [
        donor_type,
        name,
        email,
        phone,
        address,
        member_id,
        organization_id,
        preferred_contact_method,
        notes,
        is_active,
        id
      ]
    );

    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query(
      `
      DELETE FROM donors 
      WHERE id = $1
      RETURNING id
      `,
      [id]
    );

    return result.rows[0];
  }
};

export default Donor;
