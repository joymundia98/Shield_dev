import Organization from "./organizationModel.js";

export const OrganizationController = {
  // CREATE ORGANIZATION
  async create (req, res) {
  try {
    const headquarters_id = req.auth.headquarters_id; // 🔐 from HQ token
    const { name, org_type_id, password, ...rest } = req.body;

    if (!name)
      return res.status(400).json({ message: "Organization name is required" });

    if (!org_type_id)
      return res.status(400).json({ message: "Organization type is required" });

    if (!password)
      return res.status(400).json({ message: "Password is required" });

    const org = await Organization.create({
      ...rest,
      name,
      org_type_id,
      password,
      headquarters_id, // ✅ force linkage to HQ
    });

    const { password: _, ...orgData } = org;

    res.status(201).json({
      message: "Organization created under headquarters",
      organization: orgData,
    });

  } catch (err) {
    console.error("Organization create error:", err);
    res.status(500).json({ message: "Server error" });
  }
},

  // GET BY ID
  async getById(req, res) {
    try {
      const org = await Organization.getById(req.params.id);

      if (!org) {
        return res.status(404).json({ message: "Organization not found" });
      }

      const { password: _, ...orgData } = org;
      res.json(orgData);

    } catch (err) {
      console.error("Get org error:", err);
      res.status(500).json({ message: "Server error" });
    }
  },

  // LIST ALL (protected)
  async list(req, res) {
    try {
      const organizations = await Organization.getAll();
      const orgs = organizations.map(({ password, ...rest }) => rest);
      res.json(orgs);

    } catch (err) {
      console.error("List org error:", err);
      res.status(500).json({ message: "Server error" });
    }
  },

  // LIST PUBLIC (for registration dropdown)
  async listPublic(req, res) {
    try {
      const organizations = await Organization.getAll();
      const publicOrgs = organizations.map(org => ({ id: org.id, name: org.name }));
      res.json(publicOrgs);
    } catch (err) {
      console.error("List public org error:", err);
      res.status(500).json({ message: "Server error" });
    }
  },

  // UPDATE
  async update(req, res) {
    try {
      const org = await Organization.update(req.params.id, req.body);

      if (!org) {
        return res.status(404).json({ message: "Organization not found" });
      }

      const { password: _, ...orgData } = org;
      res.json(orgData);

    } catch (err) {
      console.error("Update org error:", err);
      res.status(500).json({ message: "Server error" });
    }
  },

  // DELETE
  async delete(req, res) {
    try {
      const deleted = await Organization.delete(req.params.id);

      if (!deleted) {
        return res.status(404).json({ message: "Organization not found" });
      }

      res.json({ message: "Organization deleted", deleted });

    } catch (err) {
      console.error("Delete org error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
};
