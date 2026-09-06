import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/user.js";

dotenv.config();

const createSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const existingAdmin = await User.findOne({
      role: "superadmin",
    });

    if (existingAdmin) {
      console.log("Super Admin already exists.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("SuperAdmin@123", 10);

    const admin = await User.create({
      name: "System Super Administrator",
      email: "superadmin@gmail.com",
      password: hashedPassword,
      role: "superadmin",
    });

    console.log("================================");
    console.log("SUPER ADMIN CREATED");
    console.log("Email:", admin.email);
    console.log("Role:", admin.role);
    console.log("================================");

    process.exit(0);
  } catch (error) {
    console.error("Error creating Super Admin:", error);
    process.exit(1);
  }
};

createSuperAdmin();
