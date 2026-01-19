import Referral from "./referralModel.js";

const ReferralController = {
  // Get all referrals for the organization
  async getAll(req, res) {
    try {
      const referrals = await Referral.getAll(req.auth.organization_id);
      res.json(referrals);
    } catch (err) {
      console.error("Get All Referrals Error:", err);
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
      console.error("Get Referral By ID Error:", err);
      res.status(500).json({ error: "Error fetching referral" });
    }
  },

  // Create a new referral for the organization
  async create(req, res) {
    const { source, description } = req.body;
    try {
      if (!source) {
        return res.status(400).json({ error: "Source is required" });
      }
      const newReferral = await Referral.create(
        { source, description },
        req.auth.organization_id
      );
      res.status(201).json(newReferral);
    } catch (err) {
      console.error("Create Referral Error:", err);
      res.status(500).json({ error: "Error creating referral" });
    }
  },

  // Update a referral (organization-scoped)
  async update(req, res) {
    const { id } = req.params;
    const { source, description } = req.body;
    try {
      const updatedReferral = await Referral.update(
        id,
        { source, description },
        req.auth.organization_id
      );
      if (!updatedReferral) {
        return res.status(404).json({ error: "Referral not found" });
      }
      res.json(updatedReferral);
    } catch (err) {
      console.error("Update Referral Error:", err);
      res.status(500).json({ error: "Error updating referral" });
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
      console.error("Delete Referral Error:", err);
      res.status(500).json({ error: "Error deleting referral" });
    }
  }
};

export default ReferralController;
