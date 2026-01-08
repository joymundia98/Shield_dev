import Visitor from "./visitorModel.js";

const VisitorController = {
  // Get all visitors for the organization
  async getAll(req, res) {
    try {
      const organization_id = req.auth.organization_id;
      const visitors = await Visitor.getAll(organization_id);
      res.json(visitors);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error fetching visitors" });
    }
  },

  // Get a visitor by ID within the organization
  async getById(req, res) {
    const { id } = req.params;

    try {
      const organization_id = req.auth.organization_id;
      const visitor = await Visitor.getById(id, organization_id);

      if (!visitor) {
        return res.status(404).json({ error: "Visitor not found" });
      }

      res.json(visitor);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error fetching visitor" });
    }
  },

  // Create a new visitor under the organization
  async create(req, res) {
    try {
      const organization_id = req.auth.organization_id;
      const {
        name,
        visit_date,
        service_id
      } = req.body;

      // Minimal required validation
      if (!name) {
        return res.status(400).json({ error: "Name is required" });
      }

      if (!visit_date) {
        return res.status(400).json({ error: "Visit date is required" });
      }

      if (service_id && isNaN(service_id)) {
        return res.status(400).json({ error: "Invalid service_id" });
      }

      const newVisitor = await Visitor.create(req.body, organization_id);
      res.status(201).json(newVisitor);

    } catch (err) {
      console.error(err);

      // Postgres FK violation
      if (err.code === "23503") {
        return res.status(400).json({
          error: "Invalid service reference"
        });
      }

      res.status(500).json({ error: "Error creating visitor" });
    }
  },

  // Update an existing visitor under the organization
  async update(req, res) {
    const { id } = req.params;

    try {
      const organization_id = req.auth.organization_id;
      const { service_id } = req.body;

      if (service_id && isNaN(service_id)) {
        return res.status(400).json({ error: "Invalid service_id" });
      }

      const updatedVisitor = await Visitor.update(
        id,
        req.body,
        organization_id
      );

      if (!updatedVisitor) {
        return res.status(404).json({ error: "Visitor not found" });
      }

      res.json(updatedVisitor);

    } catch (err) {
      console.error(err);

      if (err.code === "23503") {
        return res.status(400).json({
          error: "Invalid service reference"
        });
      }

      res.status(500).json({ error: "Error updating visitor" });
    }
  },

  // Delete a visitor under the organization
  async delete(req, res) {
    const { id } = req.params;

    try {
      const organization_id = req.auth.organization_id;
      const deletedVisitor = await Visitor.delete(id, organization_id);

      if (!deletedVisitor) {
        return res.status(404).json({ error: "Visitor not found" });
      }

      res.json(deletedVisitor);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error deleting visitor" });
    }
  }
};

export default VisitorController;
