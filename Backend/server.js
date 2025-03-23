import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import { initAuth } from "./config/auth.js";
import fs from "fs";
// Add Socket.io imports
import http from "http";
import { Server } from "socket.io";

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
// Create HTTP server for Socket.io
const server = http.createServer(app);

// Get dirname equivalent in ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware
app.use(express.json({ limit: "50mb" })); // Increased limit for base64 images
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? [
            "https://we-hack-law-sphere.vercel.app",
            "https://lawsphere-api.vercel.app",
          ]
        : "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept-Language"],
  })
);

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve static files from public directory (for test pages)
app.use("/public", express.static(path.join(__dirname, "public")));

// Initialize Auth.js
initAuth(app);

// Initialize Socket.io with CORS settings
const io = new Server(server, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? "https://we-hack-law-sphere.vercel.app" // Frontend URL
        : "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// Setup Socket.io namespaces
const communityNamespace = io.of("/community");

// Socket.io event handlers
communityNamespace.on("connection", (socket) => {
  console.log("New client connected to community namespace:", socket.id);

  // Join room for specific topics
  socket.on("join-topic", (topicId) => {
    socket.join(`topic-${topicId}`);
    console.log(`Client ${socket.id} joined topic-${topicId}`);
  });

  // Leave topic room
  socket.on("leave-topic", (topicId) => {
    socket.leave(`topic-${topicId}`);
    console.log(`Client ${socket.id} left topic-${topicId}`);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Export io for use in controllers
export { io, communityNamespace };

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
// Use 'server' instead of 'app' to start the server with Socket.io
if (process.env.NODE_ENV !== "production") {
  // Only start Socket.io server in development
  // In production with Vercel serverless functions, we shouldn't start a long-running server
  server.listen(PORT, () => {
    console.log(
      `Server running on port ${PORT} in ${process.env.NODE_ENV} mode`
    );
  });
} else {
  // In production, just export the Express app for serverless functions
  console.log(
    `Server configured for ${process.env.NODE_ENV} mode (serverless)`
  );
}

// Make sure to export the Express app for Vercel
export default app;
