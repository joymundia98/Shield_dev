import TeacherModel from "./teacher.js";

export const teacherController = {
  async create(req, res) {
    const teacher = await TeacherModel.create(req.body);
    res.status(201).json(teacher);
  },

  async getAll(req, res) {
    const teachers = await TeacherModel.findAll();
    res.json(teachers);
  },

  async getById(req, res) {
    const teacher = await TeacherModel.findById(req.params.id);
    if (!teacher) return res.status(404).json({ message: "Not found" });
    res.json(teacher);
  },

  async update(req, res) {
    const teacher = await TeacherModel.update(req.params.id, req.body);
    res.json(teacher);
  },

  async delete(req, res) {
    await TeacherModel.delete(req.params.id);
    res.json({ message: "Teacher deleted" });
  },
};
