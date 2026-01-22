import HeadquartersModel from "./hqModel.js";

const HeadquartersController = {
  // =========================
  // CREATE HQ
  // =========================
  async create(req, res) {
    try {
      const hq = await HeadquartersModel.create(req.body);
      res.status(201).json(hq);
    } catch (err) {
      console.error("Create HQ error:", err);
      res.status(500).json({ message: "Failed to create headquarters" });
    }
  },

  // =========================
  // GET ALL HQ
  // =========================
  async getAll(req, res) {
    try {
      const hqs = await HeadquartersModel.getAll();
      res.json(hqs);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch headquarters" });
    }
  },

  // =========================
  // GET HQ BY ID
  // =========================
  async getById(req, res) {
    try {
      const hq = await HeadquartersModel.getById(req.params.id);
      if (!hq) return res.status(404).json({ message: "HQ not found" });
      res.json(hq);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch HQ" });
    }
  },

  async getOrganizationsByHQId(req, res) {
    try {
      const hq = await HeadquartersModel.getOrgsByHQId(req.params.id);
      if (!hq) return res.status(404).json({ message: "organizations under HQ not found" });
      res.json(hq);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch Orgs" });
    }
  },

async getOrgUnderHQ(req, res) {
  try {
    const { headquarter_id, org_id } = req.params;

    if (!headquarter_id || !org_id)
      return res.status(400).json({ message: "headquarter_id and org_id are required" });

    const org = await HeadquartersModel.getOrgByIdUnderHQ(org_id, headquarter_id);

    if (!org)
      return res.status(404).json({ message: "Organization not found under this headquarter" });

    res.json({
      message: "Organization details",
      organization: org
    });
  } catch (err) {
    console.error("Error fetching organization under HQ:", err);
    res.status(500).json({ message: "Server error" });
  }
},

  // =========================
  // UPDATE HQ
  // =========================
  async update(req, res) {
    try {
      const hq = await HeadquartersModel.update(req.params.id, req.body);
      if (!hq) return res.status(404).json({ message: "HQ not found" });
      res.json(hq);
    } catch (err) {
      res.status(500).json({ message: "Failed to update HQ" });
    }
  },

  // =========================
  // DELETE HQ
  // =========================
  async delete(req, res) {
    try {
      const hq = await HeadquartersModel.delete(req.params.id);
      if (!hq) return res.status(404).json({ message: "HQ not found" });
      res.json({ message: "HQ deleted" });
    } catch (err) {
      res.status(500).json({ message: "Failed to delete HQ" });
    }
  },

  // =========================
  // GET ORGANIZATIONS UNDER HQ
  // =========================
  async getOrganizations(req, res) {
    try {
      const orgs = await HeadquartersModel.getOrganizations(req.params.id);
      res.json(orgs);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch organizations" });
    }
  }
};

export default HeadquartersController;
