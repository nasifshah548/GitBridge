// Import required modules
import admin from "firebase-admin";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// Decode the base64-encoded Firebase credentials
const serviceAccountJSON = Buffer.from(
  process.env.FIREBASE_CREDENTIALS_BASE64,
  "base64"
).toString("utf-8");

// Parse JSON from the decoded string
const serviceAccount = JSON.parse(serviceAccountJSON);

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Function to verify Firebase ID token
export const verifyFirebaseToken = async (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Firebase token verification failed:", error);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

// Function to verify repo ownership
export const verifyRepoOwnership = async (req, res) => {
  try {
    const { gitProvider, accessToken, repoUrl } = req.body;

    if (!gitProvider || !accessToken || !repoUrl) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    let apiUrl, headers;
    switch (gitProvider) {
      case "github":
        apiUrl = `https://api.github.com/user/repos`;
        headers = { Authorization: `token ${accessToken}` };
        break;
      case "gitlab":
        apiUrl = `https://gitlab.com/api/v4/projects?owned=true`;
        headers = { Authorization: `Bearer ${accessToken}` };
        break;
      case "bitbucket":
        apiUrl = `https://api.bitbucket.org/2.0/repositories?role=owner`;
        headers = { Authorization: `Bearer ${accessToken}` };
        break;
      default:
        return res.status(400).json({ error: "Invalid Git provider" });
    }

    const response = await axios.get(apiUrl, { headers });
    const userRepos = response.data;

    // Check if user owns the repo
    const ownsRepo = userRepos.some((repo) =>
      repoUrl.includes(repo.ssh_url || repo.http_url || repo.clone_url)
    );

    if (!ownsRepo) {
      return res
        .status(403)
        .json({ error: "User does not own this repository" });
    }

    res
      .status(200)
      .json({ success: true, message: "Repository verified successfully" });
  } catch (error) {
    console.error("Error verifying repo ownership:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
