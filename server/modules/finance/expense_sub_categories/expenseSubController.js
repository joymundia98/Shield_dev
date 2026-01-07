// modules/finance/expenseSubcategories/expenseSubcategoryController.js
import ExpenseSubcategory from './expenseSubModel.js';

const ExpenseSubcategoryController = {
  // GET /expense-subcategories?orgId=1
  async list(req, res) {
    try {
      const orgId = req.auth.organization_id;
      if (!orgId) return res.status(400).json({ message: "Organization ID is required" });

      const data = await ExpenseSubcategory.getAll(orgId);
      return res.json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // GET /expense-subcategories/:id
  async getById(req, res) {
    try {
      const { id } = req.params;
      const orgId = req.auth.organization_id;
      const item = await ExpenseSubcategory.getById(id, orgId);
      if (!item) return res.status(404).json({ message: 'Not found' });
      return res.json(item);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // POST /expense-subcategories
  async create(req, res) {
    try {
      const { name, category_id } = req.body;
      const organization_id = req.auth.organization_id;
      if (!organization_id) return res.status(400).json({ message: "Organization ID is required" });

      const created = await ExpenseSubcategory.create({ name, category_id, organization_id });
      return res.status(201).json(created);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // PUT /expense-subcategories/:id
  async update(req, res) {
    try {
      const { id } = req.params;
      const organization_id = req.auth.organization_id
      const existing = await ExpenseSubcategory.getById(id, organization_id);
      if (!existing) return res.status(404).json({ message: 'Not found' });

      const { name, category_id } = req.body;
      if (!organization_id) return res.status(400).json({ message: "Organization ID is required" });

      const updated = await ExpenseSubcategory.update(id, { name, category_id, organization_id });
      return res.json(updated);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // DELETE /expense-subcategories/:id
  async delete(req, res) {
    try {
      const { id } = req.params;
      const organization_id =  req.auth.organization_id
      const deleted = await ExpenseSubcategory.delete(id, organization_id);
      if (!deleted) return res.status(404).json({ message: 'Not found' });
      return res.json({ message: 'Deleted' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};

export default ExpenseSubcategoryController;
