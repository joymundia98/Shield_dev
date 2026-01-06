import Church from './church.js';

const churchController = {
  // Get all churches for the authenticated organization
  async getAll(req, res) {
    try {
      const organization_id = req.auth.organization_id;
      const churches = await Church.getAll(organization_id);
      res.json({ data: churches });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch churches' });
    }
  },

  // Get a single church by ID for the authenticated organization
  async getById(req, res) {
    try {
      const { id } = req.params;
      const organization_id = req.auth.organization_id;

      const church = await Church.getById(id, organization_id);
      if (!church) return res.status(404).json({ error: 'Church not found' });

      res.json(church);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch church' });
    }
  },

  // Create a new church for the authenticated organization
  async create(req, res) {
    try {
      const organization_id = req.auth.organization_id;
      const church = await Church.create({ ...req.body, organization_id });
      res.status(201).json(church);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create church' });
    }
  },

  // Update a church by ID for the authenticated organization
  async update(req, res) {
    try {
      const { id } = req.params;
      const organization_id = req.auth.organization_id;

      const church = await Church.update(id, req.body, organization_id);
      if (!church) return res.status(404).json({ error: 'Church not found' });

      res.json(church);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update church' });
    }
  },

  // Delete a church by ID for the authenticated organization
  async delete(req, res) {
    try {
      const { id } = req.params;
      const organization_id = req.auth.organization_id;

      const church = await Church.delete(id, organization_id);
      if (!church) return res.status(404).json({ error: 'Church not found' });

      res.json({ message: 'Church deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete church' });
    }
  }
};

export default churchController;
