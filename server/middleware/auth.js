// middleware/verifyAnyJWT.js

import jwt from "jsonwebtoken";
import UserModel from "../modules/user/user.model.js";
import OrganizationModel from "../modules/organization/organizationModel.js";

export const verifyJWT = async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ")
    ? header.split(" ")[1]
    : null;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded)

    if (decoded.type === "user") {
      const user = await UserModel.getById(decoded.sub);
      console.log(user)
      if (!user) throw new Error("Invalid user token");

      req.auth = {
        type: "user",
        user_id: user.id,
        organization_id: user.organization_id,
        role: user.role,
      };
    }

    if (decoded.type === "organization") {
      const org = await OrganizationModel.getById(decoded.sub);
      if (!org) throw new Error("Invalid org token");

      req.auth = {
        type: "organization",
        organization_id: org.id,
      };
    }

    next();

  } catch (err) {
    console.error("JWT Error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
