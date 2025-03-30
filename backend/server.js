import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { auth } from "./config/firebase.js"; // Firebase Auth
import authRoutes from "./Routes/authRoutes.js";
import gitRoutes from "./Routes/gitRoutes.js";
import repoRoutes from "./Routes/repoRoutes.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies

// Firebase Authentication check middleware
const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer token from Authorization header
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const user = await auth.verifyIdToken(token); // Verify Firebase ID token
    req.user = user; // Attach the user object to the request
    next(); // Proceed to the next middleware/route
  } catch (error) {
    console.error("❌ Firebase authentication error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Use Firebase Authentication middleware on protected routes
app.use("/git", authenticateUser, gitRoutes);
app.use("/repo", authenticateUser, repoRoutes);

// Define API routes
app.use("/auth", authRoutes); // Public routes for authentication

// Default Route (Optional: To check if the server is running)
app.get("/", (req, res) => {
  res.send("Git UI App Backend is running...");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

/*

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./Routes/authRoutes.js";
import gitRoutes from "./Routes/gitRoutes.js";
import repoRoutes from "./Routes/repoRoutes.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected successfully");

    // Start the server only after DB connection is successful
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(🚀 Server running on port ${PORT});
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Exit the process if DB connection fails
  });

// Define API routes
app.use("/auth", authRoutes);
app.use("/git", gitRoutes);
app.use("/repo", repoRoutes);

// Default Route (Optional: To check if the server is running)
app.get("/", (req, res) => {
  res.send("Git UI App Backend is running...");
});

*/
