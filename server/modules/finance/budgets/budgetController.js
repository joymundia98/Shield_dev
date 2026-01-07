// modules/finance/budgets/budgetController.js
import Budget from './budgetModel.js';

const BudgetController = {
  // List all budgets for an organization
  async list(req, res) {
    try {
      const orgId = req.auth.organization_id;
      if (!orgId) return res.status(400).json({ error: "Organization ID is required" });

      const data = await Budget.getAll(orgId);
      return res.json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // Get a budget by ID scoped to organization
  async getById(req, res) {
    try {
      const { id } = req.params;
      const orgId = req.auth.organization_id;
      if (!orgId) return res.status(400).json({ error: "Organization ID is required" });

      const row = await Budget.getById(id, orgId);
      if (!row) return res.status(404).json({ message: 'Budget not found' });
      return res.json(row);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // Create a new budget
  async create(req, res) {
    try {
      const created = await Budget.create({
        ...req.body,
        organization_id: req.auth.organization_id,
      });
      return res.status(201).json(created);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // Update a budget by ID (scoped to org)
  async update(req, res) {
    try {
      const { id } = req.params;
      const updated = await Budget.update(id, req.body);
      if (!updated) return res.status(404).json({ message: 'Budget not found' });
      return res.json(updated);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // Delete a budget by ID (scoped to org)
  async delete(req, res) {
    try {
      const { id } = req.params;
      const orgId = req.auth.organization_id;
      if (!orgId) return res.status(400).json({ error: "Organization ID is required" });

      const deleted = await Budget.delete(id, orgId);
      if (!deleted) return res.status(404).json({ message: 'Budget not found' });
      return res.json({ message: 'Deleted' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};

export default BudgetController;
