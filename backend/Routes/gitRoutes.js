import express from "express";
import {
  pushRepo,
  pullRepo,
  mergeBranch,
  addFiles,
  commitChanges,
} from "../Controllers/gitController.js";

const router = express.Router();

// Route to push changes to a repository
router.post("/push", pushRepo);

// Route to pull changes from a repository
router.post("/pull", pullRepo);

// Route to merge branches
router.post("/merge", mergeBranch);

// Route to add files to staging
router.post("/add", addFiles);

// Route to commit changes
router.post("/commit", commitChanges);

export default router;
