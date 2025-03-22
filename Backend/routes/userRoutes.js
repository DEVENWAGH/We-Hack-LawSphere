import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  uploadUserProfileImage,
} from "../controllers/userController.js";

const router = express.Router();

// User routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", getUserProfile);
router.put("/profile", updateUserProfile);
router.post("/profile/upload", uploadUserProfileImage);

export default router;
