import ConvertsModel from './convert.js';

export const convertsController = {
  // Get all converts
  async getAll(req, res) {
    try {
      const converts = await ConvertsModel.findAll();
      res.json(converts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch converts' });
    }
  },

  // Get convert by ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const convert = await ConvertsModel.findById(id);
      if (!convert) return res.status(404).json({ error: 'Convert not found' });
      res.json(convert);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch convert' });
    }
  },

  // Create a new convert
  async create(req, res) {
    try {
      const data = req.body;
      const newConvert = await ConvertsModel.create(data);
      res.status(201).json(newConvert);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create convert' });
    }
  },

  // Update convert by ID
  async update(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      const updatedConvert = await ConvertsModel.update(id, data);
      if (!updatedConvert) return res.status(404).json({ error: 'Convert not found' });
      res.json(updatedConvert);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update convert' });
    }
  },

  // Delete convert by ID
  async delete(req, res) {
    try {
      const { id } = req.params;
      await ConvertsModel.delete(id);
      res.json({ message: 'Convert deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete convert' });
    }
  },

  // Get converts by member
  async getByMember(req, res) {
    try {
      const { member_id } = req.params;
      const converts = await ConvertsModel.findByMember(member_id);
      res.json(converts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch converts for member' });
    }
  },

  // Get converts by visitor
  async getByVisitor(req, res) {
    try {
      const { visitor_id } = req.params;
      const converts = await ConvertsModel.findByVisitor(visitor_id);
      res.json(converts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch converts for visitor' });
    }
  },

  // Get converts by organization
  async getByOrganization(req, res) {
    try {
      const { organization_id } = req.params;
      const converts = await ConvertsModel.findByOrganization(organization_id);
      res.json(converts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch converts for organization' });
    }
  },
};
