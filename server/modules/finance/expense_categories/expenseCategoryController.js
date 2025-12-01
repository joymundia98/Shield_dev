// modules/finance/expenseCategories/expenseCategoryController.js
import ExpenseCategory from './expenseCategoryModel.js';

const ExpenseCategoryController = {
  async list(req, res) {
    try {
      const data = await ExpenseCategory.getAll();
      return res.json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const cat = await ExpenseCategory.getById(id);
      if (!cat) return res.status(404).json({ message: 'Category not found' });
      return res.json(cat);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const created = await ExpenseCategory.create(req.body);
      return res.status(201).json(created);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const existing = await ExpenseCategory.getById(id);
      if (!existing) return res.status(404).json({ message: 'Category not found' });
      const updated = await ExpenseCategory.update(id, req.body);
      return res.json(updated);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await ExpenseCategory.delete(id);
      if (!deleted) return res.status(404).json({ message: 'Category not found' });
      return res.json({ message: 'Deleted' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};

export default ExpenseCategoryController;
