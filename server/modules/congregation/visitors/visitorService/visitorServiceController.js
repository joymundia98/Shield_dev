import VisitorService from "./visitorServiceModel.js";

const VisitorServiceController = {
  // Add a visitor to a service
  async add(req, res) {
    try {
      const { visitor_id, service_id } = req.body;
      const organization_id = req.auth.organization_id;

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
      const organization_id = req.auth.organization_id;

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

  // Update a visitor's service assignment
  async update(req, res) {
    const { id } = req.params;

    try {
      const { visitor_id, old_service_id, new_service_id } = req.body;
      const organization_id = req.auth.organization_id;

      if (!visitor_id || !old_service_id || !new_service_id) {
        return res.status(400).json({
          message: "visitor_id, old_service_id, and new_service_id are required",
        });
      }

      const result = await VisitorService.update(
        { id, visitor_id, old_service_id, new_service_id },
        organization_id
      );

      if (!result) {
        return res.status(404).json({ message: "Visitor-service relationship not found" });
      }

      res.status(200).json({ message: "Visitor service updated", data: result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating visitor service" });
    }
  },

  // Get all services attended by a visitor
  async getServicesByVisitor(req, res) {
    try {
      const { visitor_id } = req.params;
      const organization_id = req.auth.organization_id;

      const services = await VisitorService.getServicesByVisitor(visitor_id, organization_id);

      res.status(200).json({ message: "Services found", data: services });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error retrieving services for visitor" });
    }
  }
};

export default VisitorServiceController;
