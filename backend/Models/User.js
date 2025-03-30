import admin from "../config/firebase.js";

const db = admin.firestore();
const usersCollection = db.collection("users");

export const createUser = async (userData) => {
  const userRef = usersCollection.doc(userData.uid);
  await userRef.set(userData);
  return { id: userRef.id, ...userData };
};

export const getUserByUid = async (uid) => {
  const userDoc = await usersCollection.doc(uid).get();
  if (!userDoc.exists) return null;
  return { id: userDoc.id, ...userDoc.data() };
};

export const updateUser = async (uid, updateData) => {
  await usersCollection.doc(uid).update(updateData);
  return { uid, ...updateData };
};

export const deleteUser = async (uid) => {
  await usersCollection.doc(uid).delete();
  return { message: "User deleted successfully" };
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
