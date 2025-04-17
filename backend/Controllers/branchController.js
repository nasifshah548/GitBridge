// controllers/branchController.js
import { exec } from "child_process";
import path from "path";
import { promisify } from "util";

const execAsync = promisify(exec);

// Helper to get repo path (customize if needed)
const getRepoPath = () => path.join(process.cwd(), "repos", "user-repo");

export const createBranch = async (req, res) => {
  const { branchName } = req.body;
  try {
    const { stdout } = await execAsync(`git checkout -b ${branchName}`, {
      cwd: getRepoPath(),
    });
    res.status(200).json({
      success: true,
      message: `Branch '${branchName}' created.`,
      stdout,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const switchBranch = async (req, res) => {
  const { branchName } = req.body;
  try {
    const { stdout } = await execAsync(`git checkout ${branchName}`, {
      cwd: getRepoPath(),
    });
    res.status(200).json({
      success: true,
      message: `Switched to branch '${branchName}'`,
      stdout,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const listBranches = async (req, res) => {
  try {
    const { stdout } = await execAsync(`git branch`, {
      cwd: getRepoPath(),
    });
    const branches = stdout
      .split("\n")
      .map((b) => b.trim())
      .filter(Boolean);
    res.status(200).json({ success: true, branches });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteBranch = async (req, res) => {
  const { branchName } = req.body;
  try {
    const { stdout } = await execAsync(`git branch -d ${branchName}`, {
      cwd: getRepoPath(),
    });
    res.status(200).json({
      success: true,
      message: `Branch '${branchName}' deleted.`,
      stdout,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
