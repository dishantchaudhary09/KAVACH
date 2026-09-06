// =====================================
// ADMIN ONLY MIDDLEWARE
// =====================================

export const adminOnly = (req, res, next) => {
  try {
    // User login/authenticated hai ya nahi
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // JWT se role lena
    const role = String(req.user.role || "")
      .trim()
      .toLowerCase();

    // Admin aur SuperAdmin ko permission
    if (role !== "admin" && role !== "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    next();
  } catch (error) {
    console.error("ADMIN MIDDLEWARE ERROR:", error);

    return res.status(403).json({
      success: false,
      message: "Admin authorization failed",
    });
  }
};

