import VisitorService from "./visitorServiceModel.js";

const VisitorServiceController = {
  // Add a visitor to a service
  async add(req, res) {
    try {
      const { visitor_id, service_id } = req.body;
      const organization_id = req.auth.organization_id; // Get org ID from auth

      const result = await VisitorService.add(
        { visitor_id, service_id },
        organization_id
      );

      res.status(201).json({ message: "Visitor added to service", data: result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error adding visitor to service" });
    }
  },

  // Remove a visitor from a service
  async remove(req, res) {
    try {
      const { visitor_id, service_id } = req.params;
      const organization_id = req.auth.organization_id; // Get org ID from auth

      const result = await VisitorService.remove(visitor_id, service_id, organization_id);

      if (result) {
        res.status(200).json({ message: "Visitor removed from service", data: result });
      } else {
        res.status(404).json({ message: "Visitor-service relationship not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error removing visitor from service" });
    }
  },

  // Get all services attended by a visitor
  async getServicesByVisitor(req, res) {
    try {
      const { visitor_id } = req.params;
      const organization_id = req.auth.organization_id; // Get org ID from auth

      const services = await VisitorService.getServicesByVisitor(visitor_id, organization_id);

      res.status(200).json({ message: "Services found", data: services });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error retrieving services for visitor" });
    }
  }
};

export default VisitorServiceController;
