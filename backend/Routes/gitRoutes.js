import express from "express";
import {
  pushRepo,
  pullRepo,
  mergeBranch,
  addFiles,
  commitChanges,
  initRepo,
  cloneRepo,
  createBranch,
  switchBranch,
  listBranches,
  deleteBranch,
  stashChanges,
  resetRepo,
  checkoutItem,
} from "../Controllers/gitController.js";

import {
  createBranch,
  switchBranch,
  listBranches,
  deleteBranch,
} from "../Controllers/branchController.js";

const router = express.Router();

// ----- Git Basic Operations -----
router.post("/push", pushRepo);
router.post("/pull", pullRepo);
router.post("/merge", mergeBranch);
router.post("/add", addFiles);
router.post("/commit", commitChanges);
router.post("/init", initRepo);
router.post("/clone", cloneRepo);

// ----- Git Branch Management -----
router.post("/branch/create", createBranch);
router.post("/branch/switch", switchBranch);
router.get("/branch/list", listBranches);
router.delete("/branch/delete", deleteBranch);

// New Git commands
router.post("/stash", stashChanges);
router.post("/reset", resetRepo);
router.post("/checkout", checkoutItem);

export default router;
