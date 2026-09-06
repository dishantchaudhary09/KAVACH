import RoadStatus from "../models/roadStatus.js";


// CREATE ROAD STATUS


export const createRoadStatus = async (req, res) => {
  try {
    const { roadName, latitude, longitude, status, reason } = req.body;

    // Check required fields
    if (
      !roadName ||
      latitude === undefined ||
      longitude === undefined ||
      !status ||
      !reason
    ) {
      return res.status(400).json({
        success: false,
        message: "All road details are required",
      });
    }

    const road = await RoadStatus.create({
      roadName,

      location: {
        latitude,
        longitude,
      },

      status,
      reason,

      reportedBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Road status reported successfully",
      road,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// GET ALL ROAD STATUSES


export const getRoadStatuses = async (req, res) => {
  try {
    const roads = await RoadStatus.find()
      .populate("reportedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: roads.length,
      roads,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// GET SINGLE ROAD STATUS


export const getRoadStatusById = async (req, res) => {
  try {
    const road = await RoadStatus.findById(req.params.id).populate(
      "reportedBy",
      "name email",
    );

    if (!road) {
      return res.status(404).json({
        success: false,
        message: "Road status not found",
      });
    }

    res.status(200).json({
      success: true,
      road,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// UPDATE ROAD STATUS


export const updateRoadStatus = async (req, res) => {
  try {
    const { status, reason } = req.body;

    const road = await RoadStatus.findById(req.params.id);

    if (!road) {
      return res.status(404).json({
        success: false,
        message: "Road status not found",
      });
    }

    if (status) {
      road.status = status;
    }

    if (reason) {
      road.reason = reason;
    }

    await road.save();

    res.status(200).json({
      success: true,
      message: "Road status updated successfully",
      road,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// DELETE ROAD STATUS


export const deleteRoadStatus = async (req, res) => {
  try {
    const road = await RoadStatus.findById(req.params.id);

    if (!road) {
      return res.status(404).json({
        success: false,
        message: "Road status not found",
      });
    }

    await road.deleteOne();

    res.status(200).json({
      success: true,
      message: "Road status deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
