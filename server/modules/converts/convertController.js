import ConvertsModel from "./convert.js";

export const convertsController = {
  // GET all converts (org scoped)
  async getAll(req, res) {
    try {
      const organization_id = req.auth.organization_id;

      const converts = await ConvertsModel.findAll(organization_id);
      res.json(converts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch converts" });
    }
  },

  // GET convert by ID (org scoped)
  async getById(req, res) {
    try {
      const { id } = req.params;
      const organization_id = req.auth.organization_id;

      const convert = await ConvertsModel.findById(id, organization_id);
      if (!convert)
        return res.status(404).json({ error: "Convert not found" });

      res.json(convert);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch convert" });
    }
  },

  // CREATE convert (org enforced)
  async create(req, res) {
    try {
      const organization_id = req.auth.organization_id;

      const newConvert = await ConvertsModel.create(
        req.body,
        organization_id
      );

      res.status(201).json(newConvert);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create convert" });
    }
  },

  // UPDATE convert (org locked)
  async update(req, res) {
    try {
      const { id } = req.params;
      const organization_id = req.auth.organization_id;

      const updatedConvert = await ConvertsModel.update(
        id,
        req.body,
        organization_id
      );

      if (!updatedConvert)
        return res.status(404).json({ error: "Convert not found" });

      res.json(updatedConvert);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update convert" });
    }
  },

  // DELETE convert (org scoped)
  async delete(req, res) {
    try {
      const { id } = req.params;
      const organization_id = req.auth.organization_id;

      const deleted = await ConvertsModel.delete(id, organization_id);
      if (!deleted)
        return res.status(404).json({ error: "Convert not found" });

      res.json({ message: "Convert deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to delete convert" });
    }
  },

  // GET converts by member (org scoped)
  async getByMember(req, res) {
    try {
      const { member_id } = req.params;
      const organization_id = req.auth.organization_id;

      const converts = await ConvertsModel.findByMember(
        member_id,
        organization_id
      );

      res.json(converts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch converts for member" });
    }
  },

  // GET converts by visitor (org scoped)
  async getByVisitor(req, res) {
    try {
      const { visitor_id } = req.params;
      const organization_id = req.auth.organization_id;

      const converts = await ConvertsModel.findByVisitor(
        visitor_id,
        organization_id
      );

      res.json(converts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch converts for visitor" });
    }
  },
};
