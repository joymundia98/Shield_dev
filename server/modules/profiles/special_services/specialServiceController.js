import SpecialServices from './specialServiceController.js';

const specialServicesController = {
  async getAll(req, res) {
    try {
      const services = await SpecialServices.getAll();
      res.json({ data: services });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch special services' });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const service = await SpecialServices.getById(id);
      if (!service) return res.status(404).json({ error: 'Special service not found' });
      res.json(service);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch special service' });
    }
  },

  async getByChurchId(req, res) {
    try {
      const { church_id } = req.params;
      const services = await SpecialServices.getByChurchId(church_id);
      res.json({ data: services });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch special services for church' });
    }
  },

  async create(req, res) {
    try {
      const service = await SpecialServices.create(req.body);
      res.status(201).json(service);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create special service' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const service = await SpecialServices.update(id, req.body);
      if (!service) return res.status(404).json({ error: 'Special service not found' });
      res.json(service);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update special service' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const service = await SpecialServices.delete(id);
      if (!service) return res.status(404).json({ error: 'Special service not found' });
      res.json({ message: 'Special service deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete special service' });
    }
  }
};

export default specialServicesController;
