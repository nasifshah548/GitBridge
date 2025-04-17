import simpleGit from "simple-git";
import path from "path";
import fs from "fs";

// Define the directory where repos will be cloned
const REPO_BASE_DIR = path.join(process.cwd(), "repositories");

// Ensure the directory exists
if (!fs.existsSync(REPO_BASE_DIR)) {
  fs.mkdirSync(REPO_BASE_DIR, { recursive: true });
}

// Utility to get repo path
const getRepoPath = (userId, repoName) =>
  path.join(REPO_BASE_DIR, userId, repoName);

// PUSH
const pushRepo = async (req, res) => {
  const { repoName, branch, commitMessage } = req.body;
  const user = req.user;

  if (!repoName || !branch || !commitMessage) {
    return res.status(400).json({
      error: "Repository name, branch, and commit message are required",
    });
  }

  const repoPath = getRepoPath(user.id, repoName);
  if (!fs.existsSync(repoPath))
    return res.status(404).json({ error: "Repository not found" });

  try {
    const git = simpleGit(repoPath);
    await git.add("./*");
    await git.commit(commitMessage);
    await git.push("origin", branch);
    res.json({ message: `Pushed changes to ${branch}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PULL
const pullRepo = async (req, res) => {
  const { repoName, branch } = req.body;
  const user = req.user;

  if (!repoName || !branch)
    return res
      .status(400)
      .json({ error: "Repository name and branch are required" });

  const repoPath = getRepoPath(user.id, repoName);
  if (!fs.existsSync(repoPath))
    return res.status(404).json({ error: "Repository not found" });

  try {
    const git = simpleGit(repoPath);
    await git.pull("origin", branch);
    res.json({ message: `Pulled latest changes from ${branch}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// MERGE
const mergeBranch = async (req, res) => {
  const { repoName, sourceBranch, targetBranch } = req.body;
  const user = req.user;

  if (!repoName || !sourceBranch || !targetBranch) {
    return res.status(400).json({
      error: "Repository name, source, and target branch are required",
    });
  }

  const repoPath = getRepoPath(user.id, repoName);
  if (!fs.existsSync(repoPath))
    return res.status(404).json({ error: "Repository not found" });

  try {
    const git = simpleGit(repoPath);
    await git.checkout(targetBranch);
    await git.mergeFromTo(sourceBranch, targetBranch);
    res.json({ message: `Merged ${sourceBranch} into ${targetBranch}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ADD FILES
const addFiles = async (req, res) => {
  const { repoName } = req.body;
  const user = req.user;

  if (!repoName)
    return res.status(400).json({ error: "Repository name is required" });

  const repoPath = getRepoPath(user.id, repoName);
  if (!fs.existsSync(repoPath))
    return res.status(404).json({ error: "Repository not found" });

  try {
    const git = simpleGit(repoPath);
    await git.add("./*");
    res.json({ message: "Files added to staging" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// COMMIT
const commitChanges = async (req, res) => {
  const { repoName, commitMessage } = req.body;
  const user = req.user;

  if (!repoName || !commitMessage) {
    return res
      .status(400)
      .json({ error: "Repository name and commit message are required" });
  }

  const repoPath = getRepoPath(user.id, repoName);
  if (!fs.existsSync(repoPath))
    return res.status(404).json({ error: "Repository not found" });

  try {
    const git = simpleGit(repoPath);
    await git.commit(commitMessage);
    res.json({ message: `Committed changes: ${commitMessage}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// STASH
const stashChanges = async (req, res) => {
  const { repoName, message } = req.body;
  const user = req.user;

  const repoPath = getRepoPath(user.id, repoName);
  if (!fs.existsSync(repoPath))
    return res.status(404).json({ error: "Repository not found" });

  try {
    const git = simpleGit(repoPath);
    await git.stash(["push", "-m", message || "Auto stash"]);
    res.json({ message: `Changes stashed: ${message}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// RESET
const resetRepo = async (req, res) => {
  const { repoName, mode, commitHash } = req.body;
  const user = req.user;

  const repoPath = getRepoPath(user.id, repoName);
  if (!fs.existsSync(repoPath))
    return res.status(404).json({ error: "Repository not found" });

  try {
    const git = simpleGit(repoPath);
    await git.reset([mode || "--soft", commitHash || "HEAD~1"]);
    res.json({ message: `Repository reset with mode ${mode || "--soft"}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CHECKOUT
const checkoutBranch = async (req, res) => {
  const { repoName, branch } = req.body;
  const user = req.user;

  const repoPath = getRepoPath(user.id, repoName);
  if (!fs.existsSync(repoPath))
    return res.status(404).json({ error: "Repository not found" });

  try {
    const git = simpleGit(repoPath);
    await git.checkout(branch);
    res.json({ message: `Switched to branch: ${branch}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  pushRepo,
  pullRepo,
  mergeBranch,
  addFiles,
  commitChanges,
  stashChanges,
  resetRepo,
  checkoutBranch,
};
