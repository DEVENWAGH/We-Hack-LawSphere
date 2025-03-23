import mongoose from "mongoose";

// Enhanced connection with retry logic for serverless environments
const connectDB = async () => {
  try {
    // Use a connection pool for better serverless compatibility
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      bufferCommands: false, // Disable mongoose buffering
    };

    // Check if we already have a connection
    if (mongoose.connection.readyState === 1) {
      console.log("MongoDB: Using existing connection");
      return;
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);

    // In serverless, we often want to continue even if DB connection fails
    // This helps avoid cold start failures in serverless functions
    if (process.env.NODE_ENV === "production") {
      console.warn(
        "Continuing despite MongoDB connection error (serverless environment)"
      );
    } else {
      // In development, fail fast
      process.exit(1);
    }
  }
};

export default connectDB;
