// controllers/userController.js
import User from './user.model.js';

const userController = {
  async getAll(req, res) {
    try {
      const organization_id = req.auth.organization_id;
      const users = await User.getAllByOrg(organization_id);
      res.json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  },

  async getById(req, res) {
    try {
      const organization_id = req.auth.organization_id;
      const { id } = req.params;
      const user = await User.getById(id,organization_id);
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  },

  async getActiveUsers(req, res) {
    try {
      const {organization_id} = req.auth.organization_id;
      const users = await User.getActiveUsers(organization_id);
      res.json({ message: "Active users fetched", data: users });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch active users" });
    }
  },

  async getInactiveUsers(req, res) {
    try {
      const {organization_id} = req.auth.organization_id;
      const users = await User.getInactiveUsers(organization_id);
      res.json({ message: "Inactive users fetched", data: users });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch inactive users" });
    }
  },

  async create(req, res) {
    try {
      const {organization_id}= req.auth.organization_id;
      const user = await User.create({
        ...req.body,
        organization_id,
      });
      res.status(201).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create user' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const user = await User.update(id, req.body);
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update user' });
    }
  },

  // Add this function in userController.js
async updateStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const organization_id = req.auth.organization_id;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const user = await User.updateStatus(id, organization_id);

    // If the user doesn't exist or the update failed
    if (!user) {
      return res.status(404).json({ error: 'User not found or status update failed' });
    }

    // Return the updated user object
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update user status' });
  }
},


  async delete(req, res) {
    try {
      const { id } = req.params;
      const user = await User.delete(id);
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json({ message: 'User deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete user' });
    }
  },
};

export default userController;
