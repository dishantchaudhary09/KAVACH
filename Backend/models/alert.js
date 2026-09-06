import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Alert title is required"],
      trim: true,
      maxlength: 150,
    },

    message: {
      type: String,
      required: [true, "Alert message is required"],
      trim: true,
      maxlength: 1000,
    },

    alertType: {
      type: String,
      enum: ["landslide", "flood", "road", "weather", "emergency", "general"],
      default: "general",
    },

    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },

    location: {
      type: String,
      trim: true,
      default: "",
    },

    latitude: {
      type: Number,
      default: null,
    },

    longitude: {
      type: Number,
      default: null,
    },

    status: {
      type: String,
      enum: ["active", "expired"],
      default: "active",
    },

    expiresAt: {
      type: Date,
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Automatically mark expired alerts when fetching
alertSchema.index({ status: 1, expiresAt: 1 });
alertSchema.index({ createdAt: -1 });

const Alert = mongoose.model("Alert", alertSchema);

export default Alert;
