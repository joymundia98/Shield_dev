import Referral from "./referralModel.js";

const ReferralController = {
  // Get all referrals for the organization
  async getAll(req, res) {
    try {
      const referrals = await Referral.getAll(req.auth.organization_id);
      res.json(referrals);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error fetching referrals" });
    }
  },

  // Get a referral by ID (organization-scoped)
  async getById(req, res) {
    const { id } = req.params;
    try {
      const referral = await Referral.getById(id, req.auth.organization_id);
      if (!referral) {
        return res.status(404).json({ error: "Referral not found" });
      }
      res.json(referral);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error fetching referral" });
    }
  },

  // Create a new referral for the organization
  async create(req, res) {
    const { source } = req.body;
    try {
      if (!source) {
        return res.status(400).json({ error: "Source is required" });
      }
      const newReferral = await Referral.create(source, req.auth.organization_id);
      res.status(201).json(newReferral);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error creating referral" });
    }
  },

  // Delete a referral (organization-scoped)
  async delete(req, res) {
    const { id } = req.params;
    try {
      const deletedReferral = await Referral.delete(id, req.auth.organization_id);
      if (!deletedReferral) {
        return res.status(404).json({ error: "Referral not found" });
      }
      res.json({ message: "Referral deleted successfully", deletedReferral });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error deleting referral" });
    }
  }
};

export default ReferralController;
