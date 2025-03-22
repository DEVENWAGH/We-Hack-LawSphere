import UserModel from "../models/User.js";
import { uploadProfile } from "../utils/imagekit.js";

/**
 * @desc    Register a new user
 * @route   POST /api/users/register
 * @access  Public
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists with that email",
      });
    }

    // Create the user
    const user = await UserModel.create({
      name,
      email,
      password,
    });

    if (user) {
      // Generate token
      const token = user.getSignedJwtToken();

      res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid user data",
      });
    }
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/users/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await UserModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate token
    const token = user.getSignedJwtToken();

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
export const getUserProfile = async (req, res) => {
  try {
    // For now, return a placeholder response
    // In a real app, this would use the authenticated user
    res.json({
      success: true,
      data: {
        message:
          "User profile feature will be implemented with proper authentication",
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateUserProfile = async (req, res) => {
  try {
    const { name, location, bio } = req.body;

    // Get user ID from the authenticated request
    const userId = req.user.id;

    // Find and update the user
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        name,
        location,
        bio,
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          location: updatedUser.location,
          bio: updatedUser.bio,
          profileImage: updatedUser.profileImage,
        },
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Upload user profile image
 * @route   POST /api/users/profile/upload
 * @access  Private
 */
export const uploadUserProfileImage = async (req, res) => {
  try {
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Get the URL from the uploaded file
    const profileImageUrl = req.file.path || req.file.secure_url;
    console.log("File uploaded to ImageKit:", profileImageUrl);

    // Update user profile with the new image URL
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user.id,
      { profileImage: profileImageUrl },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Add cache-busting query parameter to the URL
    const cacheBustUrl = `${profileImageUrl}?t=${Date.now()}`;

    res.json({
      success: true,
      url: cacheBustUrl,
      message: "Profile image uploaded successfully",
      data: {
        profileImage: cacheBustUrl,
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          profileImage: cacheBustUrl,
        },
      },
    });
  } catch (error) {
    console.error("Profile image upload error:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
