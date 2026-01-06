import { Attendee } from './attendee.js';

export const attendeeController = {
  async create(req, res) {
    try {
      const attendee = await Attendee.create({
      ...req.body,
      organization_id: rreq.auth.organization_id,
    });
      res.status(201).json(attendee);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create attendee" });
    }
  },

  async getAll(req, res) {
    try {
      const {organization_id} = req.params
      const attendees = await Attendee.getAll(organization_id);
      res.json(attendees);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch attendees" });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const organization_id = req.auth.organization_id;
      const attendee = await Attendee.getById(id, organization_id);
      if (!attendee) return res.status(404).json({ error: "Attendee not found" });
      res.json(attendee);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch attendee" });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const attendee = await Attendee.update(id, req.body);
      if (!attendee) return res.status(404).json({ error: "Attendee not found" });
      res.json(attendee);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update attendee" });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const attendee = await Attendee.delete(id);
      if (!attendee) return res.status(404).json({ error: "Attendee not found" });
      res.json({ message: "Attendee deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to delete attendee" });
    }
  },

  async getByProgram(req, res) {
    try {
      const { program_id } = req.params;
      const attendees = await Attendee.getByProgram(program_id);
      res.json({ message: `Attendees for program ${program_id}`, data: attendees });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch attendees by program" });
    }
  },
};
