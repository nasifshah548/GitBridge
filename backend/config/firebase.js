import admin from "firebase-admin";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Import the service account JSON file
import serviceAccount from "./gitbridge-app-firebase-adminsdk-fbsvc-68075fea2c.json" assert { type: "json" };

// Initialize Firebase Admin SDK with the service account
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Export Firebase services to use in other parts of the app
export const auth = admin.auth();
export const db = admin.firestore();

console.log("Firebase Admin SDK initialized successfully.");
