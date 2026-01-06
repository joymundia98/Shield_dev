// modules/finance/expenses/expenseController.js
import Expense from './expenseModel.js';

const ExpenseController = {
  // GET /expenses?orgId=1
  async list(req, res) {
    try {
      const { orgId } = req.query;
      if (!orgId) {
        return res.status(400).json({ message: "Organization ID is required" });
      }

      const data = await Expense.getAll(orgId);
      return res.json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // GET /expenses/:id
  async getById(req, res) {
    try {
      const { id } = req.params;
      const item = await Expense.getById(id);
      if (!item) return res.status(404).json({ message: 'Not found' });
      return res.json(item);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // POST /expenses
  async create(req, res) {
    try {
      const { organization_id } = req.body;
      if (!organization_id) {
        return res.status(400).json({ message: "Organization ID is required" });
      }

      const created = await Expense.create(req.body);
      return res.status(201).json(created);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // PUT /expenses/:id
  async update(req, res) {
    try {
      const { id } = req.params;
      const { organization_id } = req.body;
      if (!organization_id) {
        return res.status(400).json({ message: "Organization ID is required" });
      }

      const updated = await Expense.update(id, req.body);
      return res.json(updated);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // PATCH /expenses/:id/status
  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }

      const updated = await Expense.updateStatus(id, status);
      return res.json(updated);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // DELETE /expenses/:id
  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Expense.delete(id);
      if (!deleted) return res.status(404).json({ message: 'Not found' });
      return res.json({ message: 'Deleted' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // Optional: GET /expenses/organization/:orgId
  async getByOrganization(req, res) {
    try {
      const { orgId } = req.params;
      if (!orgId) return res.status(400).json({ message: "Organization ID is required" });

      const data = await Expense.getByOrganization(orgId);
      return res.json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};

export default ExpenseController;
