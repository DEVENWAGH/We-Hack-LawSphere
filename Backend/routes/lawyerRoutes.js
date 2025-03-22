import express from "express";
import {
  getLawyers,
  getLawyerById,
  scheduleLawyerConsultation,
  addLawyerReview,
} from "../controllers/lawyerController.js";

const router = express.Router();

// Lawyer routes
router.get("/", getLawyers);
router.get("/:id", getLawyerById);
router.post("/:id/consultations", scheduleLawyerConsultation);
router.post("/:id/reviews", addLawyerReview);

export default router;
