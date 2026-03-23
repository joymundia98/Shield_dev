import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
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

    // if (!role) {
    //   return res.status(400).json({
    //     message: "User has no role assigned. Contact admin."
    //   });
    // }

    const payload = {
      sub: user.id,
      type: "user",
      email: user.email,
      status: user.status,
      headquarter_id: user.headquarter_id,
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
        status: user.status,
        organization_id: user.organization_id,
        headquarter_id: user.headquarter_id,
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

    const org = await OrganizationModel.login({
      organization_account_id,
      password,
    });

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
      org_type_id: org.org_type_id,
      headquarters_id: org.headquarters_id,
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

        // FK IDs
        org_type_id: org.org_type_id,
        headquarters_id: org.headquarters_id,

        // Joined readable names
        org_type_name: org.org_type_name,
        headquarters_name: org.headquarters_name,
      },
    });

  } catch (err) {
    console.error("Organization login error:", err);
    return res.status(500).json({
      message: "Server error",
    });
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
      headquarter_id,
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

    const status = position === "System Administrator" || position === "Admin" ? "active" : "pending";

    const newUser = await UserModel.create({
      first_name,
      last_name,
      email,
      password: passwordHash,
      phone,
      position,
      role_id: role_id,
      organization_id,
      headquarter_id,
      status,
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

export const registerUser = async (req, res) => {
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
      headquarter_id,
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

    let status = "active";

    const newUser = await UserModel.create({
      first_name,
      last_name,
      email,
      password: passwordHash,
      phone,
      position,
      role_id: role_id,
      organization_id,
      headquarter_id,
      status,
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
      const loginUrl = "https://sci-eld.org/org-login";

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
Log in here: ${loginUrl}`
      });
    } catch (emailErr) {
      console.error("Failed to send organization registration email:", emailErr);
      // Do NOT fail registration if email fails
    }

    return res.status(201).json({
      message: "Organization registered successfully",
      organization: org,
    });

  } catch (err) {
    console.error("Organization Register Error:", err);

    // ✅ Handle duplicate key (unique constraint)
    if (err.code === "23505") {
      // Optional: detect which field caused it
      if (err.detail?.includes("organization_email")) {
        return res.status(409).json({
          message: "Organization email already exists",
        });
      }

      if (err.detail?.includes("organization_account_id")) {
        return res.status(409).json({
          message: "Organization account ID already exists",
        });
      }

      return res.status(409).json({
        message: "Duplicate value detected",
      });
    }

    return res.status(500).json({ message: "Server error" });
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

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

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

    // ==========================
    // SEND WELCOME EMAIL
    // ==========================
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
      // Do not fail registration if email fails
    }

    return res.status(201).json({
      message: "Headquarters registered successfully",
      headquarters: hq,
    });

  } catch (err) {
    console.error("Headquarters Register Error:", err);

    // ✅ Handle PostgreSQL unique constraint violation
    if (err.code === "23505") {

      if (err.detail?.includes("email")) {
        return res.status(409).json({
          message: "Email already exists",
        });
      }

      if (err.detail?.includes("code")) {
        return res.status(409).json({
          message: "Headquarters code already exists",
        });
      }

      if (err.detail?.includes("headquarters_account_id")) {
        return res.status(409).json({
          message: "Headquarters account ID already exists",
        });
      }

      return res.status(409).json({
        message: "Duplicate value detected",
      });
    }

    return res.status(500).json({
      message: "Server error",
    });
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

// ========================================
// FORGOT PASSWORD
// ========================================
const getFrontendUrl = () => {
  return process.env.NODE_ENV === "production"
    ? "https://sci-eld.org"
    : "http://localhost:5173";
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await UserModel.findByEmail(email);

    // 🔐 Always return same response (prevent email enumeration)
    if (!user) {
      return res.json({
        message: "If the email exists, a reset link has been sent",
      });
    }

    // ✅ Generate raw token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // ✅ Hash token before saving (never store raw token)
    const hashedToken = await bcrypt.hash(resetToken, 10);

    // ⏳ Expiry (15 minutes)
    const expiry = new Date(Date.now() + 15 * 60 * 1000);

    await UserModel.saveResetToken(user.id, hashedToken, expiry);

    // ✅ Build reset link (NO user id)
    const resetLink = `${getFrontendUrl()}/reset-password?token=${resetToken}`;

    // 📧 Send email
    await SendEmail({
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial; max-width: 600px; margin: auto;">
          <h2>Password Reset</h2>
          <p>You requested to reset your password.</p>

          <a href="${resetLink}" style="
            display:inline-block;
            padding:12px 20px;
            background:#2563eb;
            color:#fff;
            text-decoration:none;
            border-radius:6px;
            margin-top:10px;
          ">
            Reset Password
          </a>

          <p style="margin-top:20px;">This link expires in 15 minutes.</p>
          <p>If you didn’t request this, ignore this email.</p>
        </div>
      `,
    });

    return res.json({
      message: "If the email exists, a reset link has been sent",
    });

  } catch (err) {
    console.error("Forgot Password Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


// ========================================
// RESET PASSWORD
// ========================================
export const resetPassword = async (req, res) => {
  try {
    const { token, userId, newPassword } = req.body;

    if (!token || !userId || !newPassword) {
      return res.status(400).json({
        message: "Token, userId, and new password are required",
      });
    }

    const user = await UserModel.getById(userId);

    if (!user || !user.reset_token) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    // Compare token
    const isValid = await bcrypt.compare(token, user.reset_token);

    if (!isValid) {
      return res.status(400).json({
        message: "Invalid token",
      });
    }

    // Check expiry
    if (new Date() > user.reset_token_expiry) {
      return res.status(400).json({
        message: "Token has expired",
      });
    }

    // Hash new password
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await UserModel.updatePassword(userId, hashedPassword);

    // Clear reset token
    await UserModel.clearResetToken(userId);

    res.json({
      message: "Password reset successful",
    });

  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};