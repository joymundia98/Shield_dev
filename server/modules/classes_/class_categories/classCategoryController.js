import ClassCategoryModel from "./classCategory.js";

export const classCategoryController = {
  async create(req, res) {
    try {
      const { organization_id } = req.auth.organization_id;
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
      const categories = await ClassCategoryModel.findAll();
      res.json(categories);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch class categories" });
    }
  },

  async getById(req, res) {
    try {
      const category = await ClassCategoryModel.findById(req.params.id);
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
      const category = await ClassCategoryModel.update(
        req.params.id,
        req.body
      );
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
      await ClassCategoryModel.delete(req.params.id);
      res.json({ message: "Class category deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete class category" });
    }
  },
};
