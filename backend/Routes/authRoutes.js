import express from "express";
import admin from "firebase-admin";
import {
  loginWithGitProvider,
  verifyRepoOwnership,
} from "../controllers/authController.js";

const router = express.Router();

/* Signup Route */
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userRecord = await admin.auth().createUser({ email, password });

    res.status(201).json({
      message: "User created successfully",
      uid: userRecord.uid,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/* Login Route - Not handled here (Client SDK Required) */
router.post("/login", async (_req, res) => {
  res.status(200).json({
    message: "Use Firebase Client SDK (firebase/auth) to authenticate users.",
  });
});

/* Verify Token */
router.post("/verify-token", async (req, res) => {
  const { token } = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    res.status(200).json({ message: "Token is valid", decodedToken });
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

/* Git Provider Login Route */
router.post("/git-login", loginWithGitProvider);

/* Optional: Repo Ownership Verification Route */
router.post("/verify-repo-ownership", verifyRepoOwnership);

// Get all linked Git accounts for current user
router.get("/git-accounts", verifyFirebaseToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const accounts = await getLinkedGitAccounts(uid);
    res.status(200).json({ success: true, gitAccounts: accounts });
  } catch (error) {
    console.error("Error fetching linked Git accounts:", error);
    res.status(500).json({ error: "Failed to retrieve Git accounts" });
  }
});

// Unlink a specific Git provider account
router.delete(
  "/git-accounts/:provider",
  verifyFirebaseToken,
  async (req, res) => {
    try {
      const uid = req.user.uid;
      const { provider } = req.params;

      const result = await unlinkGitAccount(uid, provider.toLowerCase());
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      console.error("Error unlinking Git account:", error);
      res.status(500).json({ error: "Failed to unlink Git account" });
    }
  }
);

export default router;
