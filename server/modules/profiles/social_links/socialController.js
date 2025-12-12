import SocialLinks from './socialController.js';

const socialLinksController = {
  async getAll(req, res) {
    try {
      const links = await SocialLinks.getAll();
      res.json({ data: links });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch social links' });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const link = await SocialLinks.getById(id);
      if (!link) return res.status(404).json({ error: 'Social link not found' });
      res.json(link);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch social link' });
    }
  },

  async getByChurchId(req, res) {
    try {
      const { church_id } = req.params;
      const links = await SocialLinks.getByChurchId(church_id);
      res.json({ data: links });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch social links for church' });
    }
  },

  async create(req, res) {
    try {
      const link = await SocialLinks.create(req.body);
      res.status(201).json(link);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create social link' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const link = await SocialLinks.update(id, req.body);
      if (!link) return res.status(404).json({ error: 'Social link not found' });
      res.json(link);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update social link' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const link = await SocialLinks.delete(id);
      if (!link) return res.status(404).json({ error: 'Social link not found' });
      res.json({ message: 'Social link deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete social link' });
    }
  }
};

export default socialLinksController;
