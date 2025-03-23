import mongoose from "mongoose";

const connectDB = async () => {
  try {
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

    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // Don't exit the process in serverless, handle error gracefully
    throw error; // Re-throw so the middleware can handle it
  }
};

export default connectDB;
