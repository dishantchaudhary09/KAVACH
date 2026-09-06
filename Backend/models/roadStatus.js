import mongoose from "mongoose";

const roadStatusSchema = new mongoose.Schema(
  {
    roadName: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },
    status: {
      type: String,
      enum: ["open", "blocked", "damaged", "under_maintenance"],
      required: true,
      default: "open",
    },
    reason: {
      type: String,
      trim: true,
      default: null,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
    {
        timestamps: true
    },
);

const roadStatus = mongoose.model("roadStatus", roadStatusSchema);
export default roadStatus
