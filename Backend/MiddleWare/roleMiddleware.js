const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const userRole = String(req.user.role || "").toLowerCase();
    const normalizedAllowedRoles = allowedRoles.map((role) =>
      String(role).toLowerCase(),
    );

    const adminAliases = new Set(["admin", "administrator"]);

    if (userRole === "superadmin") {
      // superadmin can access admin-only routes too
      return next();
    }

    if (
      adminAliases.has(userRole) &&
      normalizedAllowedRoles.some(
        (role) => adminAliases.has(role) || role === "admin",
      )
    ) {
      return next();
    }

    if (!normalizedAllowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    next();
  };
};

export default roleMiddleware;
