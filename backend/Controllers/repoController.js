// repoController.js
import { firestore } from "firebase-admin";
import { db } from "../config/firebase.js"; // Assuming you have firebase.js file for Firebase config

// Function to verify the repo link and user ownership
const verifyRepoOwnership = async (userId, repoUrl) => {
  // Extract the username and repo name from the URL (this assumes a format like: https://github.com/username/repo)
  const urlParts = repoUrl.split("/");
  const platform = urlParts[2]; // github, gitlab, or bitbucket
  const username = urlParts[3];
  const repoName = urlParts[4];

  // Fetch user data from Firebase
  const userRef = db.collection("users").doc(userId);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    throw new Error("User not found!");
  }

  const userData = userDoc.data();
  const userGitPlatform = userData.gitPlatform; // github, gitlab, or bitbucket
  const userGitUsername = userData.gitUsername; // The username the user has linked on that platform

  // Check if the user is authenticated with the same platform as the repo link
  if (userGitPlatform !== platform || userGitUsername !== username) {
    throw new Error("Repo does not belong to the authenticated user!");
  }

  return true;
};

// Function to link the repo to the user's account
const linkRepo = async (req, res) => {
  const { userId, repoUrl } = req.body;

  try {
    // Verify if the user owns the repo
    const isOwner = await verifyRepoOwnership(userId, repoUrl);

    if (isOwner) {
      // Store the repo link to the user's account in the database
      const userRef = db.collection("users").doc(userId);
      await userRef.update({
        linkedRepos: firestore.FieldValue.arrayUnion(repoUrl),
      });

      res.status(200).json({
        success: true,
        message: "Repository successfully linked to your account!",
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Function to get linked repositories
const getLinkedRepos = async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch the user's data
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    const userData = userDoc.data();
    const linkedRepos = userData.linkedRepos || [];

    res.status(200).json({
      success: true,
      linkedRepos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching linked repos.",
    });
  }
};

export { linkRepo, getLinkedRepos };
