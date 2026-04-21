import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PlatformAdmin } from "./platform.js";

export const registerPlatformAdmin = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await PlatformAdmin.findByEmail(email);
    if (existing)
      return res.status(409).json({ message: "Email already exists" });

    const hash = await bcrypt.hash(password, 10);

    const admin = await PlatformAdmin.create({
      ...req.body,
      password: hash,
    });

    res.status(201).json(admin);
  } catch (err) {
    console.error("Create platform admin error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginPlatformAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await PlatformAdmin.findByEmail(email);
    if (!admin)
      return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      {
        sub: admin.id,
        type: "platform_admin",
        is_super_admin: admin.is_super_admin,
        organization_id: admin.organization_id,
        role_id: role.id,
        role: role.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "72h" }
    );

    res.json({
      accessToken: token,
      admin: {
        id: admin.id,
        email: admin.email,
        role_id: role.id,
        role: role.name,
      }
    });
  } catch (err) {
    console.error("Login platform admin error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPlatformAdmins = async (req, res) => {
  try {
    const admins = await PlatformAdmin.getAll();
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: "Error fetching admins" });
  }
};

export const getPlatformAdminById = async (req, res) => {
  try {
    const admin = await PlatformAdmin.getById(req.params.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: "Error fetching admin" });
  }
};

export const updatePlatformAdmin = async (req, res) => {
  try {
    const updated = await PlatformAdmin.update(req.params.id, req.body);
    if (!updated)
      return res.status(404).json({ message: "Admin not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating admin" });
  }
};

export const deletePlatformAdmin = async (req, res) => {
  try {
    const deleted = await PlatformAdmin.delete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Admin not found" });
    res.json({ message: "Deleted successfully", deleted });
  } catch (err) {
    res.status(500).json({ message: "Error deleting admin" });
  }
};