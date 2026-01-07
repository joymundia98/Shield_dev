// modules/finance/incomeCategories/incomeCategoryController.js
import IncomeCategory from './incomeCategoryModel.js';

const IncomeCategoryController = {
  // GET /income-categories/:orgId
  async list(req, res) {
    try {
      const orgId = req.auth.organization_id;
      const data = await IncomeCategory.getAll(orgId);
      return res.json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // GET /income-categories/:orgId/:id
  async getById(req, res) {
    try {
      const { id } = req.params;
      const organization_id = req.auth.organization_id
      const cat = await IncomeCategory.getById(organization_id, id);
      if (!cat) return res.status(404).json({ message: 'Not found' });
      return res.json(cat);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // POST /income-categories
  async create(req, res) {
    try {
      const { name } = req.body;
      const organization_id = req.auth.organization_id;
      if (!organization_id) return res.status(400).json({ message: "organization_id is required" });

      const created = await IncomeCategory.create({ name, organization_id });
      return res.status(201).json(created);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // PUT /income-categories/:orgId/:id
  async update(req, res) {
    try {
      const { id } = req.params;
      const orgId = req.auth.organization_id;
      const { name } = req.body;

      const updated = await IncomeCategory.update(orgId, id, { name });
      if (!updated) return res.status(404).json({ message: 'Not found' });

      return res.json(updated);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // DELETE /income-categories/:orgId/:id
  async delete(req, res) {
    try {
      const { id } = req.params;
      const orgId = req.auth.organization_id;
      const deleted = await IncomeCategory.delete(orgId, id);
      if (!deleted) return res.status(404).json({ message: 'Not found' });

      return res.json({ message: 'Deleted' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};

export default IncomeCategoryController;
