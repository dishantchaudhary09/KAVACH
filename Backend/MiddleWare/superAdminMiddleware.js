export const superAdminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  if (req.user.role !== "superadmin") {
    return res.status(403).json({
      message: "Only Super Admin can perform this action",
    });
  }

  next();
};
