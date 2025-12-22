import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import UserModel from "../user/user.model.js";
import OrganizationModel from "../organization/organizationModel.js";

dotenv.config();

// ========================================
// LOGIN
// ========================================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await UserModel.findByEmail(email);
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ message: "Invalid email or password" });

    const role = await UserModel.getRoleNameById(user.role_id);
    
    // const permissions = await UserModel.getUserPermissions(user.id);

    const payload = {
      sub: user.id,
      email: user.email,
      organization: user.organization_id,
      role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      message: "Login successful",
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        organization: user.organization_id,
        role: role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================================
// REGISTER – USER
// ========================================
export const register = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      phone,
      position,
      role_id,
      organization_id,
    } = req.body;

    // Validate required fields
    if (!first_name || !last_name || !email || !password || !role_id)
      return res
        .status(400)
        .json({ message: "first_name, last_name, email, password, role_id required" });

    // Check if email exists
    const existing = await UserModel.findByEmail(email);
    if (existing)
      return res.status(409).json({ message: "Email already in use" });

    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create the user with status set to "inactive"
    const newUser = await UserModel.create({
      first_name,
      last_name,
      email,
      password: passwordHash,
      phone,
      position,
      role_id,
      organization_id,
      status: "inactive", // Set status explicitly to "inactive"
    });

    // Assign role to the user (if necessary)
    await UserModel.assignRole(newUser.id, role_id);

    // Return success response
    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });

  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================================
// REGISTER ORG– MATCHES USER MODEL FIELDS
// ========================================
export const createOrg = async (req, res) => {
  try {
    // 3️⃣ Get fields from request body
    const {
      name,
      denomination,
      address,
      region,
      district,
      status
    } = req.body;

    if (!name)
      return res.status(400).json({ message: "Organization name is required" });

    // 4️⃣ Create organization in DB
    const org = await OrganizationModel.create({
      name,
      denomination,
      address,
      region,
      district,
      status
    });

    return res.status(201).json({
      message: "Organization registered successfully",
      organization: org,
    });

  } catch (err) {
    console.error("Organization Register Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
