import Alert from "../models/Alert.js";
import mongoose from "mongoose";
// ===============================
// CREATE ALERT
// ===============================
export const createAlert = async (req, res) => {
  try {
    const {
      title,
      message,
      alertType,
      severity,
      location,
      latitude,
      longitude,
      expiresAt,
    } = req.body;

    // Basic validation
    if (!title?.trim() || !message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title and message are required",
      });
    }

    // Get logged-in user ID
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User session is invalid",
      });
    }

    // Validate expiry date if provided
    if (expiresAt) {
      const expiryDate = new Date(expiresAt);

      if (Number.isNaN(expiryDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid expiry date",
        });
      }

      if (expiryDate <= new Date()) {
        return res.status(400).json({
          success: false,
          message: "Expiry date must be in the future",
        });
      }
    }

    // Validate coordinates if provided
    if (
      latitude !== undefined &&
      latitude !== null &&
      (latitude < -90 || latitude > 90)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid latitude",
      });
    }

    if (
      longitude !== undefined &&
      longitude !== null &&
      (longitude < -180 || longitude > 180)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid longitude",
      });
    }

    const alert = await Alert.create({
      title: title.trim(),
      message: message.trim(),
      alertType: alertType || "general",
      severity: severity || "medium",
      location: location?.trim() || "",
      latitude:
        latitude !== undefined && latitude !== null ? Number(latitude) : null,
      longitude:
        longitude !== undefined && longitude !== null
          ? Number(longitude)
          : null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      status: "active",
      createdBy: userId,
    });

    const populatedAlert = await Alert.findById(alert._id).populate(
      "createdBy",
      "name email",
    );

    return res.status(201).json({
      success: true,
      message: "Alert created successfully",
      alert: populatedAlert,
    });
  } catch (error) {
    console.error("CREATE ALERT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create alert",
      error: error.message,
    });
  }
};

// ===============================
// GET ALL ALERTS
// ===============================
export const getAlerts = async (req, res) => {
  try {
    // Mark expired alerts before returning data
    await Alert.updateMany(
      {
        status: "active",
        expiresAt: {
          $ne: null,
          $lte: new Date(),
        },
      },
      {
        $set: {
          status: "expired",
        },
      },
    );

    const alerts = await Alert.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: alerts.length,
      alerts,
    });
  } catch (error) {
    console.error("GET ALERTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch alerts",
    });
  }
};

// ===============================
// GET ACTIVE ALERTS
// ===============================
export const getActiveAlerts = async (req, res) => {
  try {
    const now = new Date();

    // Automatically expire old alerts
    await Alert.updateMany(
      {
        status: "active",
        expiresAt: {
          $ne: null,
          $lte: now,
        },
      },
      {
        $set: {
          status: "expired",
        },
      },
    );

    const alerts = await Alert.find({
      status: "active",
      $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
    })
      .populate("createdBy", "name email")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: alerts.length,
      alerts,
    });
  } catch (error) {
    console.error("GET ACTIVE ALERTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch active alerts",
    });
  }
};

// ===============================
// GET SINGLE ALERT
// ===============================
export const getAlertById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid alert ID",
      });
    }

    const alert = await Alert.findById(id).populate("createdBy", "name email");

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found",
      });
    }

    // If alert has expired, return it as expired
    if (
      alert.status === "active" &&
      alert.expiresAt &&
      alert.expiresAt <= new Date()
    ) {
      alert.status = "expired";
      await alert.save();
    }

    return res.status(200).json({
      success: true,
      alert,
    });
  } catch (error) {
    console.error("GET ALERT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch alert",
    });
  }
};

// ===============================
// UPDATE ALERT
// ===============================
export const updateAlert = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      message,
      alertType,
      severity,
      location,
      latitude,
      longitude,
      status,
      expiresAt,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid alert ID",
      });
    }

    // Validate expiry
    if (expiresAt) {
      const expiryDate = new Date(expiresAt);

      if (Number.isNaN(expiryDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid expiry date",
        });
      }
    }

    // Validate coordinates
    if (
      latitude !== undefined &&
      latitude !== null &&
      (latitude < -90 || latitude > 90)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid latitude",
      });
    }

    if (
      longitude !== undefined &&
      longitude !== null &&
      (longitude < -180 || longitude > 180)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid longitude",
      });
    }

    const updateData = {};

    if (title !== undefined) updateData.title = title.trim();
    if (message !== undefined) updateData.message = message.trim();
    if (alertType !== undefined) updateData.alertType = alertType;
    if (severity !== undefined) updateData.severity = severity;
    if (location !== undefined) updateData.location = location.trim();
    if (latitude !== undefined) updateData.latitude = latitude;
    if (longitude !== undefined) updateData.longitude = longitude;
    if (status !== undefined) updateData.status = status;

    if (expiresAt !== undefined) {
      updateData.expiresAt = expiresAt ? new Date(expiresAt) : null;
    }

    const alert = await Alert.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("createdBy", "name email");

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Alert updated successfully",
      alert,
    });
  } catch (error) {
    console.error("UPDATE ALERT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update alert",
      error: error.message,
    });
  }
};

// ===============================
// DELETE ALERT
// ===============================
export const deleteAlert = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid alert ID",
      });
    }

    const alert = await Alert.findById(id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found",
      });
    }

    await alert.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Alert deleted successfully",
    });
  } catch (error) {
    console.error("DELETE ALERT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete alert",
    });
  }
};
