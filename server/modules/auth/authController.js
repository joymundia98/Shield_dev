import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import UserModel from "../user/user.model.js";
import OrganizationModel from "../organization/organizationModel.js";
import HeadquartersModel from "../head_quarters/hqModel.js";
import { SendEmail } from "../../utils/email.js"; // ✅ import your Resend utility

// ========================================
// LOGIN – USER
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

    // get the role
    const role = user.role_id
      ? await UserModel.getRoleNameById(user.role_id)
      : null;

    if (!role) {
      return res.status(400).json({
        message: "User has no role assigned. Contact admin."
      });
    }

    const payload = {
      sub: user.id,
      type: "user",
      email: user.email,
      organization_id: user.organization_id,
      role_id: role.id,
      role: role.name,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({
      message: "Login successful",
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        organization_id: user.organization_id,
        role_id: role.id,
        role: role.name,
      },
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ========================================
// LOGIN – ORGANIZATION
// ========================================
export const loginOrg = async (req, res) => {
  try {
    const { organization_account_id, password } = req.body;

    if (!organization_account_id || !password) {
      return res.status(400).json({
        message: "Organization account ID and password required",
      });
    }

    const org = await OrganizationModel.login({ organization_account_id, password });

    if (!org) {
      return res.status(401).json({
        message: "Invalid organization account ID or password",
      });
    }

    const payload = {
      sub: org.id,
      type: "organization",
      organization_id: org.id,
      name: org.name,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.json({
      message: "Organization login successful",
      accessToken: token,
      organization: {
        id: org.id,
        name: org.name,
        organization_account_id: org.organization_account_id,
        status: org.status,
      },
    });

  } catch (err) {
    console.error("Organization login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ========================================
// REGISTER – USER (with welcome email)
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

    if (!first_name || !last_name || !email)
      return res.status(400).json({
        message: "first_name, last_name, and email are required",
      });

    const existing = await UserModel.findByEmail(email);
    if (existing)
      return res.status(409).json({ message: "Email already in use" });

    // ✅ Generate password if not provided
    const plainPassword =
      password || crypto.randomBytes(8).toString("base64").slice(0, 12);

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
    const passwordHash = await bcrypt.hash(plainPassword, saltRounds);

    const newUser = await UserModel.create({
      first_name,
      last_name,
      email,
      password: passwordHash,
      phone,
      position,
      role_id,
      organization_id,
      status: "pending",
    });

    // ==========================
    // SEND WELCOME EMAIL
    // ==========================
    try {
      const loginUrl = "https://sci-eld.org/login";

      await SendEmail({
        to: newUser.email,
        subject: "Welcome to Your Organization",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto;">
            <h1>Welcome ${newUser.first_name}!</h1>
            <p>Your account has been created successfully.</p>
            <p><strong>Your temporary password:</strong> ${plainPassword}</p>
            <p>Please log in and change your password immediately.</p>

            <a href="${loginUrl}"
               style="
                 display: inline-block;
                 margin-top: 20px;
                 padding: 12px 24px;
                 background-color: #2563eb;
                 color: #ffffff;
                 text-decoration: none;
                 border-radius: 6px;
                 font-weight: bold;
               ">
              Login to Your Account
            </a>

            <hr style="margin: 30px 0;" />

            <p style="font-size: 12px; color: #777;">
              If you did not create this account, please ignore this email.
            </p>
          </div>
        `,
        text: `Welcome ${newUser.first_name}!

Your account has been created successfully.

Temporary password: ${plainPassword}

Please log in and change your password immediately:
${loginUrl}

If you did not create this account, please ignore this email.`,
      });
    } catch (error) {
      console.error("Error sending welcome email:", error);
    }

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
// REGISTER – ORGANIZATION
// ========================================
export const createOrg = async (req, res) => {
  try {
    const {
      name,
      denomination,
      address,
      region,
      district,
      status,
      organization_email,
      headquarters_id,
      password,
      org_type_id
    } = req.body;

    if (!name)
      return res.status(400).json({ message: "Organization name is required" });

    if (!org_type_id)
      return res.status(400).json({ message: "org_type_id is required" });

    const org = await OrganizationModel.create({
      name,
      denomination,
      address,
      region,
      district,
      status,
      organization_email,
      headquarters_id,
      password,
      org_type_id
    });

    // ==========================
    // SEND EMAIL TO ORGANIZATION
    // ==========================
try {
  const loginUrl = "https://sci-eld.org/org-login"; // replace with your real login URL

  await SendEmail({
    to: org.organization_email,
    subject: "Welcome to Our Platform",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto;">
        <h1>Welcome ${org.name}!</h1>
        <p>Your organization account has been created successfully.</p>
        <p>Your account ID: <strong>${org.organization_account_id}</strong></p>

        <p>Please click the button below to log in and manage your organization:</p>

        <a href="${loginUrl}"
           style="
             display: inline-block;
             margin-top: 20px;
             padding: 12px 24px;
             background-color: #16a34a;
             color: #ffffff;
             text-decoration: none;
             border-radius: 6px;
             font-weight: bold;
           ">
          Login to Your Dashboard
        </a>

        <hr style="margin: 30px 0;" />

        <p style="font-size: 12px; color: #777;">
          If you did not request this account, please contact support.
        </p>
      </div>
    `,
    text: `Welcome ${org.name}!

Your organization account has been created successfully.
Your account ID: ${org.organization_account_id}

Log in here: ${loginUrl}

If you did not request this account, please contact support.`,
  });
} catch (emailErr) {
  console.error("Failed to send organization registration email:", emailErr);
}


    return res.status(201).json({
      message: "Organization registered successfully",
      organization: org,
    });
  } catch (err) {
    console.error("Organization Register Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const headQuarterRegister = async (req, res) => {
  try {
    const {
      name,
      code,
      email,
      phone,
      region,
      country,
      status,
      password,
    } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Name, email, and password are required" });

    const hq = await HeadquartersModel.create({
      name,
      code,
      email,
      phone,
      region,
      country,
      status,
      password,
    });

    // Send welcome email
    try {
      const loginUrl = "https://sci-eld.org/hq-login";

      await SendEmail({
        to: hq.email,
        subject: "Welcome to Our Platform (Headquarters)",
        html: `
          <h1>Welcome ${hq.name}!</h1>
          <p>Your headquarters account has been created.</p>
          <p>Your account ID: <strong>${hq.headquarters_account_id}</strong></p>
          <a href="${loginUrl}">Login</a>
        `,
      });
    } catch (emailErr) {
      console.error("HQ email failed:", emailErr);
    }

    return res.status(201).json({
      message: "Headquarters registered successfully",
      headquarters: hq,
    });
  } catch (err) {
    console.error("Headquarters Register Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const headQuarterLogin = async (req, res) => {
  try {
    const { headquarters_account_id, password } = req.body;

    if (!headquarters_account_id || !password) {
      return res.status(400).json({
        message: "Headquarters account ID and password required",
      });
    }

    const hq = await HeadquartersModel.login({
      headquarters_account_id,
      password,
    });

    if (!hq) {
      return res.status(401).json({
        message: "Invalid headquarters account ID or password",
      });
    }

    const payload = {
      sub: hq.id,
      type: "headquarters",
      headquarters_id: hq.id,
      name: hq.name,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.json({
      message: "Headquarters login successful",
      accessToken: token,
      headquarters: {
        id: hq.id,
        name: hq.name,
        headquarters_account_id: hq.headquarters_account_id,
        status: hq.status,
      },
    });
  } catch (err) {
    console.error("Headquarters login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
