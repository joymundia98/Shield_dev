import { pool } from "../../server.js";

const Payroll = {
  async getAll() {
    const result = await pool.query(
      `SELECT * FROM payroll ORDER BY payroll_id ASC`
    );
    return result.rows;
  },

  async getById(payroll_id) {
    const result = await pool.query(
      `SELECT * FROM payroll WHERE payroll_id=$1`,
      [payroll_id]
    );
    return result.rows[0];
  },

  async create(data) {
    const {
      staff_id,
      department_id,
      role_id,
      year,
      month,
      salary,
      housing_allowance,
      transport_allowance,
      medical_allowance,
      overtime,
      bonus,
      total_gross,
      paye_tax_percentage,
      paye_tax_amount,
      napsa_contribution_percentage,
      napsa_contribution_amount,
      loan_deduction,
      union_dues,
      health_insurance,
      nhima_contribution_percentage,
      nhima_contribution_amount,
      wcif,
      total_deductions,
      net_salary,
      gratuity_percentage,
      gratuity_amount,
      status
    } = data;

    const result = await pool.query(
      `INSERT INTO payroll (
        staff_id, department_id, role_id, year, month,
        salary, housing_allowance, transport_allowance, medical_allowance,
        overtime, bonus, total_gross,
        paye_tax_percentage, paye_tax_amount,
        napsa_contribution_percentage, napsa_contribution_amount,
        loan_deduction, union_dues, health_insurance,
        nhima_contribution_percentage, nhima_contribution_amount,
        wcif, total_deductions, net_salary,
        gratuity_percentage, gratuity_amount, status
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27
      )
      RETURNING *`,
      [
        staff_id, department_id, role_id, year, month,
        salary, housing_allowance, transport_allowance, medical_allowance,
        overtime, bonus, total_gross,
        paye_tax_percentage, paye_tax_amount,
        napsa_contribution_percentage, napsa_contribution_amount,
        loan_deduction, union_dues, health_insurance,
        nhima_contribution_percentage, nhima_contribution_amount,
        wcif, total_deductions, net_salary,
        gratuity_percentage, gratuity_amount, status
      ]
    );

    return result.rows[0];
  },

async update(payroll_id, data) {
  // Remove undefined fields or fields that should not change
  const { staff_id, year, month, ...otherFields } = data;

  const fields = [];
  const values = [];
  let i = 1;

  // Only update the fields you want to change (other than staff_id/year/month)
  for (const key of Object.keys(otherFields)) {
    fields.push(`${key} = $${i}`);
    values.push(otherFields[key]);
    i++;
  }

  if (fields.length === 0) {
    // Nothing to update
    const result = await pool.query(
      `SELECT * FROM payroll WHERE payroll_id=$1`,
      [payroll_id]
    );
    return result.rows[0];
  }

  values.push(payroll_id);

  const result = await pool.query(
    `UPDATE payroll SET ${fields.join(", ")} WHERE payroll_id=$${i} RETURNING *`,
    values
  );

  return result.rows[0];
},

  async delete(payroll_id) {
    const result = await pool.query(
      `DELETE FROM payroll WHERE payroll_id=$1 RETURNING *`,
      [payroll_id]
    );
    return result.rows[0];
  }
};

export default Payroll;
