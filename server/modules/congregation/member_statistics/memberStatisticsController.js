import MemberStatistics from "./memberStatisticsModel.js";

const MemberStatisticsController = {
  // Get all statistics (organization scoped)
  async getAll(req, res) {
    try {
      const organization_id = req.auth.organization_id;

      const data = await MemberStatistics.getAll(organization_id);
      return res.json(data);
    } catch (err) {
      console.error("Error fetching member statistics:", err);
      return res.status(500).json({ error: err.message });
    }
  },

  // Get statistics by date (organization scoped)
  async getByDate(req, res) {
    try {
      const { date } = req.params;
      const organization_id = req.auth.organization_id;

      const data = await MemberStatistics.getByDate(date, organization_id);

      if (!data) {
        return res
          .status(404)
          .json({ message: "Statistics not found for this date" });
      }

      return res.json(data);
    } catch (err) {
      console.error("Error fetching statistics by date:", err);
      return res.status(500).json({ error: err.message });
    }
  },

  // Create or update statistics (organization enforced)
  async upsert(req, res) {
    try {
      const organization_id = req.auth.organization_id;

      const data = await MemberStatistics.upsert(
        req.body,
        organization_id
      );

      return res.status(201).json(data);
    } catch (err) {
      console.error("Error upserting statistics:", err);
      return res.status(500).json({ error: err.message });
    }
  },

  // Recalculate today's statistics (organization scoped)
  async recalculateToday(req, res) {
    try {
      const organization_id = req.auth.organization_id;

      const data = await MemberStatistics.recalculateToday(organization_id);

      return res.json({
        message: "Statistics recalculated successfully",
        data
      });
    } catch (err) {
      console.error("Error recalculating statistics:", err);
      return res.status(500).json({ error: err.message });
    }
  }
};

export default MemberStatisticsController;
