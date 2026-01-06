// controllers/memberController.js
import Member from "./memberModel.js";

export const MemberController = {
  // GET /members
  async getAll(req, res) {
    try {
      const members = await Member.getAll();
      res.status(200).json(members);
    } catch (error) {
      console.error("Error fetching members:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // GET /members/:id
  async getById(req, res) {
    const { id } = req.params;
    try {
      const member = await Member.getById(id);
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }
      res.status(200).json(member);
    } catch (error) {
      console.error("Error fetching member:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // POST /members
  async create(req, res) {
    try {
      const memberData = req.auth.organization_id;

      if (!memberData.organization_id) {
        return res
          .status(400)
          .json({ message: "organization_id is required" });
      }

      const newMember = await Member.create(memberData);
      res.status(201).json(newMember);
    } catch (error) {
      console.error("Error creating member:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // PUT /members/:id
  async update(req, res) {
    const { id } = req.params;
    try {
      const updatedMember = await Member.update(id, req.body);
      if (!updatedMember) {
        return res.status(404).json({ message: "Member not found" });
      }
      res.status(200).json(updatedMember);
    } catch (error) {
      console.error("Error updating member:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // DELETE /members/:id
  async delete(req, res) {
    const { id } = req.params;
    try {
      const deletedMember = await Member.delete(id);
      if (!deletedMember) {
        return res.status(404).json({ message: "Member not found" });
      }
      res.status(200).json({ message: "Member deleted successfully" });
    } catch (error) {
      console.error("Error deleting member:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // GET /members/email/:email
  async findByEmail(req, res) {
    const { email } = req.params;
    try {
      const member = await Member.findByEmail(email);
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }
      res.status(200).json(member);
    } catch (error) {
      console.error("Error fetching member by email:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // GET /members/organization/:orgId
  async findByOrganization(req, res) {
    const { orgId } = req.params;
    try {
      const members = await Member.findByOrganization(orgId);
      res.status(200).json(members);
    } catch (error) {
      console.error("Error fetching members by organization:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export default MemberController;
