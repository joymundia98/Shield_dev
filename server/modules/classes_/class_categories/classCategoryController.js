import ClassCategoryModel from "./classCategory.js";

export const classCategoryController = {
  async create(req, res) {
    try {
      const { organization_id } = req.body;
      if (!organization_id) {
        return res.status(400).json({ error: "organization_id is required" });
      }

      const category = await ClassCategoryModel.create(req.body);
      res.status(201).json(category);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create class category" });
    }
  },

  async getAll(req, res) {
    try {
      const { organization_id } = req.user.organization_id;
      if (!organization_id) {
        return res.status(400).json({ error: "organization_id is required" });
      }

      const categories = await ClassCategoryModel.findAll(organization_id);
      res.json(categories);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch class categories" });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const { organization_id } = req.user.organization_id;
      if (!organization_id) {
        return res.status(400).json({ error: "organization_id is required" });
      }

      const category = await ClassCategoryModel.findById(id, organization_id);
      if (!category) {
        return res.status(404).json({ error: "Class category not found" });
      }
      res.json(category);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch class category" });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { organization_id } = req.user.organization_id;
      if (!organization_id) {
        return res.status(400).json({ error: "organization_id is required" });
      }

      const category = await ClassCategoryModel.update(id, req.body);
      if (!category) {
        return res.status(404).json({ error: "Class category not found" });
      }
      res.json(category);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update class category" });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const { organization_id } = req.user.organization_id;
      if (!organization_id) {
        return res.status(400).json({ error: "organization_id is required" });
      }

      const deleted = await ClassCategoryModel.delete(id, organization_id);
      if (!deleted) {
        return res.status(404).json({ error: "Class category not found or already deleted" });
      }
      res.json({ message: "Class category deleted successfully", deleted });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete class category" });
    }
  },
};
