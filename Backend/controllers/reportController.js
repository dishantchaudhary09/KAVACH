import Report from "../models/report.js";

// CREATE REPORT
export const createReport = async (req, res) => {
  try {
    const { title, description, reportType, latitude, longitude } = req.body;

    if (!title || !description || !reportType || !latitude || !longitude) {
      return res.status(400).json({
        message: "All required fields are required",
      });
    }

    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User session is invalid. Please log in again.",
      });
    }

    const report = await Report.create({
      user: userId,

      title,

      description,

      reportType,

      location: {
        latitude: Number(latitude),
        longitude: Number(longitude),
      },

      image: req.file ? `/uploads/reports/${req.file.filename}` : null,
    });

    res.status(201).json({
      success: true,

      message: "Report submitted successfully",

      report,
    });
  } catch (error) {
    console.error("CREATE REPORT ERROR:", error);

    res.status(500).json({
      message: "Failed to create report",
      error: error.message,
    });
  }
};

// GET MY REPORTS
export const getMyReports = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    const reports = await Report.find({
      user: userId,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      reports,
    });
  } catch (error) {
    console.error("GET MY REPORTS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch reports",
    });
  }
};

// GET ALL REPORTS
export const getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      reports,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch reports",
    });
  }
};

// GET SINGLE REPORT
export const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id).populate(
      "user",
      "name email",
    );

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch report",
    });
  }
};

// UPDATE STATUS
export const updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ["pending", "verified", "rejected", "resolved"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const report = await Report.findByIdAndUpdate(
      req.params.id,

      {
        status,
      },

      {
        new: true,
        runValidators: true,
      },
    );

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Report status updated",
      report,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update report status",
    });
  }
};

// DELETE REPORT
export const deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    await report.deleteOne();

    res.status(200).json({
      success: true,
      message: "Report deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete report",
    });
  }
};
