import admin from "../config/firebase.js";

const db = admin.firestore();
const usersCollection = db.collection("users");

/**
 * Create a new user in Firestore.
 * Automatically includes an empty `gitAccounts` object to store future Git identity links.
 */
export const createUser = async (userData) => {
  const userRef = usersCollection.doc(userData.uid);
  await userRef.set({
    ...userData,
    gitAccounts: {}, // initialize empty Git provider map
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  return { id: userRef.id, ...userData, gitAccounts: {} };
};

/**
 * Get user data by Firebase UID.
 */
export const getUserByUid = async (uid) => {
  const userDoc = await usersCollection.doc(uid).get();
  if (!userDoc.exists) return null;
  return { id: userDoc.id, ...userDoc.data() };
};

/**
 * Update general user data.
 */
export const updateUser = async (uid, updateData) => {
  await usersCollection.doc(uid).update(updateData);
  return { uid, ...updateData };
};

/**
 * Delete the user document by UID.
 */
export const deleteUser = async (uid) => {
  await usersCollection.doc(uid).delete();
  return { message: "User deleted successfully" };
};

/**
 * Link or update a Git provider account (e.g. GitHub, GitLab, Bitbucket) for a user.
 * Stores under gitAccounts[provider]: { username, accessToken, connectedAt }
 */
export const linkGitAccount = async (uid, provider, accountData) => {
  if (
    !uid ||
    !provider ||
    !accountData?.username ||
    !accountData?.accessToken
  ) {
    throw new Error("Missing required Git account information.");
  }

  const userRef = usersCollection.doc(uid);
  const userSnap = await userRef.get();

  if (!userSnap.exists) {
    throw new Error("User not found");
  }

  const userData = userSnap.data();
  const currentGitAccounts = userData.gitAccounts || {};

  const updatedGitAccounts = {
    ...currentGitAccounts,
    [provider]: {
      username: accountData.username,
      accessToken: accountData.accessToken, // Consider encrypting this in the future
      connectedAt: new Date().toISOString(),
    },
  };

  await userRef.update({
    gitAccounts: updatedGitAccounts,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return {
    message: `${provider} account linked successfully`,
    gitAccounts: updatedGitAccounts,
  };
};

/**
 * Fetch all linked Git accounts for a user.
 */
export const getLinkedGitAccounts = async (uid) => {
  const userSnap = await usersCollection.doc(uid).get();
  if (!userSnap.exists) {
    throw new Error("User not found");
  }

  const userData = userSnap.data();
  return userData.gitAccounts || {};
};

/**
 * Unlink a specific Git provider account (e.g. GitHub, GitLab, Bitbucket).
 */
export const unlinkGitAccount = async (uid, provider) => {
  const userRef = usersCollection.doc(uid);
  const userSnap = await userRef.get();

  if (!userSnap.exists) {
    throw new Error("User not found");
  }

  const userData = userSnap.data();
  const currentGitAccounts = userData.gitAccounts || {};

  if (!currentGitAccounts[provider]) {
    throw new Error(`No ${provider} account linked`);
  }

  delete currentGitAccounts[provider];

  await userRef.update({
    gitAccounts: currentGitAccounts,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return {
    message: `${provider} account unlinked successfully`,
    gitAccounts: currentGitAccounts,
  };
};

/*

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, unique: true }, // Firebase UID
    email: { type: String, required: true, unique: true },
    displayName: { type: String },
    gitPlatform: {
      type: String,
      enum: ["github", "gitlab", "bitbucket"],
      required: true,
    },
    gitUsername: { type: String, required: true },
    linkedRepos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Repo" }], // References Repo model
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;

*/
