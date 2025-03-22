import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import { initAuth } from "./config/auth.js";
import fs from "fs";

// Import routes
import userRoutes from "./routes/userRoutes.js";
import lawyerRoutes from "./routes/lawyerRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import consultationRoutes from "./routes/consultationRoutes.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Get dirname equivalent in ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware
app.use(express.json({ limit: "50mb" })); // Increased limit for base64 images
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://lawsphere.org" // Update with your production domain
        : "http://localhost:5173", // Vite default port
    credentials: true,
  })
);

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve static files from the resources directory
app.use("/resources", express.static(path.join(__dirname, "resources")));

// Serve static files from public directory (for test pages)
app.use("/public", express.static(path.join(__dirname, "public")));

// Initialize Auth.js
initAuth(app);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/lawyers", lawyerRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/consultations", consultationRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to LawSphere API" });
});

// Debug route to check file paths
app.get("/api/debug/files", (req, res) => {
  const uploadsDir = path.join(__dirname, "uploads");

  try {
    // Check if directory exists
    if (!fs.existsSync(uploadsDir)) {
      return res.status(404).json({
        success: false,
        message: "Uploads directory not found",
      });
    }

    // List profiles directory
    const profilesDir = path.join(uploadsDir, "profiles");
    const profileFiles = fs.existsSync(profilesDir)
      ? fs.readdirSync(profilesDir).map((file) => ({
          name: file,
          size: fs.statSync(path.join(profilesDir, file)).size,
          url: `/uploads/profiles/${file}`,
          fullUrl: `${req.protocol}://${req.get(
            "host"
          )}/uploads/profiles/${file}`,
        }))
      : [];

    res.json({
      success: true,
      baseUrl: `${req.protocol}://${req.get("host")}`,
      uploadsPath: uploadsDir,
      profileFiles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error listing files",
      error: error.message,
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
