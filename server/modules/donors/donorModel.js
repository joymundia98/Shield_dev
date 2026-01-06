import { pool } from "../../server.js";

const Donor = {
  // Get all donors for an organization
  async getAll(organization_id) {
    const result = await pool.query(
      `SELECT id, donor_type_id, donor_subcategory_id, name, email, phone, address,
              member_id, organization_id, preferred_contact_method, notes, is_active,
              created_at, updated_at
       FROM donors
       WHERE organization_id = $1
       ORDER BY name ASC`,
      [organization_id]
    );
    return result.rows;
  },

  // Get donor by ID (scoped to org)
  async getById(id, organization_id) {
    const result = await pool.query(
      `SELECT id, donor_type_id, donor_subcategory_id, name, email, phone, address,
              member_id, organization_id, preferred_contact_method, notes, is_active,
              created_at, updated_at
       FROM donors
       WHERE id = $1 AND organization_id = $2`,
      [id, organization_id]
    );
    return result.rows[0] || null;
  },

  // Create donor (org is mandatory)
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

    if (!organization_id) {
      throw new Error("organization_id is required");
    }

    const result = await pool.query(
      `INSERT INTO donors (
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
        is_active
      )
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

  // Update donor (org-safe)
  async update(id, organization_id, data) {
    const {
      donor_type_id,
      donor_subcategory_id,
      name,
      email,
      phone,
      address,
      member_id,
      preferred_contact_method,
      notes,
      is_active,
    } = data;

    const result = await pool.query(
      `UPDATE donors
       SET donor_type_id=$1,
           donor_subcategory_id=$2,
           name=$3,
           email=$4,
           phone=$5,
           address=$6,
           member_id=$7,
           preferred_contact_method=$8,
           notes=$9,
           is_active=$10,
           updated_at=NOW()
       WHERE id=$11 AND organization_id=$12
       RETURNING *`,
      [
        donor_type_id,
        donor_subcategory_id,
        name,
        email,
        phone,
        address,
        member_id,
        preferred_contact_method,
        notes,
        is_active ?? true,
        id,
        organization_id,
      ]
    );

    return result.rows[0];
  },

  // Delete donor (org-safe)
  async delete(id, organization_id) {
    const result = await pool.query(
      `DELETE FROM donors
       WHERE id = $1 AND organization_id = $2
       RETURNING *`,
      [id, organization_id]
    );
    return result.rows[0];
  },
};

export default Donor;
