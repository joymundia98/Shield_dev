import { pool } from "../../server.js";
import AuditLog from "../audit_tail/audit.js";

const Payroll = {

  async getAll(organization_id) {
    const result = await pool.query(
      `SELECT *
       FROM payroll
       WHERE organization_id = $1
       ORDER BY payroll_id ASC`,
      [organization_id]
    );
    return result.rows;
  },

  async getById(payroll_id, organization_id) {
    const result = await pool.query(
      `SELECT *
       FROM payroll
       WHERE payroll_id = $1
         AND organization_id = $2`,
      [payroll_id, organization_id]
    );
    return result.rows[0] || null;
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
        gratuity_percentage, gratuity_amount, status,
        organization_id
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,
        $13,$14,$15,$16,$17,$18,$19,$20,$21,$22,
        $23,$24,$25,$26,$27,$28
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
        data.status,
        data.organization_id
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
async update(payrollId, organization_id, data, auditMeta = {}) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1️⃣ Fetch existing payroll
    const existing = await client.query(
      `SELECT * FROM payroll WHERE payroll_id = $1 AND organization_id = $2`,
      [payrollId, organization_id]
    );

    if (existing.rowCount === 0) {
      throw new Error("Payroll record not found");
    }

    const oldPayroll = existing.rows[0];

    // 2️⃣ Merge old + new data (PATCH-safe)
    const payload = {
      ...oldPayroll,
      ...data
    };

    // 3️⃣ Update payroll
    const result = await client.query(
      `
      UPDATE payroll SET
        staff_id = $1,
        department_id = $2,
        role_id = $3,
        year = $4,
        month = $5,
        salary = $6,
        housing_allowance = $7,
        transport_allowance = $8,
        medical_allowance = $9,
        overtime = $10,
        bonus = $11,
        total_gross = $12,
        paye_tax_percentage = $13,
        paye_tax_amount = $14,
        napsa_contribution_percentage = $15,
        napsa_contribution_amount = $16,
        loan_deduction = $17,
        union_dues = $18,
        health_insurance = $19,
        nhima_contribution_percentage = $20,
        nhima_contribution_amount = $21,
        wcif = $22,
        total_deductions = $23,
        net_salary = $24,
        gratuity_percentage = $25,
        gratuity_amount = $26,
        status = $27,
        updated_at = NOW()
      WHERE payroll_id = $28
        AND organization_id = $29
      RETURNING *
      `,
      [
        payload.staff_id,
        payload.department_id,
        payload.role_id,
        payload.year,
        payload.month,
        payload.salary,
        payload.housing_allowance,
        payload.transport_allowance,
        payload.medical_allowance,
        payload.overtime,
        payload.bonus,
        payload.total_gross,
        payload.paye_tax_percentage,
        payload.paye_tax_amount,
        payload.napsa_contribution_percentage,
        payload.napsa_contribution_amount,
        payload.loan_deduction,
        payload.union_dues,
        payload.health_insurance,
        payload.nhima_contribution_percentage,
        payload.nhima_contribution_amount,
        payload.wcif,
        payload.total_deductions,
        payload.net_salary,
        payload.gratuity_percentage,
        payload.gratuity_amount,
        payload.status,
        payrollId,
        organization_id
      ]
    );

    const updatedPayroll = result.rows[0];

    // 4️⃣ Log audit trail (schema-correct)
await AuditLog.log({
  user_id: auditMeta.user_id ?? null,
  organization_id: organization_id,
  module: "payroll",
  action: "UPDATE",
  record_id: payrollId,
  old_data: oldPayroll,
  new_data: updatedPayroll,
  ip_address: auditMeta.ip_address,
  user_agent: auditMeta.user_agent
}, client);

console.log(auditMeta)

    await client.query("COMMIT");

    return updatedPayroll;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
},

  // DELETE PAYROLL
  async delete(payroll_id, organization_id, auditMeta = {}) {
    const oldResult = await pool.query(
      `SELECT *
       FROM payroll
       WHERE payroll_id = $1
         AND organization_id = $2`,
      [payroll_id, organization_id]
    );

    const oldData = oldResult.rows[0];
    if (!oldData) return null;

    await pool.query(
      `DELETE FROM payroll
       WHERE payroll_id = $1
         AND organization_id = $2`,
      [payroll_id, organization_id]
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
