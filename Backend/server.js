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
  if (!dbConnected) {
    await connectDB();
    dbConnected = true;
  }
  return;
};
 with better error handling
// Middleware to ensure DB connection
app.use(async (req, res, next) => {
  try {
    await connectToDatabase(); conn = await connectDB();
    next();
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ success: false, message: "Database connection failed" });     // If connection failed but we're handling it gracefully
  }     console.error("Database connection failed but continuing");
});      }

// Initialize Auth.js
initAuth(app);  } catch (error) {
rror("Database connection middleware error:", error);
// API routestinue with the request
app.use("/api/users", userRoutes);
app.use("/api/lawyers", lawyerRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/consultations", consultationRoutes);initAuth(app);
app.use("/api/health", healthRoutes);

// Root route
app.get("/", (req, res) => {.use("/api/lawyers", lawyerRoutes);
  res.json({ message: "Welcome to LawSphere API" });app.use("/api/resources", resourceRoutes);
});mmunityRoutes);

// Error handling middlewaretionRoutes);
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    success: false,
    message: "Server error",
    error: process.env.NODE_ENV === "development" ? err.message : "Something went wrong"
  });// Error handling middleware
});next) => {

// For local development
if (process.env.NODE_ENV !== "production") {
  // Create HTTP server only for local development
  import("http").then((http) => {ment" ? err.message : "Something went wrong"
    import("socket.io").then(({ Server }) => {
      const server = http.createServer(app);
      const io = new Server(server, {
        cors: {
          origin: "http://localhost:5173", "production") {
          methods: ["GET", "POST", "PUT", "DELETE"],te HTTP server only for local development
          credentials: true,"http").then((http) => {
        }port("socket.io").then(({ Server }) => {
      });ver(app);
      
      // Setup Socket.io namespaces        cors: {
      const communityNamespace = io.of("/community");st:5173",

      // Socket.io event handlers
      communityNamespace.on("connection", (socket) => {        }
        console.log("New client connected to community namespace:", socket.id);

        socket.on("join-topic", (topicId) => {
          socket.join(`topic-${topicId}`); communityNamespace = io.of("/community");
          console.log(`Client ${socket.id} joined topic-${topicId}`);
        });
socket) => {
        socket.on("leave-topic", (topicId) => { socket.id);
          socket.leave(`topic-${topicId}`);
          console.log(`Client ${socket.id} left topic-${topicId}`);        socket.on("join-topic", (topicId) => {
        });`);
{topicId}`);
        socket.on("disconnect", () => {
          console.log("Client disconnected:", socket.id);
        });        socket.on("leave-topic", (topicId) => {
      });
(`Client ${socket.id} left topic-${topicId}`);
      // Export io for use in controllers (local dev only)
      global.io = io;
      global.communityNamespace = communityNamespace;=> {
, socket.id);
      // Start server for local dev
      const PORT = process.env.PORT || 5000;
      server.listen(PORT, () => {
        console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);/ Export io for use in controllers (local dev only)
      }); global.io = io;
    });obal.communityNamespace = communityNamespace;
  });
} else {
  // In production, we don't start the server ourselves (Vercel does)PORT || 5000;
  // Create placeholders for socket references
  global.communityNamespace = {log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);e;
    emit: () => console.log("Socket.io emit called in serverless environment"),
    to: () => ({;: (room) => ({
      emit: () => console.log("Socket.io room emit called in serverless environment");  emit: (...args) => {
    })       console.log(`Socket.io room ${room} emit called in serverless:`, args[0]); else {
  };        return true;  // In production, we don't start the server ourselves (Vercel does)
}et references

// Export for Vercel  };    emit: () => console.log("Socket.io emit called in serverless environment"),


export default app;




export default app;// Export for Vercel}    to: () => ({
      emit: () => console.log("Socket.io room emit called in serverless environment")
    })
  };
}

// Export for Vercel
export default app;
