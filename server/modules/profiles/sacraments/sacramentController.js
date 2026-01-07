import Sacraments from './sacrament.js';

const sacramentsController = {
  async getAll(req, res) {
    try {
      const organization_id = req.auth.organization_id;
      const sacraments = await Sacraments.getAll(organization_id);
      res.json({ data: sacraments });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch sacraments' });
    }
  },

  async getById(req, res) {
    try {
      // const { id } = req.params;
      const organization_id = req.auth.organization_id;
      const sacrament = await Sacraments.getById(organization_id);
      if (!sacrament) return res.status(404).json({ error: 'Sacrament not found' });
      res.json(sacrament);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch sacrament' });
    }
  },

  async getByChurchId(req, res) {
    try {
      const { church_id } = req.params;
      const organization_id = req.auth.organization_id;
      const sacraments = await Sacraments.getByChurchId(church_id, organization_id);
      res.json({ data: sacraments });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch sacraments for church' });
    }
  },

  async create(req, res) {
    try {
      console.log(req.body);  // Log the request body to see what is being sent
      const sacrament = await Sacraments.create({
        ...req.body,
        organization_id: req.auth.organization_id,
      });
      res.status(201).json(sacrament);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create sacrament' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const sacrament = await Sacraments.update(id, req.body);
      if (!sacrament) return res.status(404).json({ error: 'Sacrament not found' });
      res.json(sacrament);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update sacrament' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const sacrament = await Sacraments.delete(id);
      if (!sacrament) return res.status(404).json({ error: 'Sacrament not found' });
      res.json({ message: 'Sacrament deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete sacrament' });
    }
  }
};

export default sacramentsController;
