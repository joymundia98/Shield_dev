import Visitor from "./visitorModel.js";

const VisitorController = {
  // Get all visitors
  async getAll(req, res) {
    try {
      const visitors = await Visitor.getAll();
      res.json(visitors);
    } catch (err) {
      res.status(500).json({ error: "Error fetching visitors" });
    }
  },

  // Get a visitor by ID
  async getById(req, res) {
    const { id } = req.params;
    try {
      const visitor = await Visitor.getById(id);
      if (!visitor) {
        return res.status(404).json({ error: "Visitor not found" });
      }
      res.json(visitor);
    } catch (err) {
      res.status(500).json({ error: "Error fetching visitor" });
    }
  },

  // Create a new visitor
  async create(req, res) {
    const visitorData = req.body;
    try {
      const newVisitor = await Visitor.create(visitorData);
      res.status(201).json(newVisitor);
    } catch (err) {
      res.status(500).json({ error: "Error creating visitor" });
    }
  },

  // Update an existing visitor
  async update(req, res) {
    const { id } = req.params;
    const visitorData = req.body;
    try {
      const updatedVisitor = await Visitor.update(id, visitorData);
      if (!updatedVisitor) {
        return res.status(404).json({ error: "Visitor not found" });
      }
      res.json(updatedVisitor);
    } catch (err) {
      res.status(500).json({ error: "Error updating visitor" });
    }
  },

  // Delete a visitor
  async delete(req, res) {
    const { id } = req.params;
    try {
      const deletedVisitor = await Visitor.delete(id);
      if (!deletedVisitor) {
        return res.status(404).json({ error: "Visitor not found" });
      }
      res.json(deletedVisitor);
    } catch (err) {
      res.status(500).json({ error: "Error deleting visitor" });
    }
  }
};

export default VisitorController;
