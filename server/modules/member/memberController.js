// controllers/memberController.js
import Member from "./memberModel.js";

const MemberController = {
  // GET /members
  async getAll(req, res) {
    try {
      const organization_id = req.auth.organization_id;
      const members = await Member.getAll(organization_id);
      res.status(200).json({ data: members });
    } catch (error) {
      console.error("Error fetching members:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // GET /members/:id
  async getById(req, res) {
    try {
      const { id } = req.params;
      const organization_id = req.auth.organization_id;

      const member = await Member.getById(id, organization_id);
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }

      res.status(200).json({ data: member });
    } catch (error) {
      console.error("Error fetching member:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // POST /members
  async create(req, res) {
    try {
      const organization_id = req.auth.organization_id;
      const memberData = { ...req.body, organization_id };

      if (!organization_id) {
        return res.status(400).json({ message: "organization_id is required" });
      }

      const newMember = await Member.create(memberData);
      res.status(201).json({ data: newMember });
    } catch (error) {
      console.error("Error creating member:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // PUT /members/:id
  async update(req, res) {
    try {
      const { id } = req.params;
      const organization_id = req.auth.organization_id;
      const updatedMember = await Member.update(id, organization_id, req.body);

      if (!updatedMember) {
        return res.status(404).json({ message: "Member not found" });
      }

      res.status(200).json({ data: updatedMember });
    } catch (error) {
      console.error("Error updating member:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // DELETE /members/:id
  async delete(req, res) {
    try {
      const { id } = req.params;
      const organization_id = req.auth.organization_id;

      const deletedMember = await Member.delete(id, organization_id);
      if (!deletedMember) {
        return res.status(404).json({ message: "Member not found" });
      }

      res.status(200).json({ message: "Member deleted successfully", data: deletedMember });
    } catch (error) {
      console.error("Error deleting member:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // GET /members/email/:email
  async findByEmail(req, res) {
    try {
      const { email } = req.params;
      const organization_id = req.auth.organization_id;

      const member = await Member.findByEmail(email, organization_id);
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }

      res.status(200).json({ data: member });
    } catch (error) {
      console.error("Error fetching member by email:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // GET /members/organization/:orgId
  async findByOrganization(req, res) {
    try {
      const { orgId } = req.params;
      const members = await Member.findByOrganization(orgId);
      res.status(200).json({ data: members });
    } catch (error) {
      console.error("Error fetching members by organization:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export default MemberController;
