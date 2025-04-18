import axios from "axios";

// Create an axios instance with default config
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Firebase Auth token dynamically if needed
axiosInstance.interceptors.request.use(
  async (config) => {
    const user = JSON.parse(localStorage.getItem("firebaseUser"));
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ========== GIT ACTIONS ==========

export const cloneRepository = async (repoUrl) => {
  try {
    const response = await axiosInstance.post("/repos/clone", { repoUrl });
    return response.data;
  } catch (error) {
    console.error("Clone error:", error);
    throw error.response?.data || { error: "Clone failed" };
  }
};

export const initRepository = async () => {
  try {
    const response = await axiosInstance.post("/repos/init");
    return response.data;
  } catch (error) {
    console.error("Init error:", error);
    throw error.response?.data || { error: "Init failed" };
  }
};

export const commitChanges = async (commitMessage) => {
  try {
    const response = await axiosInstance.post("/repos/commit", {
      commitMessage,
    });
    return response.data;
  } catch (error) {
    console.error("Commit error:", error);
    throw error.response?.data || { error: "Commit failed" };
  }
};

export const pushRepository = async () => {
  try {
    const response = await axiosInstance.post("/repos/push");
    return response.data;
  } catch (error) {
    console.error("Push error:", error);
    throw error.response?.data || { error: "Push failed" };
  }
};

// ========== BRANCH OPERATIONS ==========

export const listBranches = async () => {
  try {
    const response = await axiosInstance.get("/repos/branches");
    return response.data;
  } catch (error) {
    console.error("List branches error:", error);
    throw error.response?.data || { error: "Failed to list branches" };
  }
};

export const createBranch = async (branchName) => {
  try {
    const response = await axiosInstance.post("/repos/branches/create", {
      branchName,
    });
    return response.data;
  } catch (error) {
    console.error("Create branch error:", error);
    throw error.response?.data || { error: "Failed to create branch" };
  }
};

export const switchBranch = async (branchName) => {
  try {
    const response = await axiosInstance.post("/repos/branches/switch", {
      branchName,
    });
    return response.data;
  } catch (error) {
    console.error("Switch branch error:", error);
    throw error.response?.data || { error: "Failed to switch branch" };
  }
};

export const deleteBranch = async (branchName) => {
  try {
    const response = await axiosInstance.post("/repos/branches/delete", {
      branchName,
    });
    return response.data;
  } catch (error) {
    console.error("Delete branch error:", error);
    throw error.response?.data || { error: "Failed to delete branch" };
  }
};

// ========== ADVANCED GIT ACTIONS ==========

export const stashChanges = async () => {
  try {
    const response = await axiosInstance.post("/repos/stash");
    return response.data;
  } catch (error) {
    console.error("Stash error:", error);
    throw error.response?.data || { error: "Failed to stash changes" };
  }
};

export const resetRepo = async () => {
  try {
    const response = await axiosInstance.post("/repos/reset");
    return response.data;
  } catch (error) {
    console.error("Reset error:", error);
    throw error.response?.data || { error: "Failed to reset repository" };
  }
};

export const checkoutBranch = async (branchName) => {
  try {
    const response = await axiosInstance.post("/repos/checkout", {
      branchName,
    });
    return response.data;
  } catch (error) {
    console.error("Checkout error:", error);
    throw error.response?.data || { error: "Failed to checkout branch" };
  }
};

// ========== GIT ACCOUNT LINKS ==========

export const getLinkedGitAccounts = async () => {
  try {
    const response = await axiosInstance.get("/auth/git-accounts");
    return response.data;
  } catch (error) {
    console.error("Fetch linked accounts error:", error);
    throw error.response?.data || { error: "Failed to fetch linked accounts" };
  }
};

export const unlinkGitAccount = async (provider) => {
  try {
    const response = await axiosInstance.delete(
      `/auth/git-accounts/${provider}`
    );
    return response.data;
  } catch (error) {
    console.error("Unlink error:", error);
    throw error.response?.data || { error: "Failed to unlink account" };
  }
};
