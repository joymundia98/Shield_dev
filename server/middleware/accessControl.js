export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    const userRoles = req.user?.roles || [];

    const hasRole = userRoles.some((role) =>
      allowedRoles.includes(role)
    );

    if (!hasRole)
      return res.status(403).json({ message: "Access denied: insufficient role" });

    next();
  };
};

export const requirePermission = (...allowedPermissions) => {
  return (req, res, next) => {
    const userPermissions = req.user?.permissions || [];

    const hasPermission = userPermissions.some((perm) =>
      allowedPermissions.includes(perm)
    );

    if (!hasPermission)
      return res.status(403).json({ message: "Access denied: insufficient permissions" });

    next();
  };
};
