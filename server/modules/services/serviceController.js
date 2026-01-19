// modules/services/serviceController.js
import Service from "./serviceModel.js";

const ServiceController = {
  // Get all services for the organization
  async getAll(req, res) {
    try {
      const organization_id = req.auth.organization_id;
      const services = await Service.getAll(organization_id);
      res.json(services);
    } catch (err) {
      console.error("Get all services error:", err);
      res.status(500).json({ error: "Error fetching services" });
    }
  },

  // Get a service by ID (organization-scoped)
  async getById(req, res) {
    const { id } = req.params;
    const organization_id = req.auth.organization_id;
    try {
      const service = await Service.getById(id, organization_id);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      res.json(service);
    } catch (err) {
      console.error("Get service by ID error:", err);
      res.status(500).json({ error: "Error fetching service" });
    }
  },

  // Create a new service (organization-scoped)
  async create(req, res) {
    const organization_id = req.auth.organization_id;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Service name is required" });
    }

    try {
      const newService = await Service.create({ name, description }, organization_id);
      res.status(201).json(newService);
    } catch (err) {
      console.error("Create service error:", err);
      res.status(500).json({ error: "Error creating service" });
    }
  },

  // Update a service (organization-scoped)
  async update(req, res) {
    const { id } = req.params;
    const organization_id = req.auth.organization_id;
    const { name, description } = req.body;

    try {
      const updatedService = await Service.update(id, { name, description }, organization_id);
      if (!updatedService) {
        return res.status(404).json({ error: "Service not found" });
      }
      res.json(updatedService);
    } catch (err) {
      console.error("Update service error:", err);
      res.status(500).json({ error: "Error updating service" });
    }
  },

  // Delete a service (organization-scoped)
  async delete(req, res) {
    const { id } = req.params;
    const organization_id = req.auth.organization_id;

    try {
      const deletedService = await Service.delete(id, organization_id);
      if (!deletedService) {
        return res.status(404).json({ error: "Service not found" });
      }
      res.json({ message: "Service deleted successfully", deletedService });
    } catch (err) {
      console.error("Delete service error:", err);
      res.status(500).json({ error: "Error deleting service" });
    }
  }
};

export default ServiceController;
