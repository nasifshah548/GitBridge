import admin from "firebase-admin";
import { db } from "../config/firebase.js";
import Joi from "joi";

const { firestore } = admin;

// Helper: Validate request payloads
const validateInput = (schema, data) => {
  const { error } = schema.validate(data);
  if (error) throw new Error(error.details[0].message);
};

// Validate and verify repo ownership
const verifyRepoOwnership = async (userId, repoUrl) => {
  const urlParts = repoUrl.split("/");
  const platform = urlParts[2]; // e.g., github.com
  const username = urlParts[3];

  const userRef = db.collection("users").doc(userId);
  const userDoc = await userRef.get();

  if (!userDoc.exists) throw new Error("User not found!");

  const userData = userDoc.data();
  const userGitPlatform = userData.gitPlatform;
  const userGitUsername = userData.gitUsername;

  if (!userGitPlatform || !userGitUsername) {
    throw new Error("User has not linked a Git account yet.");
  }

  if (!platform.includes(userGitPlatform) || userGitUsername !== username) {
    throw new Error("Repo does not belong to the authenticated user!");
  }

  return true;
};

// Link repo
const linkRepo = async (req, res) => {
  try {
    const schema = Joi.object({
      userId: Joi.string().required(),
      repoUrl: Joi.string().uri().required(),
    });

    validateInput(schema, req.body);

    const { userId, repoUrl } = req.body;

    await verifyRepoOwnership(userId, repoUrl);

    const userRef = db.collection("users").doc(userId);
    await userRef.update({
      linkedRepos: firestore.FieldValue.arrayUnion(repoUrl),
    });

    res.status(200).json({
      success: true,
      message: "Repository successfully linked to your account!",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get linked repos
const getLinkedRepos = async (req, res) => {
  try {
    const schema = Joi.object({ userId: Joi.string().required() });
    validateInput(schema, req.params);

    const { userId } = req.params;

    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    const userData = userDoc.data();
    const linkedRepos = userData.linkedRepos || [];

    res.status(200).json({ success: true, linkedRepos });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Clone repo (mock)
const cloneRepo = async (req, res) => {
  try {
    const schema = Joi.object({
      repoUrl: Joi.string().uri().required(),
    });

    validateInput(schema, req.body);
    const { repoUrl } = req.body;

    console.log(`Cloning repository: ${repoUrl}`);

    res.status(200).json({
      success: true,
      message: "Repository cloned successfully!",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete repo
const deleteRepo = async (req, res) => {
  try {
    const schema = Joi.object({
      userId: Joi.string().required(),
      repoUrl: Joi.string().uri().required(),
    });

    validateInput(schema, req.body);
    const { userId, repoUrl } = req.body;

    const userRef = db.collection("users").doc(userId);
    await userRef.update({
      linkedRepos: firestore.FieldValue.arrayRemove(repoUrl),
    });

    res.status(200).json({
      success: true,
      message: "Repository deleted successfully!",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// List repos (same as getLinkedRepos for redundancy)
const listRepos = async (req, res) => {
  return getLinkedRepos(req, res); // Reuse the same logic
};

export { linkRepo, getLinkedRepos, cloneRepo, deleteRepo, listRepos };
