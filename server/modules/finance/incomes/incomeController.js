// modules/finance/incomes/incomeController.js
import Income from './incomeModel.js';

const IncomeController = {
  // GET /org/:orgId/incomes
  async list(req, res) {
    try {
      const orgId = req.auth.organization_id;
      const data = await Income.getAll(orgId);
      return res.json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // GET /org/:orgId/incomes/:id
  async getById(req, res) {
    try {
      const { id } = req.params;
      const orgId = req.auth.organization_id;
      const item = await Income.getById(id, orgId);
      if (!item) return res.status(404).json({ message: 'Income not found' });
      return res.json(item);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // POST /org/:orgId/incomes
  async create(req, res) {
    try {
      const orgId = req.auth.organization_id;
      const data = { ...req.body, organization_id: orgId };
      const created = await Income.create(data);
      return res.status(201).json(created);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // PUT /org/:orgId/incomes/:id
  async update(req, res) {
    try {
      const { id } = req.params;
      const orgId = req.auth.organization_id
      const updated = await Income.update(id, orgId, req.body);
      if (!updated) return res.status(404).json({ message: 'Income not found' });
      return res.json(updated);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // PATCH /org/:orgId/incomes/:id/status
  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const orgId = req.auth.organization_id;
      const { status } = req.body;

      if (!status) return res.status(400).json({ error: 'Status is required' });

      const updated = await Income.updateStatus(id, orgId, status);
      if (!updated) return res.status(404).json({ message: 'Income not found' });

      return res.json(updated);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // DELETE /org/:orgId/incomes/:id
  async delete(req, res) {
    try {
      const { id } = req.params;
      const orgId = req.auth.organization_id;
      const deleted = await Income.delete(id, orgId);
      if (!deleted) return res.status(404).json({ message: 'Income not found' });
      return res.json({ message: 'Income deleted successfully' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};

export default IncomeController;
