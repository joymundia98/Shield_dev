import Sacraments from './sacrament.js';

const SacramentsController = {
  // GET /sacraments
  async getAll(req, res) {
    try {
      const organization_id = req.auth.organization_id;
      const sacraments = await Sacraments.getAll(organization_id);
      res.status(200).json(sacraments);
    } catch (error) {
      console.error('Get all sacraments error:', error);
      res.status(500).json({ message: 'Failed to fetch sacraments' });
    }
  },

  // GET /sacraments/:id
  async getById(req, res) {
    try {
      const { id } = req.params;
      const organization_id = req.auth.organization_id;

      const sacrament = await Sacraments.getById(organization_id, id);

      if (!sacrament) {
        return res.status(404).json({ message: 'Sacrament not found' });
      }

      res.status(200).json(sacrament);
    } catch (error) {
      console.error('Get sacrament by ID error:', error);
      res.status(500).json({ message: 'Failed to fetch sacrament' });
    }
  },

  // GET /sacraments/church/:church_id
  async getByChurchId(req, res) {
    try {
      const { church_id } = req.params;
      const organization_id = req.auth.organization_id;

      const sacraments = await Sacraments.getByChurchId(church_id, organization_id);
      res.status(200).json(sacraments);
    } catch (error) {
      console.error('Get sacraments by church ID error:', error);
      res.status(500).json({ message: 'Failed to fetch sacraments for this church' });
    }
  },

  // POST /sacraments
  async create(req, res) {
    try {
      const data = req.body;

      if (!data.church_id || !data.sacrament_name) {
        return res.status(400).json({ message: 'church_id and sacrament_name are required' });
      }

      const sacrament = await Sacraments.create(data);
      res.status(201).json(sacrament);
    } catch (error) {
      console.error('Create sacrament error:', error);
      res.status(500).json({ message: error.message || 'Failed to create sacrament' });
    }
  },

  // PUT /sacraments/:id
  async update(req, res) {
    try {
      const { id } = req.params;
      const organization_id = req.auth.organization_id;
      const data = req.body;

      const updated = await Sacraments.update(id, organization_id, data);

      if (!updated) {
        return res.status(404).json({ message: 'Sacrament not found or not authorized' });
      }

      res.status(200).json(updated);
    } catch (error) {
      console.error('Update sacrament error:', error);
      res.status(500).json({ message: 'Failed to update sacrament' });
    }
  },

  // DELETE /sacraments/:id
  async delete(req, res) {
    try {
      const { id } = req.params;

      const deleted = await Sacraments.delete(id);

      if (!deleted) {
        return res.status(404).json({ message: 'Sacrament not found' });
      }

      res.status(200).json({ message: 'Sacrament deleted successfully', data: deleted });
    } catch (error) {
      console.error('Delete sacrament error:', error);
      res.status(500).json({ message: 'Failed to delete sacrament' });
    }
  }
};

export default SacramentsController;
