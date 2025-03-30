import admin from "../config/firebase.js";

const db = admin.firestore();
const reposCollection = db.collection("repos");

export const createRepo = async (repoData) => {
  const repoRef = reposCollection.doc();
  await repoRef.set(repoData);
  return { id: repoRef.id, ...repoData };
};

export const getRepoById = async (repoId) => {
  const repoDoc = await reposCollection.doc(repoId).get();
  if (!repoDoc.exists) return null;
  return { id: repoDoc.id, ...repoDoc.data() };
};

export const updateRepo = async (repoId, updateData) => {
  await reposCollection.doc(repoId).update(updateData);
  return { id: repoId, ...updateData };
};

export const deleteRepo = async (repoId) => {
  await reposCollection.doc(repoId).delete();
  return { message: "Repo deleted successfully" };
};

/*

import mongoose from "mongoose";

const repoSchema = new mongoose.Schema(
  {
    repoUrl: { type: String, required: true, unique: true },
    repoName: { type: String, required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // References User model
    branches: [{ type: String }], // List of branches in the repo
    isPrivate: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Repo = mongoose.model("Repo", repoSchema);

export default Repo;

*/
