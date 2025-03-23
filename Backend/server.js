import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import { initAuth } from "./config/auth.js";

// Import routes
import userRoutes from "./routes/userRoutes.js";
import lawyerRoutes from "./routes/lawyerRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import consultationRoutes from "./routes/consultationRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Get dirname equivalent in ES modules (for local dev only)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware
app.use(express.json({ limit: "50mb" })); // Increased limit for base64 images
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(
  cors({
    origin: [
      "https://we-hack-law-sphere.vercel.app",
      "http://localhost:5173"
    ],
    credentials: true,
  })
);

// Connect to MongoDB only when needed (for Vercel)
let dbConnected = false;
const connectToDatabase = async () => {
  try {
    if (!dbConnected) {
      await connectDB();
      dbConnected = true;
    }
    return true;
  } catch (error) {
    console.error("Database connection error:", error);
    return false;
  }
};

// Middleware to ensure DB connection
app.use(async (req, res, next) => {
  try {
    const connected = await connectToDatabase();
    if (!connected) {
      return res.status(500).json({ 
        success: false, 
        message: "Database connection failed" 
      });
    }
    next();
  } catch (error) {
    console.error("Database connection middleware error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Server error connecting to database" 
    });
  }
});

// Initialize Auth.js
initAuth(app);

// API routes
app.use("/api/users", userRoutes);
app.use("/api/lawyers", lawyerRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/consultations", consultationRoutes);
app.use("/api/health", healthRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to LawSphere API" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    success: false,
    message: "Server error",
    error: process.env.NODE_ENV === "development" ? err.message : "Something went wrong"
  });
});

// For local development
if (process.env.NODE_ENV !== "production") {
  // Create HTTP server only for local development
  import("http").then((http) => {
    import("socket.io").then(({ Server }) => {
      const server = http.createServer(app);
      const io = new Server(server, {
        cors: {
          origin: "http://localhost:5173",
          methods: ["GET", "POST", "PUT", "DELETE"],
          credentials: true,
        }
      });
      
      // Setup Socket.io namespaces
      const communityNamespace = io.of("/community");

      // Socket.io event handlers
      communityNamespace.on("connection", (socket) => {
        console.log("New client connected to community namespace:", socket.id);

        socket.on("join-topic", (topicId) => {
          socket.join(`topic-${topicId}`);
          console.log(`Client ${socket.id} joined topic-${topicId}`);
        });

        socket.on("leave-topic", (topicId) => {
          socket.leave(`topic-${topicId}`);
          console.log(`Client ${socket.id} left topic-${topicId}`);
        });

        socket.on("disconnect", () => {
          console.log("Client disconnected:", socket.id);
        });
      });

      // Export io for use in controllers (local dev only)
      global.io = io;
      global.communityNamespace = communityNamespace;

      // Start server for local dev
      const PORT = process.env.PORT || 5000;
      server.listen(PORT, () => {
        console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
      });
    });
  });
} else {
  // In production, we don't start the server ourselves (Vercel does)
  // Create placeholders for socket references
  global.communityNamespace = {
    emit: () => console.log("Socket.io emit called in serverless environment"),
    to: (room) => ({
      emit: (...args) => {
        console.log(`Socket.io room ${room} emit called in serverless:`, args[0]);
        return true;
      }
    })
  };
}

// Export for Vercel
export default app;
