export const verifyJWT = async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Correct: sub is the user ID
    const user = await UserModel.getById(decoded.sub);
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Fetch roles & permissions
    const roles = await UserModel.getUserRoles(user.id);
    const permissions = await UserModel.getUserPermissions(user.id);

    req.user = {
      id: user.id,
      email: user.email,
      roles,
      permissions,
      organization_id: user.organization_id
    };

    next();

  } catch (err) {
    console.error("JWT Error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
