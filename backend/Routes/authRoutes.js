import express from "express";
import { auth } from "../config/firebase.js"; // Import Firebase auth
import admin from "firebase-admin";

const router = express.Router();

// Signup Route
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    res.status(201).json({
      message: "User created successfully",
      uid: userRecord.uid,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Firebase does not provide password authentication via admin SDK.
    // In a frontend, you would use Firebase Client SDK (firebase/auth).
    res.status(200).json({
      message: "Use Firebase Client SDK to authenticate users.",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Verify User Token Route
router.post("/verify-token", async (req, res) => {
  const { token } = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    res.status(200).json({ message: "Token is valid", decodedToken });
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

export default router;
