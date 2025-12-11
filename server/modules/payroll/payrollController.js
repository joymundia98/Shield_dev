import Payroll from "./payroll.js";

const payrollController = {
  async getAll(req, res) {
    try {
      const payrolls = await Payroll.getAll();
      res.json(payrolls);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch payroll records" });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const payroll = await Payroll.getById(id);
      if (!payroll) return res.status(404).json({ error: "Payroll not found" });
      res.json(payroll);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch payroll record" });
    }
  },

  async create(req, res) {
    try {
      const payroll = await Payroll.create(req.body);
      res.status(201).json(payroll);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create payroll record" });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const payroll = await Payroll.update(id, req.body);
      if (!payroll) return res.status(404).json({ error: "Payroll not found" });
      res.json(payroll);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update payroll record" });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const payroll = await Payroll.delete(id);
      if (!payroll) return res.status(404).json({ error: "Payroll not found" });
      res.json({ message: "Payroll deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to delete payroll record" });
    }
  }
};

export default payrollController;
