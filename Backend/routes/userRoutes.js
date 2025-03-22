import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  uploadUserProfileImage,
} from "../controllers/userController.js";
import { getClientConsultations } from "../controllers/consultationController.js";
import { protect } from "../config/auth.js";
import { uploadProfile, processUpload } from "../utils/imagekit.js";

const router = express.Router();

// User routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.get("/consultations", protect, getClientConsultations);
router.post(
  "/profile/upload",
  protect,
  (req, res, next) => {
    // ...existing code...
  },
  processUpload,
  uploadUserProfileImage
);

export default router;
