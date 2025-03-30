import express from "express";
import {
  listRepos,
  cloneRepo,
  deleteRepo,
} from "../Controllers/repoController.js";
import authenticateUser from "../middleware/authMiddleware.js";

const router = express.Router();

// List all repositories for the authenticated user
router.get("/", authenticateUser, listRepos);

// Clone a new repository
router.post("/clone", authenticateUser, cloneRepo);

// Delete a repository
router.delete("/delete", authenticateUser, deleteRepo);

export default router;
