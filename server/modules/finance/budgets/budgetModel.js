import { pool } from "../../../server.js";
import AuditLog from "../../audit_tail/audit.js";

const Budget = {
  // Get all budgets for an organization
  async getAll(orgId) {
    if (!orgId) throw new Error("Organization ID is required");

    const result = await pool.query(`
      SELECT 
        id,
        title,
        amount,
        year,
        month,
        category_id,
        expense_subcategory_id,
        organization_id,
        created_at
      FROM budgets
      WHERE organization_id = $1
      ORDER BY id ASC
    `, [orgId]);

    return result.rows;
  },

  // Get a single budget by ID, scoped to org
  async getById(id, orgId) {
    if (!orgId) throw new Error("Organization ID is required");

    const result = await pool.query(`
      SELECT 
        id,
        title,
        amount,
        year,
        month,
        category_id,
        expense_subcategory_id,
        organization_id,
        created_at
      FROM budgets
      WHERE id = $1 AND organization_id = $2
    `, [id, orgId]);

    return result.rows[0] || null;
  },

  // Create a new budget for an organization
async create(data, auditMeta = {}) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const {
      title = "Untitled",
      amount,
      year,
      month,
      category_id,
      expense_subcategory_id,
      organization_id
    } = data;

    if (!organization_id) throw new Error("Organization ID is required");
    if (!year || !month || !amount) {
      throw new Error("year, month, and amount are required");
    }

    const result = await client.query(
      `
      INSERT INTO budgets 
        (title, amount, year, month, category_id, expense_subcategory_id, organization_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `,
      [
        title,
        amount,
        year,
        month,
        category_id,
        expense_subcategory_id || null,
        organization_id
      ]
    );

    const budget = result.rows[0];

    // ✅ Audit log
    await AuditLog.log({
      user_id: auditMeta.user_id ?? null,
      organization_id,
      module: "budgets",
      action: "CREATE",
      record_id: budget.id,
      new_data: budget,
      ip_address: auditMeta.ip_address,
      user_agent: auditMeta.user_agent
    }, client);

    await client.query("COMMIT");

    return budget;

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
},

  // Update a budget (scoped to org)
async update(id, data, auditMeta = {}) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const {
      title,
      amount,
      year,
      month,
      category_id,
      expense_subcategory_id,
      organization_id
    } = data;

    if (!organization_id) throw new Error("Organization ID is required");

    // 1️⃣ Fetch old record
    const existing = await client.query(
      `SELECT * FROM budgets WHERE id = $1 AND organization_id = $2`,
      [id, organization_id]
    );

    if (existing.rowCount === 0) {
      throw new Error("Budget not found");
    }

    const oldBudget = existing.rows[0];

    // 2️⃣ Merge (PATCH-safe)
    const payload = {
      ...oldBudget,
      ...data
    };

    // 3️⃣ Update
    const result = await client.query(
      `
      UPDATE budgets
      SET
        title = $1,
        amount = $2,
        year = $3,
        month = $4,
        category_id = $5,
        expense_subcategory_id = $6
      WHERE id = $7 AND organization_id = $8
      RETURNING *
      `,
      [
        payload.title,
        payload.amount,
        payload.year,
        payload.month,
        payload.category_id,
        payload.expense_subcategory_id || null,
        id,
        organization_id
      ]
    );

    const updatedBudget = result.rows[0];

    // 4️⃣ Audit log
    await AuditLog.log({
      user_id: auditMeta.user_id ?? null,
      organization_id,
      module: "budgets",
      action: "UPDATE",
      record_id: id,
      old_data: oldBudget,
      new_data: updatedBudget,
      ip_address: auditMeta.ip_address,
      user_agent: auditMeta.user_agent
    }, client);

    await client.query("COMMIT");

    return updatedBudget;

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
},

  // Delete a budget (scoped to org)
  async delete(id, orgId) {
    if (!orgId) throw new Error("Organization ID is required");

    const result = await pool.query(`
      DELETE FROM budgets 
      WHERE id = $1 AND organization_id = $2
      RETURNING id, title, amount, year, month, organization_id
    `, [id, orgId]);

    return result.rows[0];
  },
};

export default Budget;
