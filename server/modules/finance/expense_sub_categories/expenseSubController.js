// modules/finance/expenseSubcategories/expenseSubcategoryController.js
import ExpenseSubcategory from './expenseSubModel.js';

const ExpenseSubcategoryController = {
  async list(req, res) {
    try {
      const data = await ExpenseSubcategory.getAll();
      return res.json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const item = await ExpenseSubcategory.getById(id);
      if (!item) return res.status(404).json({ message: 'Not found' });
      return res.json(item);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const created = await ExpenseSubcategory.create(req.body);
      return res.status(201).json(created);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const existing = await ExpenseSubcategory.getById(id);
      if (!existing) return res.status(404).json({ message: 'Not found' });
      const updated = await ExpenseSubcategory.update(id, req.body);
      return res.json(updated);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await ExpenseSubcategory.delete(id);
      if (!deleted) return res.status(404).json({ message: 'Not found' });
      return res.json({ message: 'Deleted' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};

export default ExpenseSubcategoryController;
