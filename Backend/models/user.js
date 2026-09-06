import mongoose, { Schema } from "mongoose";

const userRegisterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["citizen", "admin", "administrator", "superadmin"],
    default: "citizen",
  },
});
const User = mongoose.model("User", userRegisterSchema);
export default User;
