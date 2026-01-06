import Service from "./serviceModel.js";

const ServiceController = {
  // Get all services
  async getAll(req, res) {
    try {
      const organization_id = req.user.organization_id;
      const services = await Service.getAll(organization_id);
      res.json(services);
    } catch (err) {
      res.status(500).json({ error: "Error fetching services" });
    }
  },

  // Get a service by ID
  async getById(req, res) {
    const { id } = req.params;
    const organization_id = req.user.organization_id;
    try {
      const service = await Service.getById(id, organization_id);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      res.json(service);
    } catch (err) {
      res.status(500).json({ error: "Error fetching service" });
    }
  },

  // Create a new service
  async create(req, res) {
    const { name } = req.body;
    try {
      const newService = await Service.create(name);
      res.status(201).json(newService);
    } catch (err) {
      res.status(500).json({ error: "Error creating service" });
    }
  },

  // Delete a service
  async delete(req, res) {
    const { id } = req.params;
    try {
      const deletedService = await Service.delete(id);
      if (!deletedService) {
        return res.status(404).json({ error: "Service not found" });
      }
      res.json(deletedService);
    } catch (err) {
      res.status(500).json({ error: "Error deleting service" });
    }
  }
};

export default ServiceController;
