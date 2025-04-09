// authController.js
import admin from "firebase-admin";
import axios from "axios";
import dotenv from "dotenv";
import { linkGitAccount } from "../Models/User.js";

dotenv.config();

// Initialize Firebase Admin with service account credentials
const serviceAccountJSON = Buffer.from(
  process.env.FIREBASE_CREDENTIALS_BASE64,
  "base64"
).toString("utf-8");
const serviceAccount = JSON.parse(serviceAccountJSON);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// ✅ Middleware: Verifies Firebase token and adds user info to req.user
export const verifyFirebaseToken = async (req, res, next) => {
  try {
    const token = req.headers?.token;

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Firebase token verification failed:", error.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// ✅ Verify if a user owns a repo using Git API
export const verifyRepoOwnership = async (req, res) => {
  try {
    const { gitProvider, accessToken, repoUrl } = req.body;

    // Validate input
    if (!gitProvider || !repoUrl || !accessToken) {
      return res
        .status(400)
        .json({ error: "gitProvider, accessToken, and repoUrl are required" });
    }

    let apiUrl;
    const headers = {
      Authorization:
        gitProvider === "github"
          ? `token ${accessToken}`
          : `Bearer ${accessToken}`,
    };

    switch (gitProvider) {
      case "github":
        apiUrl = "https://api.github.com/user/repos";
        break;
      case "gitlab":
        apiUrl = "https://gitlab.com/api/v4/projects?owned=true";
        break;
      case "bitbucket":
        apiUrl = "https://api.bitbucket.org/2.0/repositories?role=owner";
        break;
      default:
        return res.status(400).json({ error: "Invalid gitProvider" });
    }

    const response = await axios.get(apiUrl, { headers });

    const repos =
      gitProvider === "bitbucket" ? response.data.values : response.data;

    const ownsRepo = repos.some((repo) =>
      repoUrl.includes(
        repo.ssh_url ||
          repo.http_url ||
          repo.clone_url ||
          repo.links?.html?.href ||
          repo.web_url
      )
    );

    if (!ownsRepo) {
      return res
        .status(403)
        .json({ error: "Repository not owned by the authenticated user" });
    }

    return res.status(200).json({
      success: true,
      message: "Repository ownership verified successfully",
    });
  } catch (error) {
    console.error("Repo verification error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Handle Git login and store Git identity in Firebase Firestore
export const loginWithGitProvider = async (req, res) => {
  try {
    const { uid, gitProvider, accessToken } = req.body;

    if (!uid || !gitProvider || !accessToken) {
      return res.status(400).json({
        error: "uid, gitProvider, and accessToken are required",
      });
    }

    let profileUrl;
    const headers = {
      Authorization:
        gitProvider === "github"
          ? `token ${accessToken}`
          : `Bearer ${accessToken}`,
    };

    switch (gitProvider) {
      case "github":
        profileUrl = "https://api.github.com/user";
        break;
      case "gitlab":
        profileUrl = "https://gitlab.com/api/v4/user";
        break;
      case "bitbucket":
        profileUrl = "https://api.bitbucket.org/2.0/user";
        break;
      default:
        return res.status(400).json({ error: "Invalid gitProvider" });
    }

    // Get user profile from Git provider
    const profileRes = await axios.get(profileUrl, { headers });

    const username =
      profileRes.data.username ||
      profileRes.data.login ||
      profileRes.data.nickname;

    if (!username) {
      return res
        .status(400)
        .json({ error: "Could not retrieve Git account username" });
    }

    // 🔗 Link account to Firestore user
    await linkGitAccount(uid, gitProvider, {
      username,
      accessToken,
    });

    return res.status(200).json({
      success: true,
      message: `${gitProvider} account linked successfully`,
      username,
    });
  } catch (error) {
    console.error("Git login error:", error.message);
    return res.status(500).json({ error: "Git authentication failed" });
  }
};
