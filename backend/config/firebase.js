import admin from "firebase-admin";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

// Directly import the service account JSON
import serviceAccount from "../config/firebase-service-account.json"; // Adjust the path if needed

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Export Firebase services for use in other parts of the app
export const auth = admin.auth();
export const db = admin.firestore();
