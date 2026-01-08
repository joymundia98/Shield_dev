import Payroll from "./payroll.js";

const payrollController = {
  async getAll(req, res) {
    try {
      const organization_id = req.auth.organization_id
      const payrolls = await Payroll.getAll(organization_id);
      res.json(payrolls);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch payroll records" });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const organization_id = req.auth.organization_id
      const payroll = await Payroll.getById(id,organization_id);
      if (!payroll) return res.status(404).json({ error: "Payroll not found" });
      res.json(payroll);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch payroll record" });
    }
  },

  async create(req, res) {
    try {
      const payroll = await Payroll.create(
        {
          ...req.body,
          organization_id: req.auth.organization_id,
        },
        {
          user_id: req.user.id,
          organization_id: req.auth.organization_id,
          ip_address: req.ip,
        }
      );

      res.status(201).json(payroll);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create payroll record" });
    }
  },

async update(req, res) {
  try {
    const { id } = req.params;

    await Payroll.update(
      id,
      req.auth.organization_id,
      req.body,
      {
        user_id: req.auth.user_id,
        ip_address: req.ip,
        user_agent: req.headers["user-agent"]
      }
    );

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);

    if (err.message === "Payroll record not found") {
      return res.status(404).json({ error: err.message });
    }

    return res.status(500).json({ error: "Failed to update payroll" });
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
