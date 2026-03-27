import { Subscription } from "./subscriptions.js";

export const SubscriptionController = {
  async getMySubscription(req, res) {
    try {
      const subscription = await Subscription.getByUser(req.auth.sub);

      if (!subscription) {
        return res.status(404).json({
          error: "No subscription found",
        });
      }

      return res.json(subscription);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async createSubscription(req, res) {
    try {
      const user_id = req.auth.sub;

      const subscription = await Subscription.create({
        user_id,
        plan_id: req.body.plan_id,
        organization_id: req.auth.organization_id,
        headquarters_id: req.auth.headquarters_id,
      });

      return res.status(201).json(subscription);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async cancelSubscription(req, res) {
    try {
      const { id } = req.params;

      const subscription = await Subscription.getById(id);

      if (!subscription) {
        return res.status(404).json({ error: "Subscription not found" });
      }

      // 🔐 strict multi-tenant + ownership check
      if (
        subscription.user_id !== req.auth.sub ||
        subscription.organization_id !== req.auth.organization_id
      ) {
        return res.status(403).json({
          error: "Unauthorized",
        });
      }

      const updated = await Subscription.cancel(id);

      return res.json({
        message: "Subscription canceled",
        subscription: updated,
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async upgradeSubscription(req, res) {
    try {
      const { id } = req.params;
      const { plan_id } = req.body;

      const subscription = await Subscription.getById(id);

      if (!subscription) {
        return res.status(404).json({ error: "Subscription not found" });
      }

      // 🔐 strict validation
      if (
        subscription.user_id !== req.auth.sub ||
        subscription.organization_id !== req.auth.organization_id
      ) {
        return res.status(403).json({
          error: "Unauthorized",
        });
      }

      const updated = await Subscription.updatePlan(id, plan_id);

      return res.json({
        message: "Subscription upgrade initiated",
        subscription: updated,
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
};