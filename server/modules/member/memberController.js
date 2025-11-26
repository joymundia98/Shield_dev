import Member from "../member/memberModel.js";

export const MemberController = {

  // --------------------------------
  // CREATE MEMBER
  // --------------------------------
  async create(req, res) {
    try {
      const {
        first_name,
        last_name,
        email,
        phone,
        gender,
        date_of_birth,
        membership_status,
        address
      } = req.body;

      // organization_id + created_by user_id come from JWT
      const organization_id = req.user.organization_id;
      const user_id = req.user.id; 

      // Validate required fields
      if (!first_name || !last_name || !email) {
        return res.status(400).json({
          message: "first_name, last_name, and email are required"
        });
      }

      const newMember = await Member.create({
        first_name,
        last_name,
        email,
        phone,
        gender,
        date_of_birth,
        organization_id,  // from JWT
        user_id,          // from JWT
        membership_status,
        address
      });

      return res.status(201).json({
        message: "Member created successfully",
        member: newMember
      });

    } catch (error) {
      console.error("Create Member Error:", error);
      return res.status(500).json({ 
        message: "Server error creating member" 
      });
    }
  },

  // --------------------------------
  // GET MEMBER BY ID
  // --------------------------------
  async getById(req, res) {
    try {
      const { id } = req.params;
      const member = await Member.getById(id);

      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }

      res.json(member);

    } catch (err) {
      console.error("Error fetching member:", err);
      res.status(500).json({ message: "Server error" });
    }
  },

  // --------------------------------
  // GET MEMBER BY EMAIL
  // --------------------------------
  async getByEmail(req, res) {
    try {
      const { email } = req.params;

      const member = await Member.findByEmail(email);
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }

      res.json(member);

    } catch (err) {
      console.error("Error finding member by email:", err);
      res.status(500).json({ message: "Server error" });
    }
  },

  // --------------------------------
  // LIST ALL MEMBERS OR BY ORG
  // --------------------------------
  async list(req, res) {
    try {
      const { organization_id } = req.query;

      const members = organization_id
        ? await Member.findByOrganization(organization_id)
        : await Member.getAll();

      res.json(members);

    } catch (err) {
      console.error("Error listing members:", err);
      res.status(500).json({ message: "Server error" });
    }
  },

  // --------------------------------
  // UPDATE MEMBER
  // --------------------------------
  async update(req, res) {
    try {
      const { id } = req.params;

      const member = await Member.getById(id);
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }

      const updated = await Member.update(id, req.body);
      res.json(updated);

    } catch (err) {
      console.error("Error updating member:", err);
      res.status(500).json({ message: "Server error" });
    }
  },

  // --------------------------------
  // DELETE MEMBER
  // --------------------------------
  async delete(req, res) {
    try {
      const { id } = req.params;

      const deleted = await Member.delete(id);
      if (!deleted) {
        return res.status(404).json({ message: "Member not found" });
      }

      res.json({ message: "Member deleted successfully", deleted });

    } catch (err) {
      console.error("Delete member error:", err);
      res.status(500).json({ message: "Server error" });
    }
  },

};

export default MemberController;