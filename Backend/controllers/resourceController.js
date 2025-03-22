import ResourceModel from "../models/Resource.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * @desc    Get all resources (with filters)
 * @route   GET /api/resources
 * @access  Public
 */
export const getResources = async (req, res) => {
  try {
    // Mock data including the PDF files
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
        file: "Tenants-Rights.pdf",
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
      {
        id: "5",
        title: "Discrimination Law Overview",
        description:
          "Comprehensive guide to discrimination laws and protections for individuals in various settings.",
        type: "Guide",
        category: "Civil Rights",
        views: 7200,
        downloads: 1800,
        file: "DISCRIMINATION.pdf",
      },
      {
        id: "6",
        title: "English Constitution",
        description:
          "Overview of the English constitutional framework and principles.",
        type: "Guide",
        category: "Other",
        views: 4100,
        downloads: 1200,
        file: "englishconstitution.pdf",
      },
      {
        id: "7",
        title: "Labour Law Handbook",
        description:
          "Guide to employment laws, worker rights, and employer obligations.",
        type: "Guide",
        category: "Employment Law",
        views: 9500,
        downloads: 3400,
        file: "Labour_Law.pdf",
      },
      {
        id: "8",
        title: "Model Tenancy Act",
        description:
          "Complete text of the Model Tenancy Act with explanations and implications for landlords and tenants.",
        type: "Guide",
        category: "Housing & Tenant Rights",
        views: 6300,
        downloads: 2700,
        file: "Model-Tenancy-Act-English.pdf",
      },
      {
        id: "9",
        title: "Notice of Termination Template",
        description:
          "Template for creating a legally valid termination notice for tenancy agreements.",
        type: "Template",
        category: "Housing & Tenant Rights",
        views: 11200,
        downloads: 8600,
        file: "Notice-of-Termination.pdf",
      },
      {
        id: "10",
        title: "Privacy Law Guide",
        description:
          "Understanding privacy laws and your rights to data protection and confidentiality.",
        type: "Guide",
        category: "Consumer Rights",
        views: 5600,
        downloads: 2100,
        file: "PRIVACY_LAW.pdf",
      },
      {
        id: "11",
        title: "Eviction Rights and Processes",
        description:
          "Legal guide to eviction procedures and tenant rights during eviction.",
        type: "Guide",
        category: "Housing & Tenant Rights",
        views: 14700,
        downloads: 7300,
        file: "RIGHT_EVICTION.pdf",
      },
      {
        id: "12",
        title: "Tenants' Rights Handbook",
        description:
          "Comprehensive handbook on tenant rights, responsibilities, and legal remedies.",
        type: "Guide",
        category: "Housing & Tenant Rights",
        views: 18200,
        downloads: 9100,
        file: "Tenants-Rights-Handbook.pdf",
      },
      {
        id: "13",
        title: "Women's Legal Rights",
        description:
          "Guide to legal protections and rights specific to women across various areas of law.",
        type: "Guide",
        category: "Civil Rights",
        views: 7900,
        downloads: 3600,
        file: "Woman_Law.pdf",
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

/**
 * @desc    Get resource file for download or view
 * @route   GET /api/resources/:id/file
 * @access  Public
 */
export const getResourceFile = async (req, res) => {
  try {
    const resourceId = req.params.id;

    // In a real app, you would fetch the resource from the database
    // Here we're using our mock data
    const resources = [
      // ...mock data with files
      { id: "1", file: "Tenants-Rights.pdf" },
      { id: "5", file: "DISCRIMINATION.pdf" },
      { id: "6", file: "englishconstitution.pdf" },
      { id: "7", file: "Labour_Law.pdf" },
      { id: "8", file: "Model-Tenancy-Act-English.pdf" },
      { id: "9", file: "Notice-of-Termination.pdf" },
      { id: "10", file: "PRIVACY_LAW.pdf" },
      { id: "11", file: "RIGHT_EVICTION.pdf" },
      { id: "12", file: "Tenants-Rights-Handbook.pdf" },
      { id: "13", file: "Woman_Law.pdf" },
    ];

    const resource = resources.find((r) => r.id === resourceId);

    if (!resource || !resource.file) {
      return res.status(404).json({
        success: false,
        message: "Resource file not found",
      });
    }

    // Use path.join with __dirname and "../resources" to get the correct path
    const filePath = path.join(__dirname, "../resources", resource.file);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "File not found on server",
      });
    }

    // Check if download is requested
    const download = req.query.download === "true";

    if (download) {
      res.download(filePath, resource.file);
    } else {
      // Stream the file for viewing
      const fileStream = fs.createReadStream(filePath);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `inline; filename=${resource.file}`);
      fileStream.pipe(res);
    }
  } catch (error) {
    console.error("Get resource file error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
