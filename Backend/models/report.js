import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    reportType: {
      type: String,
      enum: ["landslide", "flood", "road_blockage", "slop_failure", "other"],
      required: true,
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

    image: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "verified", "rejected", "resolved"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

const Report = mongoose.model("Report", reportSchema);

export default Report;
