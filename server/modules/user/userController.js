import User from './user.model.js';

const userController = {
  // Fetch all users for a specific organization
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

  // Fetch a specific user by ID
  async getById(req, res) {
    try {
      const organization_id = req.auth.organization_id;
      const { id } = req.params;
      const user = await User.getById(id, organization_id);
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  },

  // Fetch active users in the organization
  async getActiveUsers(req, res) {
    try {
      const { organization_id } = req.auth;
      const users = await User.getActiveUsers(organization_id);
      res.json({ message: 'Active users fetched', data: users });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch active users' });
    }
  },

  // Fetch inactive users in the organization
  async getInactiveUsers(req, res) {
    try {
      const { organization_id } = req.auth;
      const users = await User.getInactiveUsers(organization_id);
      res.json({ message: 'Inactive users fetched', data: users });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch inactive users' });
    }
  },

  // Create a new user in the organization
async create(req, res) {
  try {
    const organization_id = req.auth.organization_id;

    // 🔒 Determine status based on creator role
    const status = req.auth.role_id === 1 || req.auth.role_id === 98 ? "active" : "pending";

    // ✅ Whitelist only allowed fields from body
    const {
      first_name,
      last_name,
      email,
      password,
      phone,
      position,
      photo_url,
      role_id
    } = req.body;

    // ✅ Generate random password if not provided
    const plainPassword = password || crypto.randomBytes(8).toString("base64").slice(0, 12);

    // ✅ Hash password
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
    const passwordHash = await bcrypt.hash(plainPassword, saltRounds);

    // ✅ Insert into DB
    const user = await User.create({
      first_name,
      last_name,
      email,
      password: passwordHash,
      phone,
      position,
      photo_url,
      role_id,
      organization_id,
      status
    });

    // Optional: return plain password for sending in email
    user.plainPassword = plainPassword;

    res.status(201).json(user);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create user" });
  }
},

  // Update user details (first_name, last_name, email, etc.)
  async update(req, res) {
    try {
      const { id } = req.params;
      const organization_id = req.auth.organization_id;
      const user = await User.update(id, organization_id, req.body);
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update user' });
    }
  },

  // Update user status (active/inactive)
  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const organization_id = req.auth.organization_id;

      if (!status) {
        return res.status(400).json({ error: 'Status is required' });
      }

      const user = await User.updateStatus(status, id, organization_id);

      if (!user) {
        return res.status(404).json({ error: 'User not found or status update failed' });
      }

      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update user status' });
    }
  },

  // Update only the user's role (role_id)
  async updateRole(req, res) {
    try {
      const { id } = req.params;
      const { role_id } = req.body;
      const organization_id = req.auth.organization_id;

      if (!role_id) {
        return res.status(400).json({ error: 'Role ID is required' });
      }

      // Check if the new role_id exists
      const role = await User.getRoleNameById(role_id);
      if (!role) {
        return res.status(400).json({ error: 'Invalid role ID' });
      }

      const user = await User.updateRole(id, role_id, organization_id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update user role' });
    }
  },

  // Delete a user
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
