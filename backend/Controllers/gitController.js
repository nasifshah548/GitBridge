import simpleGit from "simple-git";
import path from "path";
import fs from "fs";

// Define the directory where repos will be cloned
const REPO_BASE_DIR = path.join(__dirname, "../../repositories");

// Ensure the directory exists
if (!fs.existsSync(REPO_BASE_DIR)) {
  fs.mkdirSync(REPO_BASE_DIR, { recursive: true });
}

// Clone a repository
const cloneRepo = async (req, res) => {
  const { repoUrl, repoName } = req.body;
  const user = req.user; // Assuming authentication middleware adds this

  if (!repoUrl || !repoName) {
    return res
      .status(400)
      .json({ error: "Repository URL and name are required" });
  }

  try {
    const repoPath = path.join(REPO_BASE_DIR, user.id, repoName);
    if (fs.existsSync(repoPath)) {
      return res.status(400).json({ error: "Repository already exists" });
    }

    await simpleGit().clone(repoUrl, repoPath);
    res.json({ message: "Repository cloned successfully", repoPath });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Pull latest changes
const pullChanges = async (req, res) => {
  const { repoName, branch } = req.body;
  const user = req.user;

  if (!repoName || !branch) {
    return res
      .status(400)
      .json({ error: "Repository name and branch are required" });
  }

  const repoPath = path.join(REPO_BASE_DIR, user.id, repoName);
  if (!fs.existsSync(repoPath)) {
    return res.status(404).json({ error: "Repository not found" });
  }

  try {
    const git = simpleGit(repoPath);
    await git.pull("origin", branch);
    res.json({ message: `Pulled latest changes from ${branch}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Push changes
const pushChanges = async (req, res) => {
  const { repoName, branch, commitMessage } = req.body;
  const user = req.user;

  if (!repoName || !branch || !commitMessage) {
    return res
      .status(400)
      .json({
        error: "Repository name, branch, and commit message are required",
      });
  }

  const repoPath = path.join(REPO_BASE_DIR, user.id, repoName);
  if (!fs.existsSync(repoPath)) {
    return res.status(404).json({ error: "Repository not found" });
  }

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

// Merge branches
const mergeBranches = async (req, res) => {
  const { repoName, sourceBranch, targetBranch } = req.body;
  const user = req.user;

  if (!repoName || !sourceBranch || !targetBranch) {
    return res
      .status(400)
      .json({
        error: "Repository name, source, and target branch are required",
      });
  }

  const repoPath = path.join(REPO_BASE_DIR, user.id, repoName);
  if (!fs.existsSync(repoPath)) {
    return res.status(404).json({ error: "Repository not found" });
  }

  try {
    const git = simpleGit(repoPath);
    await git.checkout(targetBranch);
    await git.mergeFromTo(sourceBranch, targetBranch);
    res.json({ message: `Merged ${sourceBranch} into ${targetBranch}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Check repository status
const repoStatus = async (req, res) => {
  const { repoName } = req.body;
  const user = req.user;

  if (!repoName) {
    return res.status(400).json({ error: "Repository name is required" });
  }

  const repoPath = path.join(REPO_BASE_DIR, user.id, repoName);
  if (!fs.existsSync(repoPath)) {
    return res.status(404).json({ error: "Repository not found" });
  }

  try {
    const git = simpleGit(repoPath);
    const status = await git.status();
    res.json({ status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// List all branches
const listBranches = async (req, res) => {
  const { repoName } = req.body;
  const user = req.user;

  if (!repoName) {
    return res.status(400).json({ error: "Repository name is required" });
  }

  const repoPath = path.join(REPO_BASE_DIR, user.id, repoName);
  if (!fs.existsSync(repoPath)) {
    return res.status(404).json({ error: "Repository not found" });
  }

  try {
    const git = simpleGit(repoPath);
    const branches = await git.branch(["-a"]);
    res.json({ branches });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  cloneRepo,
  pullChanges,
  pushChanges,
  mergeBranches,
  repoStatus,
  listBranches,
};
