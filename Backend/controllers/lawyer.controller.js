import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import path from "path";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure storage engine for profile images
const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "lawsphere/profiles",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

// Configure storage engine for resources
const resourceStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "lawsphere/resources",
    allowed_formats: ["jpg", "jpeg", "png", "pdf", "doc", "docx"],
    resource_type: "auto",
  },
});

// Create upload middleware
export const uploadProfile = multer({
  storage: profileStorage,
  limits: { fileSize: 2000000 }, // 2MB max size
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only .jpeg, .jpg and .png files are allowed!"));
    }
  },
}).single("profileImage");

export const uploadResource = multer({
  storage: resourceStorage,
  limits: { fileSize: 10000000 }, // 10MB max size
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (extname) {
      return cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Allowed types: .jpeg, .jpg, .png, .pdf, .doc, .docx"
        )
      );
    }
  },
}).single("file");

export default cloudinary;

// Add or update the controller method for handling profile image uploads
export const uploadProfilePhoto = async (req, res) => {
  try {
    // req.file should be available from the uploadProfile middleware
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    console.log("File upload details:", req.file);

    // Get lawyer ID from URL parameter
    const lawyerId = req.params.id;

    // Find the lawyer profile
    const lawyer = await Lawyer.findById(lawyerId);
    if (!lawyer) {
      return res.status(404).json({
        success: false,
        message: "Lawyer profile not found",
      });
    }

    // Ensure the logged-in user owns this profile
    if (lawyer.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this profile",
      });
    }

    // Update lawyer profile with the new image URL
    lawyer.profileImage = req.file.path || req.file.secure_url;
    await lawyer.save();

    res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      data: {
        profileImage: lawyer.profileImage,
      },
    });
  } catch (error) {
    console.error("Error in uploadProfilePhoto:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading profile image",
      error: error.message,
    });
  }
};
