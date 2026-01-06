import TeacherModel from "./teacher.js";

export const teacherController = {
  async create(req, res) {
    try {
      const data = { ...req.body, organization_id: req.user.organization_id };
      const teacher = await TeacherModel.create(data);
      res.status(201).json(teacher);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create teacher" });
    }
  },

  async getAll(req, res) {
    try {
      const teachers = await TeacherModel.findAll(req.user.organization_id);
      res.json(teachers);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch teachers" });
    }
  },

  async getById(req, res) {
    try {
      const teacher = await TeacherModel.findById(
        req.params.id,
        req.user.organization_id
      );
      if (!teacher) return res.status(404).json({ message: "Teacher not found" });
      res.json(teacher);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch teacher" });
    }
  },

  async update(req, res) {
    try {
      const data = { ...req.body, organization_id: req.user.organization_id };
      const teacher = await TeacherModel.update(req.params.id, data);
      if (!teacher) return res.status(404).json({ message: "Teacher not found" });
      res.json(teacher);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update teacher" });
    }
  },

  async delete(req, res) {
    try {
      const deleted = await TeacherModel.delete(req.params.id, req.user.organization_id);
      if (!deleted) return res.status(404).json({ message: "Teacher not found" });
      res.json({ message: "Teacher deleted" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to delete teacher" });
    }
  },
};
