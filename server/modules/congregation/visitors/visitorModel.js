import { pool } from "../../../server.js";

const Visitor = {
  // Get all visitors for the organization
  async getAll(organization_id) {
    const result = await pool.query(
      `
      SELECT v.*
      FROM visitors v
      WHERE v.organization_id = $1
      ORDER BY v.id ASC
      `,
      [organization_id]
    );
    return result.rows;
  },

  // Get a single visitor by ID and organization
  async getById(id, organization_id) {
    const result = await pool.query(
      `
      SELECT v.*
      FROM visitors v
      WHERE v.id = $1 AND v.organization_id = $2
      `,
      [id, organization_id]
    );
    return result.rows[0] || null;
  },

  // Create a visitor for the organization
  async create(data) {
    const {
      name,
      gender,
      age,
      visit_date,
      address,
      phone,
      email,
      invited_by,
      photo_url,
      first_time,
      needs_follow_up,
      service_id,
      church_find_out,
      organization_id
    } = data;

    const result = await pool.query(
      `
      INSERT INTO visitors
      (
        name,
        gender,
        age,
        visit_date,
        address,
        phone,
        email,
        invited_by,
        photo_url,
        first_time,
        needs_follow_up,
        service_id,
        church_find_out,
        organization_id
      )
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      RETURNING *
      `,
      [
        name,
        gender,
        age,
        visit_date,
        address,
        phone,
        email,
        invited_by,
        photo_url,
        first_time ?? true,
        needs_follow_up ?? false,
        service_id ?? null,
        church_find_out ?? null,
        organization_id
      ]
    );

    return result.rows[0];
  },

  // Update a visitor within the organization
  async update(id, data, organization_id) {
    const {
      name,
      gender,
      age,
      visit_date,
      address,
      phone,
      email,
      invited_by,
      photo_url,
      first_time,
      needs_follow_up,
      service_id,
      church_find_out
    } = data;

    const result = await pool.query(
      `
      UPDATE visitors
      SET
        name=$1,
        gender=$2,
        age=$3,
        visit_date=$4,
        address=$5,
        phone=$6,
        email=$7,
        invited_by=$8,
        photo_url=$9,
        first_time=$10,
        needs_follow_up=$11,
        service_id=$12,
        church_find_out=$13
      WHERE id=$14 AND organization_id=$15
      RETURNING *
      `,
      [
        name,
        gender,
        age,
        visit_date,
        address,
        phone,
        email,
        invited_by,
        photo_url,
        first_time,
        needs_follow_up,
        service_id,
        church_find_out,
        id,
        organization_id
      ]
    );

    return result.rows[0];
  },

  // Delete a visitor within the organization
  async delete(id, organization_id) {
    const result = await pool.query(
      `DELETE FROM visitors WHERE id=$1 AND organization_id=$2 RETURNING *`,
      [id, organization_id]
    );
    return result.rows[0];
  }
};

export default Visitor;
