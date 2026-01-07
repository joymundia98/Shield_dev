// modules/finance/incomeSubcategories/incomeSubcategoryController.js
import IncomeSubcategory from './incomeSubModel.js';

const IncomeSubcategoryController = {
  // GET /income-subcategories/:orgId
  async list(req, res) {
    try {
      const orgId = req.auth.organization_id;
      const data = await IncomeSubcategory.getAll(orgId);
      return res.json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // GET /income-subcategories/:orgId/:id
  async getById(req, res) {
    try {
      const { id } = req.params;
      const orgId = req.auth.organization_id;
      const item = await IncomeSubcategory.getById(orgId, id);
      if (!item) return res.status(404).json({ message: 'Not found' });
      return res.json(item);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // POST /income-subcategories
  async create(req, res) {
    try {
      // Expect body to contain { name, category_id, organization_id }
      const created = await IncomeSubcategory.create({
        ...req.body,
        organization_id: req.auth.organization_id,
      });
      return res.status(201).json(created);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // PUT /income-subcategories/:orgId/:id
  async update(req, res) {
    try {
      const { id } = req.params;
      const orgId = req.auth.organization_id;
      const updated = await IncomeSubcategory.update(orgId, id, req.body);
      if (!updated) return res.status(404).json({ message: 'Not found or not in this organization' });
      return res.json(updated);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // DELETE /income-subcategories/:orgId/:id
  async delete(req, res) {
    try {
      const { id } = req.params;
      const orgId = req.auth.organization_id;
      const deleted = await IncomeSubcategory.delete(orgId, id);
      if (!deleted) return res.status(404).json({ message: 'Not found or not in this organization' });
      return res.json({ message: 'Deleted successfully' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};

export default IncomeSubcategoryController;
