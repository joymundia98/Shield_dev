import { pool } from "../../../server.js";

export const Attendee = {
  async create(data) {
    const { name, email, phone, age, gender, program_id, role } = data;

    const result = await pool.query(
      `INSERT INTO attendees 
        (name, email, phone, age, gender, program_id, role) 
       VALUES ($1,$2,$3,$4,$5,$6,$7) 
       RETURNING *`,
      [name, email, phone, age, gender, program_id, role]
    );

    return result.rows[0];
  },

  async getAll() {
    const result = await pool.query(`SELECT * FROM attendees ORDER BY name ASC`);
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query(`SELECT * FROM attendees WHERE attendee_id=$1`, [id]);
    return result.rows[0];
  },

  async update(id, data) {
    const { name, email, phone, age, gender, program_id, role } = data;

    const result = await pool.query(
      `UPDATE attendees SET 
        name=$1, email=$2, phone=$3, age=$4, gender=$5, program_id=$6, role=$7
       WHERE attendee_id=$8 
       RETURNING *`,
      [name, email, phone, age, gender, program_id, role, id]
    );

    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query(`DELETE FROM attendees WHERE attendee_id=$1 RETURNING *`, [id]);
    return result.rows[0];
  },

  async getByProgram(program_id) {
    const result = await pool.query(
      `SELECT * FROM attendees WHERE program_id=$1 ORDER BY name ASC`,
      [program_id]
    );
    return result.rows;
  },
};
