import ResourceModel from "../models/Resource.js";

/**
 * @desc    Get all resources (with filters)
 * @route   GET /api/resources
 * @access  Public
 */
export const getResources = async (req, res) => {
  try {
    // Mock data for now
    const resources = [
      {
        id: "1",
        title: "Know Your Rights: Tenant Basics",
        description:
          "Essential information for renters about lease agreements, maintenance responsibilities, eviction procedures, and security deposits.",
        type: "Guide",
        category: "Housing & Tenant Rights",
        views: 12500,
        downloads: 3200,
      },
      {
        id: "2",
        title: "Simple Will Template",
        description:
          "A basic will template with instructions on how to properly complete and execute it according to state requirements.",
        type: "Template",
        category: "Family Law",
        views: 8700,
        downloads: 5100,
      },
      {
        id: "3",
        title: "Small Claims Court: Step by Step",
        description:
          "A comprehensive video tutorial walking you through the entire small claims court process from filing to collection.",
        type: "Video",
        category: "Small Claims",
        views: 15300,
        duration: "24 min",
      },
      {
        id: "4",
        title: "Power of Attorney Form",
        description:
          "Customize this power of attorney template to authorize someone to make legal decisions on your behalf.",
        type: "Template",
        category: "Family Law",
        views: 10100,
        downloads: 4800,
      },
    ];

    res.json({
      success: true,
      count: resources.length,
      data: resources,
    });
  } catch (error) {
    console.error("Get resources error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get resource categories
 * @route   GET /api/resources/categories
 * @access  Public
 */
export const getResourceCategories = async (req, res) => {
  try {
    const categories = [
      "Housing & Tenant Rights",
      "Family Law",
      "Employment Law",
      "Consumer Rights",
      "Immigration",
      "Traffic & Driving",
      "Criminal Defense",
      "Civil Rights",
    ];

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get resource by ID
 * @route   GET /api/resources/:id
 * @access  Public
 */
export const getResourceById = async (req, res) => {
  try {
    // In real app, fetch resource from database
    res.json({
      success: true,
      data: {
        message: `Resource details for ID: ${req.params.id} will be implemented`,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Increment download count
 * @route   PUT /api/resources/:id/download
 * @access  Public
 */
export const incrementDownload = async (req, res) => {
  try {
    // In real app, update download count in database
    res.json({
      success: true,
      data: {
        message: `Download count incremented for resource ID: ${req.params.id}`,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
