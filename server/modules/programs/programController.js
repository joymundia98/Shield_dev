import { Program } from './program.js';

export const programController = {
  async create(req, res) {
    try {
      const program = await Program.create({
        ...req.body,
        organization_id: req.user.organization_id,
      });

      res.status(201).json(program);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create program" });
    }
  },

  async getAll(req, res) {
    try {
      const organization_id = req.user.organization_id;
      const programs = await Program.getAll(organization_id);
      res.json(programs);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch programs" });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const organization_id = req.user.organization_id;      
      const program = await Program.getById(id,organization_id);
      if (!program) return res.status(404).json({ error: "Program not found" });
      res.json(program);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch program" });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const program = await Program.update(id, req.body);
      if (!program) return res.status(404).json({ error: "Program not found" });
      res.json(program);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update program" });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const program = await Program.delete(id);
      if (!program) return res.status(404).json({ error: "Program not found" });
      res.json({ message: "Program deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to delete program" });
    }
  },

  async getByStatus(req, res) {
    try {
      const { status } = req.params;
      const programs = await Program.getByStatus(status);
      res.json({ message: `Programs with status '${status}' fetched`, data: programs });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch programs by status" });
    }
  },
};
