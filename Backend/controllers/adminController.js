import bcrypt from "bcryptjs";
import User from "../models/user.js";

// =============================
// ADD ADMINISTRATOR
// =============================

export const addAdministrator = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "administrator",
    });

    res.status(201).json({
      message: "Administrator created successfully",

      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create administrator",
    });
  }
};

// =============================
// GET ALL ADMINISTRATORS
// =============================

export const getAdministrators = async (req, res) => {
  try {
    const admins = await User.find({
      role: {
        $in: ["administrator", "superadmin"],
      },
    }).select("-password");

    res.status(200).json(admins);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch administrators",
    });
  }
};

// =============================
// DELETE ADMINISTRATOR
// =============================

export const deleteAdministrator = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await User.findById(id);

    if (!admin) {
      return res.status(404).json({
        message: "Administrator not found",
      });
    }

    // Super Admin ko delete nahi kar sakte
    if (admin.role === "superadmin") {
      return res.status(403).json({
        message: "Super Admin cannot be deleted",
      });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      message: "Administrator removed successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to remove administrator",
    });
  }
};
