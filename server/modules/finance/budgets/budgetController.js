// modules/finance/budgets/budgetController.js
import Budget from './budgetModel.js';

const BudgetController = {
  async list(req, res) {
    try {
      const data = await Budget.getAll();
      return res.json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const row = await Budget.getById(id);
      if (!row) return res.status(404).json({ message: 'Not found' });
      return res.json(row);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const created = await Budget.create(req.body);
      return res.status(201).json(created);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const updated = await Budget.update(id, req.body);
      return res.json(updated);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Budget.delete(id);
      if (!deleted) return res.status(404).json({ message: 'Not found' });
      return res.json({ message: 'Deleted' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};

export default BudgetController;
