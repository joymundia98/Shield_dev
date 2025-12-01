// modules/finance/expenses/expenseController.js
import Expense from './expenseModel.js';

const ExpenseController = {
  async list(req, res) {
    try {
      const data = await Expense.getAll();
      return res.json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

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

  async create(req, res) {
    try {
      const created = await Expense.create(req.body);
      return res.status(201).json(created);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const updated = await Expense.update(id, req.body);
      return res.json(updated);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Expense.delete(id);
      if (!deleted) return res.status(404).json({ message: 'Not found' });
      return res.json({ message: 'Deleted' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};

export default ExpenseController;
