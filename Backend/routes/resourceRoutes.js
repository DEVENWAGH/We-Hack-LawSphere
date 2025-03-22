import express from "express";
import {
  getResources,
  getResourceById,
  getResourceCategories,
  incrementDownload,
} from "../controllers/resourceController.js";

const router = express.Router();

// Resource routes
router.get("/", getResources);
router.get("/categories", getResourceCategories);
router.get("/:id", getResourceById);
router.put("/:id/download", incrementDownload);

export default router;
