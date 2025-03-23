import mongoose from "mongoose";

// Enhanced connection with retry logic for serverless environments
const connectDB = async () => {
  try {
<<<<<<< HEAD
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

=======
    if (mongoose.connection.readyState === 1) {
      console.log("MongoDB already connected");
      return mongoose.connection;
    }

    // Add more robust error handling and retry logic
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Reduced timeout for serverless environment
      bufferCommands: false, // Disable mongoose buffering
      maxPoolSize: 5, // Smaller pool size for serverless
    };

>>>>>>> 23e6a4d227c13106c0a75eb6af56f7233e06e69c
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
<<<<<<< HEAD
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
=======
    console.error(`MongoDB connection error: ${error.message}`);
    // Don't exit the process in serverless, handle error gracefully
    throw error; // Re-throw so the middleware can handle it
>>>>>>> 23e6a4d227c13106c0a75eb6af56f7233e06e69c
  }
};

export default connectDB;
