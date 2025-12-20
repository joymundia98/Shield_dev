import { pool } from "../../server.js";
import AuditLog from "../audit_tail/audit.js";

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

  // CREATE PAYROLL
  async create(data, auditMeta = {}) {
    const result = await pool.query(
      `
      INSERT INTO payroll (
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
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,
        $13,$14,$15,$16,$17,$18,$19,$20,$21,$22,
        $23,$24,$25,$26,$27
      )
      RETURNING *
      `,
      [
        data.staff_id,
        data.department_id,
        data.role_id,
        data.year,
        data.month,
        data.salary,
        data.housing_allowance,
        data.transport_allowance,
        data.medical_allowance,
        data.overtime,
        data.bonus,
        data.total_gross,
        data.paye_tax_percentage,
        data.paye_tax_amount,
        data.napsa_contribution_percentage,
        data.napsa_contribution_amount,
        data.loan_deduction,
        data.union_dues,
        data.health_insurance,
        data.nhima_contribution_percentage,
        data.nhima_contribution_amount,
        data.wcif,
        data.total_deductions,
        data.net_salary,
        data.gratuity_percentage,
        data.gratuity_amount,
        data.status
      ]
    );

    const payroll = result.rows[0];

    await AuditLog.log({
      ...auditMeta,
      module: "payroll",
      action: "CREATE",
      record_id: payroll.payroll_id,
      new_data: payroll
    });

    return payroll;
  },

  // UPDATE PAYROLL
  async update(payroll_id, data, auditMeta = {}) {
    const oldResult = await pool.query(
      `SELECT * FROM payroll WHERE payroll_id=$1`,
      [payroll_id]
    );

    const oldData = oldResult.rows[0];
    if (!oldData) return null;

    const { staff_id, year, month, ...otherFields } = data;

    const fields = [];
    const values = [];
    let i = 1;

    for (const key of Object.keys(otherFields)) {
      fields.push(`${key} = $${i}`);
      values.push(otherFields[key]);
      i++;
    }

    if (!fields.length) return oldData;

    values.push(payroll_id);

    const result = await pool.query(
      `UPDATE payroll SET ${fields.join(", ")} WHERE payroll_id=$${i} RETURNING *`,
      values
    );

    const updated = result.rows[0];

    await AuditLog.log({
      ...auditMeta,
      module: "payroll",
      action: "UPDATE",
      record_id: payroll_id,
      old_values: oldData,
      new_values: updated
    });

    return updated;
  },

  // DELETE PAYROLL
  async delete(payroll_id, auditMeta = {}) {
    const oldResult = await pool.query(
      `SELECT * FROM payroll WHERE payroll_id=$1`,
      [payroll_id]
    );

    const oldData = oldResult.rows[0];
    if (!oldData) return null;

    await pool.query(
      `DELETE FROM payroll WHERE payroll_id=$1`,
      [payroll_id]
    );

    await AuditLog.log({
      ...auditMeta,
      module: "payroll",
      action: "DELETE",
      record_id: payroll_id,
      old_values: oldData
    });

    return oldData;
  }
};

export default Payroll;
