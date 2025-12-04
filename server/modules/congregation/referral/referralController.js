import Referral from "./referralModel.js";

const ReferralController = {
  // Get all referrals
  async getAll(req, res) {
    try {
      const referrals = await Referral.getAll();
      res.json(referrals);
    } catch (err) {
      res.status(500).json({ error: "Error fetching referrals" });
    }
  },

  // Get a referral by ID
  async getById(req, res) {
    const { id } = req.params;
    try {
      const referral = await Referral.getById(id);
      if (!referral) {
        return res.status(404).json({ error: "Referral not found" });
      }
      res.json(referral);
    } catch (err) {
      res.status(500).json({ error: "Error fetching referral" });
    }
  },

  // Create a new referral
  async create(req, res) {
    const { source } = req.body;
    try {
      const newReferral = await Referral.create(source);
      res.status(201).json(newReferral);
    } catch (err) {
      res.status(500).json({ error: "Error creating referral" });
    }
  },

  // Delete a referral
  async delete(req, res) {
    const { id } = req.params;
    try {
      const deletedReferral = await Referral.delete(id);
      if (!deletedReferral) {
        return res.status(404).json({ error: "Referral not found" });
      }
      res.json(deletedReferral);
    } catch (err) {
      res.status(500).json({ error: "Error deleting referral" });
    }
  }
};

export default ReferralController;
