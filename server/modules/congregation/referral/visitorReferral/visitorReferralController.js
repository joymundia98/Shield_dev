import VisitorReferral from "./visitorReferralModel.js";

const VisitorReferralController = {
  // Add visitor to a referral source
  async add(req, res) {
    const { visitor_id, referral_id } = req.body;
    const organization_id = req.auth.organization_id;

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
    const organization_id = req.auth.organization_id;

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
    const organization_id = req.auth.organization_id;

    try {
      const referrals = await VisitorReferral.getReferralsByVisitor(visitor_id, organization_id);
      res.json(referrals);
    } catch (err) {
      console.error("Error fetching referrals for visitor:", err);
      res.status(500).json({ error: "Error fetching referrals for visitor" });
    }
  },

  // Get a specific visitor-referral relationship
  async find(req, res) {
    const { visitor_id, referral_id } = req.params;
    const organization_id = req.auth.organization_id;

    try {
      const record = await VisitorReferral.find(visitor_id, referral_id, organization_id);
      if (!record) return res.status(404).json({ error: "Visitor-referral not found" });
      res.json(record);
    } catch (err) {
      console.error("Error fetching visitor-referral:", err);
      res.status(500).json({ error: "Error fetching visitor-referral" });
    }
  },

  // Update a visitor-referral record (optional notes/status)
  async update(req, res) {
    const { visitor_id, referral_id } = req.params;
    const organization_id = req.auth.organization_id;
    const data = req.body;

    try {
      const updated = await VisitorReferral.update(visitor_id, referral_id, organization_id, data);
      if (!updated) return res.status(404).json({ error: "Visitor-referral not found" });
      res.json(updated);
    } catch (err) {
      console.error("Error updating visitor-referral:", err);
      res.status(500).json({ error: "Error updating visitor-referral" });
    }
  },

  // Get all visitors linked to a specific referral
  async getVisitorsByReferral(req, res) {
    const { referral_id } = req.params;
    const organization_id = req.auth.organization_id;

    try {
      const visitors = await VisitorReferral.getVisitorsByReferral(referral_id, organization_id);
      res.json(visitors);
    } catch (err) {
      console.error("Error fetching visitors for referral:", err);
      res.status(500).json({ error: "Error fetching visitors for referral" });
    }
  },
};

export default VisitorReferralController;
