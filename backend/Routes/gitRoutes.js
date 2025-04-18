import express from "express";
import {
  pushRepo,
  pullRepo,
  mergeBranch,
  addFiles,
  commitChanges,
  initRepo,
  cloneRepo,
  stashChanges,
  resetRepo,
  checkoutBranch,
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

// ----- Git Branch Management (From branchController) -----
router.get("/branch/list", listBranches);
router.post("/branch/create", createBranch);
router.post("/branch/switch", switchBranch);
router.delete("/branch/delete", deleteBranch);

// ----- Additional Git Actions -----
router.post("/stash", stashChanges);
router.post("/reset", resetRepo);
router.post("/checkout", checkoutBranch);

export default router;
