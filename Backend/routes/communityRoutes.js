import express from "express";
import {
  getTopics,
  getTopicById,
  createTopic,
  addReply,
  upvoteTopic,
  downvoteTopic,
  getCategories,
} from "../controllers/communityController.js";

const router = express.Router();

// Community routes
router.get("/topics", getTopics);
router.get("/topics/:id", getTopicById);
router.post("/topics", createTopic);
router.post("/topics/:id/replies", addReply);
router.put("/topics/:id/upvote", upvoteTopic);
router.put("/topics/:id/downvote", downvoteTopic);
router.get("/categories", getCategories);

export default router;
