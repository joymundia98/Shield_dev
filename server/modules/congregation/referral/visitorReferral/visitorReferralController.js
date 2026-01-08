import VisitorReferral from "./visitorReferralModel.js";

const VisitorReferralController = {
  // Add visitor to a referral source
  async add(req, res) {
    const { visitor_id, referral_id } = req.body;
    const organization_id = req.auth.organization_id; // 👈 get org from auth

    if (!visitor_id || !referral_id) {
      return res.status(400).json({ error: "visitor_id and referral_id are required" });
    }

    try {
      const newEntry = await VisitorReferral.add(visitor_id, referral_id, organization_id);
      res.status(201).json(newEntry);
    } catch (err) {
      console.error("Error adding referral source:", err);
      res.status(500).json({ error: "Error adding referral source" });
    }
  },

  // Remove referral source from a visitor
  async remove(req, res) {
    const { visitor_id, referral_id } = req.params;
    const organization_id = req.auth.organization_id; // 👈 get org from auth

    try {
      const deletedEntry = await VisitorReferral.remove(visitor_id, referral_id, organization_id);
      if (!deletedEntry) {
        return res.status(404).json({ error: "Visitor or referral not found" });
      }
      res.json(deletedEntry);
    } catch (err) {
      console.error("Error removing referral from visitor:", err);
      res.status(500).json({ error: "Error removing referral from visitor" });
    }
  },

  // Get all referral sources for a visitor
  async getReferralsByVisitor(req, res) {
    const { visitor_id } = req.params;
    const organization_id = req.auth.organization_id; // 👈 get org from auth

    try {
      const referrals = await VisitorReferral.getReferralsByVisitor(visitor_id, organization_id);
      res.json(referrals);
    } catch (err) {
      console.error("Error fetching referrals for visitor:", err);
      res.status(500).json({ error: "Error fetching referrals for visitor" });
    }
  }
};

export default VisitorReferralController;
