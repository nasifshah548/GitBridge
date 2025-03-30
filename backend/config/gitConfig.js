import path from "path";
import fs from "fs";

// Define the base directory where repositories will be stored
const REPO_BASE_DIR = path.join(process.cwd(), "repositories");

// Ensure the directory exists
if (!fs.existsSync(REPO_BASE_DIR)) {
  fs.mkdirSync(REPO_BASE_DIR, { recursive: true });
}

// Git configurations
const gitConfig = {
  repoBaseDir: REPO_BASE_DIR,
};

export default gitConfig;
