import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

// Decode and parse Firebase credentials from environment variable
const serviceAccountJSON = Buffer.from(
  process.env.FIREBASE_CREDENTIALS_BASE64,
  "base64"
).toString("utf-8");

const serviceAccount = JSON.parse(serviceAccountJSON);

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Export Firebase Auth and Firestore
export const auth = admin.auth();
export const db = admin.firestore();

console.log("✅ Firebase Admin SDK initialized successfully.");
