// modules/finance/expenseCategories/expenseCategoryController.js
import ExpenseCategory from './expenseCategoryModel.js';

const ExpenseCategoryController = {
  // List all categories for the requesting organization
  async list(req, res) {
    try {
      const orgId = req.body.organization_id || req.query.organization_id;
      if (!orgId) return res.status(400).json({ message: 'Organization ID is required' });

      const data = await ExpenseCategory.getAll(orgId);
      return res.json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // Get a single category by ID (must belong to the org)
  async getById(req, res) {
    try {
      const { id } = req.params;
      const orgId = req.body.organization_id || req.query.organization_id;
      if (!orgId) return res.status(400).json({ message: 'Organization ID is required' });

      const cat = await ExpenseCategory.getById(id, orgId);
      if (!cat) return res.status(404).json({ message: 'Category not found' });

      return res.json(cat);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // Create a new category (requires orgId)
  async create(req, res) {
    try {
      const { organization_id } = req.body;
      if (!organization_id) return res.status(400).json({ message: 'Organization ID is required' });

      const created = await ExpenseCategory.create(req.body);
      return res.status(201).json(created);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // Update a category (must belong to the org)
  async update(req, res) {
    try {
      const { id } = req.params;
      const { organization_id } = req.body;
      if (!organization_id) return res.status(400).json({ message: 'Organization ID is required' });

      const existing = await ExpenseCategory.getById(id, organization_id);
      if (!existing) return res.status(404).json({ message: 'Category not found' });

      const updated = await ExpenseCategory.update(id, req.body);
      return res.json(updated);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // Delete a category (must belong to the org)
  async delete(req, res) {
    try {
      const { id } = req.params;
      const { organization_id } = req.body;
      if (!organization_id) return res.status(400).json({ message: 'Organization ID is required' });

      const deleted = await ExpenseCategory.delete(id, organization_id);
      if (!deleted) return res.status(404).json({ message: 'Category not found' });

      return res.json({ message: 'Deleted' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};

export default ExpenseCategoryController;
