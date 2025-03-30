import admin from "firebase-admin";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

// Define the correct path to the service account JSON file
const serviceAccountPath = path.resolve(
  "config/gitbridge-app-firebase-adminsdk-fbsvc-68075fea2c.json"
);

// Check if the file exists before reading
if (!fs.existsSync(serviceAccountPath)) {
  throw new Error(`Service account file not found: ${serviceAccountPath}`);
}

// Read and parse the JSON file
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Export Firebase Auth and Firestore
export const auth = admin.auth();
export const db = admin.firestore();

console.log("✅ Firebase Admin SDK initialized successfully.");
