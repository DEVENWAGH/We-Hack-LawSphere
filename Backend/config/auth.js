import { ExpressAuth } from "@auth/express";
import jwt from "jsonwebtoken";
import UserModel from "../models/User.js";

// Custom middleware to verify JWT tokens for API routes
export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user and exclude the password
    req.user = await UserModel.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// Admin middleware
export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(401).json({ message: "Not authorized as an admin" });
  }
};

export const initAuth = (app) => {
  // Configure Auth.js v5
  const authHandler = ExpressAuth({
    secret: process.env.AUTH_SECRET,
    trustHost: true,
    // Using session-based auth instead of MongoDB adapter
    providers: [
      {
        id: "credentials",
        name: "Credentials",
        type: "credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        async authorize({ email, password }) {
          try {
            const user = await UserModel.findOne({ email }).select("+password");

            if (!user || !(await user.matchPassword(password))) {
              return null;
            }

            return {
              id: user._id.toString(),
              email: user.email,
              name: user.name,
              role: user.role,
            };
          } catch (error) {
            console.error("Authorize error:", error);
            return null;
          }
        },
      },
    ],
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
          token.role = user.role;
        }
        return token;
      },
      async session({ session, token }) {
        if (token) {
          session.user.id = token.id;
          session.user.role = token.role;
        }
        return session;
      },
    },
    pages: {
      signIn: "/login",
      error: "/error",
    },
    session: {
      strategy: "jwt",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    debug: process.env.NODE_ENV === "development",
  });

  // Add Auth.js routes
  app.use("/api/auth", authHandler);
};
