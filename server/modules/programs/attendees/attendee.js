import { pool } from "../../../server.js";

export const Attendee = {
  async create(data) {
    const {
      name,
      email,
      phone,
      age,
      gender,
      program_id,
      role,
      organization_id,
    } = data;

    const result = await pool.query(
      `INSERT INTO attendees
        (name, email, phone, age, gender, program_id, role, organization_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [name, email, phone, age, gender, program_id, role, organization_id]
    );

    return result.rows[0];
  },

  async getAll(organization_id) {
    const result = await pool.query(`SELECT * FROM attendees WHERE organization_id=$1 ORDER BY name ASC`, [organization_id]);
    return result.rows;
  },

  async getById(id, organization_id) {
    const result = await pool.query(`SELECT * FROM attendees WHERE attendee_id=$1 AND organization_id=$2`, [id, organization_id]);
    return result.rows[0];
  },

  async update(id, organization_id, data) {
    const existing = await pool.query(
      `SELECCT * FROM attendees WHERE id = $1 and organization_id = $2`,
      [id, organization_id]
    );

    if (!existing.rows[0]) {
      return null;
    }

    const { name, email, phone, age, gender, program_id, role } = data;

    const result = await pool.query(
      `UPDATE attendees SET 
        name=$1, email=$2, phone=$3, age=$4, gender=$5, program_id=$6, role=$7
       WHERE attendee_id=$8 
       AND organization_id=$9
       RETURNING *`,
      [name, email, phone, age, gender, program_id, role, id]
    );

    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query(`DELETE FROM attendees WHERE attendee_id=$1 AND organization_id=$2 RETURNING *`, [id]);
    return result.rows[0];
  },

  async getByProgram(program_id, organization_id) {
    const result = await pool.query(
      `SELECT * FROM attendees WHERE program_id=$1 AND organization_id=$2 ORDER BY name ASC`,
      [program_id, organization_id]
    );
    return result.rows;
  },
};
