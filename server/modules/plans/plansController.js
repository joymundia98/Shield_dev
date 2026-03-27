import { Plan } from "./plans.js";

export const PlanController = {
  async createPlan(req, res) {
    try {
      const { name, price, billing_cycle } = req.body;

      const plan = await Plan.create({
        name,
        price,
        billing_cycle,
      });

      res.status(201).json(plan);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getPlans(req, res) {
    try {
      const plans = await Plan.getAll();
      res.json(plans);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getPlanById(req, res) {
    try {
      const plan = await Plan.getById(req.params.id);

      if (!plan) {
        return res.status(404).json({
          error: "Plan not found",
        });
      }

      res.json(plan);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async updatePlan(req, res) {
    try {
      const { id } = req.params;

      const plan = await Plan.update(id, req.body);

      if (!plan) {
        return res.status(404).json({
          error: "Plan not found",
        });
      }

      res.json(plan);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async deletePlan(req, res) {
    try {
      const { id } = req.params;

      const plan = await Plan.delete(id);

      if (!plan) {
        return res.status(404).json({
          error: "Plan not found",
        });
      }

      res.json({
        message: "Plan deleted",
        plan,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};