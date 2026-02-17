import jwt from "jsonwebtoken";
import UserModel from "../modules/user/user.model.js";
import OrganizationModel from "../modules/organization/organizationModel.js";

export const verifyJWT = async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    if (decoded.type === "user") {
      const user = await UserModel.getById(decoded.sub);
      if (!user) throw new Error("Invalid user token");

      req.auth = {
        type: "user",
        user_id: user.id,
        organization_id: user.organization_id,
        headquarter_id: user.headquarter_id,
        role: user.role,
        role_id: user.role_id,
      };
    } else if (decoded.type === "organization") {
      const org = await OrganizationModel.getById(decoded.sub);
      if (!org) throw new Error("Invalid org token");

      req.auth = {
        type: "organization",
        organization_id: org.id,
      };
    } else if (decoded.type === "headquarters") {
      // ✅ Add HQ support
      req.auth = {
        type: "headquarters",
        headquarters_id: decoded.headquarters_id,
        name: decoded.name,
      };
    } else {
      throw new Error("Unknown token type");
    }

    next();
  } catch (err) {
    console.error("JWT Error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
