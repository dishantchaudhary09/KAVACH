import mongoose from "mongoose";

const riskZoneSchema = new mongoose.Schema(
  {
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

    // Name of the monitored area
    locationName: {
      type: String,
      required: true,
      trim: true,
    },

    // State / region
    state: {
      type: String,
      trim: true,
    },

    // ML predicted risk level
    riskLevel: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      required: true,
    },

    // ML risk score: 0 - 100
    riskScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    // Why this area received this risk
    reason: {
      type: String,
      required: true,
      trim: true,
    },

    // Last automatic prediction time
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

const RiskZone = mongoose.model("RiskZone", riskZoneSchema);

export default RiskZone;
