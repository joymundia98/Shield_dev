import MemberStatistics from "./memberStatisticsModel.js";

const MemberStatisticsController = {
  // Get all statistics
  async getAll(req, res) {
    try {
      const data = await MemberStatistics.getAll();
      return res.json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // Get statistics by date
  async getByDate(req, res) {
    try {
      const { date } = req.params;
      const data = await MemberStatistics.getByDate(date);

      if (!data)
        return res.status(404).json({ message: "Statistics not found for this date" });

      return res.json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // Create or update statistics
  async upsert(req, res) {
    try {
      const data = await MemberStatistics.upsert(req.body);
      return res.status(201).json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // Recalculate today's statistics from members table
  async recalculateToday(req, res) {
    try {
      const data = await MemberStatistics.recalculateToday();
      return res.json({ message: "Statistics recalculated", data });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};

export default MemberStatisticsController;
