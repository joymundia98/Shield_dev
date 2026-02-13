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


  async getAllByName(req, res) {
    try {
      const hqs = await HeadquartersModel.getAllByName();
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

  async getUsersByHQId(req, res) {
  try {
    const { id } = req.params;

    const users = await HeadquartersModel.getUsersByHQId(id);

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found under this headquarters" });
    }

    res.json(users);
  } catch (err) {
    console.error("Fetch HQ users error:", err);
    res.status(500).json({ message: "Failed to fetch users" });
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

async getDepartmentsByHQ(req, res) {
  try {
    const { headquarter_id } = req.params;

    const departments = await HeadquartersModel.getDepartmentsByHQ(headquarter_id);

    if (!departments || departments.length === 0) {
      return res.status(404).json({ message: "No departments found under this headquarters" });
    }

    res.json(departments);
  } catch (err) {
    console.error("Fetch departments by HQ error:", err);
    res.status(500).json({ message: "Failed to fetch departments" });
  }
},

async getDepartmentsByHQAndOrg(req, res) {
  try {
    const { headquarter_id, org_id } = req.params;

    const departments = await HeadquartersModel.getDepartmentsByHQAndOrg(headquarter_id, org_id);

    if (!departments || departments.length === 0) {
      return res.status(404).json({ message: "No departments found for this organization under this headquarters" });
    }

    res.json(departments);
  } catch (err) {
    console.error("Fetch departments by HQ and Org error:", err);
    res.status(500).json({ message: "Failed to fetch departments" });
  }
},

async getMembersByHQId(req, res) {
  try {
    const { headquarter_id } = req.params;

    const members = await HeadquartersModel.getMembersByHQId(headquarter_id);

    if (!members || members.length === 0) {
      return res.status(404).json({ message: "No members found under this headquarters" });
    }

    res.json(members);
  } catch (err) {
    console.error("Fetch members by HQ error:", err);
    res.status(500).json({ message: "Failed to fetch members" });
  }
},

async getMembersByHQAndOrg(req, res) {
  try {
    const { headquarter_id, org_id } = req.params;

    const members = await HeadquartersModel.getMembersByHQAndOrg(
      headquarter_id,
      org_id
    );

    // Always return 200 — even if empty
    res.status(200).json(members || []);

  } catch (err) {
    console.error("Fetch members by HQ & Org error:", err);
    res.status(500).json({ message: "Failed to fetch members" });
  }
},

async getUsersByHQAndOrg(req, res) {
  try {
    const { headquarter_id, org_id } = req.params;

    const users = await HeadquartersModel.getUsersByHQAndOrg(
      headquarter_id,
      org_id
    );

    // Always return 200
    return res.status(200).json(users || []);

  } catch (err) {
    console.error("Fetch users by HQ and Org error:", err);
    return res.status(500).json({ message: "Failed to fetch users" });
  }
},

async getDonorsByHQId(req, res) {
  try {
    const { headquarter_id } = req.params;

    const donors = await HeadquartersModel.getDonorsByHQId(headquarter_id);

    return res.status(200).json(donors || []);

  } catch (err) {
    console.error("Fetch donors by HQ error:", err);
    res.status(500).json({ message: "Failed to fetch donors" });
  }
},

async getIncomeByHQId(req, res) {
  try {
    const { headquarter_id } = req.params;

    const incomes = await HeadquartersModel.getIncomeByHQId(headquarter_id);

    return res.status(200).json(incomes || []);
  } catch (err) {
    console.error("fetch incomes by HQ error:", err);
    res.status(500).json({ message: "failed to fetch incomes" });
  }
},

async getProgramsByHQId(req, res) {
  try {
    const { headquarter_id } = req.params;

    const programs = await HeadquartersModel.getProgramsByHQId(
      headquarter_id
    );

    // Always return 200, even if empty
    return res.status(200).json(programs || []);

  } catch (err) {
    console.error("Fetch programs by HQ error:", err);
    return res.status(500).json({
      message: "Failed to fetch programs"
    });
  }
},

async getProgramsByHQAndOrg(req, res) {
  try {
    const { headquarter_id, org_id } = req.params;

    const programs = await HeadquartersModel.getProgramsByHQAndOrg(
      headquarter_id,
      org_id
    );

    return res.status(200).json(programs || []);
  } catch (err) {
    console.error("Fetch programs by HQ & Org error:", err);
    res.status(500).json({ message: "Failed to fetch programs" });
  }
},
async getMinistriesByHQId(req, res) {
  try {
    const { headquarter_id } = req.params;

    const ministries = await HeadquartersModel.getMinistriesByHqId(headquarter_id);

    return res.status(200).json(ministries || []);
  } catch (err) {
    console.error("Fetch ministries by HQ error:", err);
    res.status(500).json({ message: "Failed to fetch ministries" });
  }
},

async getMinistriesByHQAndOrg(req, res) {
  try {
    const { headquarter_id, org_id } = req.params;

    const ministries = await HeadquartersModel.getMinistriesByHQAndOrg(
      headquarter_id,
      org_id
    );

    // Always return 200 (empty array if none found)
    return res.status(200).json(ministries || []);

  } catch (err) {
    console.error("Fetch ministries by HQ & Org error:", err);
    return res.status(500).json({
      message: "Failed to fetch ministries"
    });
  }
},

async getAttendanceRecByHQ(req, res) {
  try {
    const { headquarter_id } = req.params;

    const attendanceRec = await HeadquartersModel.getAttendanceRecByHQ(headquarter_id);

    return res.status(200).json(attendanceRec || []);
  } catch (err) {
    console.error("Fetch records by HQ error:", err);
    res.status(500).json({ message: "Failed to fetch records" });
  }
},

async getDonationsByHQ(req, res) {
  try {
    const { headquarter_id } = req.params;

    const donations = await HeadquartersModel.getDonationsByHQ(headquarter_id);

    return res.status(200).json(donations || []);
  } catch (err) {
    console.error("Fetch donations by HQ error:", err);
    res.status(500).json({ message: "Failed to fetch donations" });
  }
},

async getConvertsByHQ(req, res) {
  try {
    const { headquarter_id } = req.params;

    const converts = await HeadquartersModel.getConvertsByHQ(headquarter_id);

    return res.status(200).json(converts || []);
  } catch (err) {
    console.error("Fetch converts by HQ error:", err);
    res.status(500).json({ message: "Failed to fetch converts" });
  }
},

async getDonationsByHQAndOrg(req, res) {
  try {
    const { headquarter_id, org_id } = req.params;

    const donations = await HeadquartersModel.getDonationsByHQAndOrg(
      headquarter_id,
      org_id
    );

    return res.status(200).json(donations || []);
  } catch (err) {
    console.error("Fetch donations by HQ & Org error:", err);
    res.status(500).json({ message: "Failed to fetch donations" });
  }
},

async getConvertsByOrganization(req, res) {
  try {
    const { org_id } = req.params;

    const converts = await HeadquartersModel.getConvertsByOrganization(org_id);

    return res.status(200).json(converts || []);
  } catch (err) {
    console.error("Fetch converts by organization error:", err);
    res.status(500).json({ message: "Failed to fetch converts" });
  }
},

async getVisitorsByHQId(req, res) {
  try {
    const { hq_id } = req.params;

    const visitors = await HeadquartersModel.getVisitorsByHQId(hq_id);

    return res.status(200).json(visitors || []);
  } catch (err) {
    console.error("Fetch visitors by organization error:", err);
    res.status(500).json({ message: "Failed to fetch visitors" });
  }
},

async getConvertsByHQAndOrg(req, res) {
  try {
    const { hq_id, org_id } = req.params;

    const converts = await ConvertsModel.getConvertsByHQAndOrg(hq_id, org_id);

    return res.status(200).json(converts || []);
  } catch (err) {
    console.error("Fetch converts by HQ & org error:", err);
    res.status(500).json({ message: "Failed to fetch converts" });
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
