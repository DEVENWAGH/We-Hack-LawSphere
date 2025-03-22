import express from "express";

const router = express.Router();

// Health check endpoint
router.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "LawSphere API is running",
    env: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

export default router;
