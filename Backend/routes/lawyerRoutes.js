import express from "express";
import {
  getLawyers,
  getLawyerById,
  scheduleLawyerConsultation,
  addLawyerReview,
  createLawyer,
  uploadLawyerProfileImage,
  getLawyerReviews,
  updateLawyerProfile,
} from "../controllers/lawyerController.js";
import { protect } from "../config/auth.js";
import { uploadProfile } from "../utils/cloudinary.js";

const router = express.Router();

// Lawyer routes
router.get("/", getLawyers);
router.get("/:id", getLawyerById);
router.post("/", protect, createLawyer);
router.put("/:id", protect, updateLawyerProfile);
router.post(
  "/upload-profile",
  protect,
  (req, res, next) => {
    uploadProfile(req, res, (err) => {
      if (err) {
        console.error("Upload middleware error:", err);
        return res.status(400).json({
          success: false,
          message: err.message || "File upload failed",
        });
      }

      // Check if file was properly uploaded by the middleware
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "File upload failed - no file received",
        });
      }

      next();
    });
  },
  uploadLawyerProfileImage
);
router.post("/:id/consultations", protect, scheduleLawyerConsultation);
router.get("/:id/reviews", getLawyerReviews);
router.post("/:id/reviews", protect, addLawyerReview);

export default router;
